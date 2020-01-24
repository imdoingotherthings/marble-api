const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
// const rtg   = require("url").parse(process.env.REDISTOGO_URL);
const redis = require('redis');
const client = redis.createClient();
// client.auth(rtg.auth.split(":")[1]);
const puppet = require('puppeteer');

client.on('error', function(err) {
    console.log(`Redis error: ${err}`);
});

async function getNetflix () {
    const response = await fetch("https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=mad%20men", {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com",
            "x-rapidapi-key": "efb91e24f9msh59eb1e9f249dd35p159876jsnef3bd6fb511e"
        }
    });
    const data = await response.json();
    let url = (data['results'][0]['locations'][0]['url']);
    const browser = await puppet.launch({
        headless: true,
        args: [
            '--no-sandbox', 
            "--proxy-server='direct://'",
            '--proxy-bypass-list=*',
            '--disable-setuid-sandbox',
            '--ignore-certificate-errors'
        ]
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
    await page.goto(url);
    let api_data = await page.evaluate(() => {
        let api = {};
        let desc = document.querySelector('div[class=title-info-synopsis]').innerText;
        let year = document.querySelector('span[data-uia=item-year]').innerText;
        let seasons = document.querySelector('span[class=test_dur_str]').innerText;
        let tv = document.querySelector('span[class=maturity-number]').innerText;
        let logo = document.querySelector('img[data-uia=title-logo]').src;
        api.description = desc;
        api.seasons = seasons;
        api.tv_rating = tv;
        api.logo = logo;
        api.year = year;
        return api;
    });
    await browser.close();
    return [data, api_data];
}

router.get('/netflix', (req, res) => {
    const RedisKey = 'Netflix';

    client.get(RedisKey, function (err, data) {
        if (data) {
            console.log('Key found... now caching...');
            res.json({ source: 'cached', data: JSON.parse(data) });
        } else {
            getNetflix()
            .then(data => {
                console.log('not cached... now calling api...');
                client.setex(RedisKey, 5, JSON.stringify(data));
                return res.json({ source: 'api', data: data });
            })
            .catch(err => {
                console.log(err);
            });
        }
    });
    console.log('sent data from endpoint /netflix');
});

module.exports = router;