const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const redis = require('redis');
const client = redis.createClient();

async function getYoutube () {
    const response = await fetch("https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=wayne", {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com",
            "x-rapidapi-key": "efb91e24f9msh59eb1e9f249dd35p159876jsnef3bd6fb511e"
        }
    });
    const data = await response.json();
    return data;
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