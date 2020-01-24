const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
// const rtg   = require("url").parse(process.env.REDISTOGO_URL);
const redis = require('redis');
const client = redis.createClient(); // use in dev mode
// const client = redis.createClient(rtg.port, rtg.hostname);
// client.auth(rtg.auth.split(":")[1]);
const puppet = require('puppeteer');

client.on('error', function(err) {
    console.log(`Redis error: ${err}`);
});

async function getAmazon () {
    const mainUrl = "https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=jack%ryan&country=us";
    const newUrl = new URL(mainUrl);
    const term = newUrl.searchParams.get("term");
    const response = await fetch(mainUrl, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com",
            "x-rapidapi-key": "efb91e24f9msh59eb1e9f249dd35p159876jsnef3bd6fb511e"
        }
    })
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
        let desc = document.getElementsByClassName('_1npiSz')[0].innerText;  
        let outer = document.querySelector('span[class=_23t6YR]');
        let inner = outer.querySelector('a').getAttribute('aria-label');
        let imdbOut = document.getElementsByClassName('_23t6YR AtzNiv');
        let imdbIn = imdbOut[0].querySelector('span[data-automation-id=imdb-rating-badge]').getAttribute('aria-label');
        let year = document.querySelector('span[data-automation-id=release-year-badge]').innerText;
        api.description = desc;
        api.rating = inner;
        api.imdbRating = imdbIn;
        api.year = year;
        return api;
    });
    const page2 = await browser.newPage();
    await page2.goto('https://www.google.com/');
    await page2.waitForSelector('input[type=text]');
    await page2.type('input[type=text]', `${term} trailer`);
    await page2.waitForSelector('input[type=submit]');
    await page2.keyboard.press('Enter');
    await page2.waitForSelector('div[class=twQ0Be]');
    let trailer_api = await page2.evaluate(() => {
        let api = {};
        let video = document.querySelector('div[class=twQ0Be]').querySelector('a').href;
        api.video = video;
        return api;
    });
    await browser.close();
    return [data, api_data, trailer_api];
}

router.get('/amazon', (req, res) => {
    const RedisKey = 'Amazon';

    client.get(RedisKey, function (err, data) {
        if (data) {
            console.log('Key found... now caching...');
            res.json({ source: 'cached', data: JSON.parse(data) });
        } else {
            getAmazon()
            .then(data => {
                console.log('not cached... now calling api...');
                client.setex(RedisKey, 3600, JSON.stringify(data));
                return res.json({ source: 'api', data: data });
            })
            .catch(err => {
                console.log(err);
            });
        }
    });
    console.log('sent data from endpoint /amazon');
});

module.exports = router;