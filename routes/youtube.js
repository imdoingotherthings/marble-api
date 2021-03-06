const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const rtg   = require("url").parse(process.env.REDISTOGO_URL);
const redis = require('redis');
// const client = redis.createClient(); // use in dev mode
const client = redis.createClient(rtg.port, rtg.hostname);
client.auth(rtg.auth.split(":")[1]);
const puppet = require('puppeteer');

client.on('error', function(err) {
    console.log(`Redis error: ${err}`);
});

async function getYoutube () {
    const mainUrl = "https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=wayne";
    const newUrl = new URL(mainUrl);
    const term = newUrl.searchParams.get("term");
    const response = await fetch(mainUrl, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com",
            "x-rapidapi-key": "efb91e24f9msh59eb1e9f249dd35p159876jsnef3bd6fb511e"
        }
    });
    const data = await response.json();
    const url = await data['results'][1]['locations'][0]['url'];
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
        let arr = [];
        let videoArr = [];
        let video = document.getElementById('video-title');
        let desc = video.getAttribute('aria-label');
        let title = video.getAttribute('title'); 
        let m = document.getElementsByTagName('meta');
        let v = document.getElementsByClassName('yt-simple-endpoint inline-block style-scope ytd-thumbnail');
        for (let j = 0; j < m.length; j++) {
            if (m[j].getAttribute('name') === 'twitter:description') {
                arr.push(m[j].getAttribute('content'));
            }
        }
        for (let i = 0; i < v.length; i++) {
            videoArr.push(v[i].href);
        }
        api.description = desc;
        api.title = title;
        api.meta_data = arr;
        api.video = videoArr;
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

router.get('/youtube', (req, res) => {
    const RedisKey = 'Youtube';

    client.get(RedisKey, function (err, data) {
        if (data) {
            console.log('Key found... now caching...');
            res.json({ source: 'cached', data: JSON.parse(data) });
        } else {
            getYoutube()
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
    console.log('sent data from endpoint /youtube');
});

module.exports = router;