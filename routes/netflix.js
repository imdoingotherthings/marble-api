const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const rtg   = require("url").parse(process.env.REDISTOGO_URL);
const redis = require('redis');
const client = redis.createClient(rtg.port, rtg.hostname);
client.auth(rtg.auth.split(":")[1]);

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
    return data;
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
                client.setex(RedisKey, 3600, JSON.stringify(data));
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