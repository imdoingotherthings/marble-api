const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/amazon', (req, res) => {
    // fetch("https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=jack%ryan", {
    //     "method": "GET",
    //     "headers": {
    //         "x-rapidapi-host": "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com",
    //         "x-rapidapi-key": "efb91e24f9msh59eb1e9f249dd35p159876jsnef3bd6fb511e"
    //     }
    // })
    // .then(response => {
    //     return response.json();
    // })
    // .then(data => {
    //     console.log(data['results'][0]['locations']);
    // })
    // .catch(err => {
    //     console.log(err);
    // });
    const data = [ { icon:
        'https://utellyassets7.imgix.net/locations_icons/utelly/black_new/AmazonPrimeVideoIVAGB.png?w=92&auto=compress&app_version=a0041586-5e2a-4a1d-8e92-e9d1d3a9feaf_erss2020-01-22',
       display_name: 'Amazon Prime Video',
       name: 'AmazonPrimeVideoIVAGB',
       id: '5d84d6ddd95dc7385f6a43e5',
       url:
        'https://www.amazon.co.uk/gp/product/B07GHB1WYY?creativeASIN=B07GHB1WYY&ie=UTF8&linkCode=xm2&tag=utellycom00-21' },
     { icon:
        'https://utellyassets7.imgix.net/locations_icons/utelly/black_new/iTunesIVAGB.png?w=92&auto=compress&app_version=a0041586-5e2a-4a1d-8e92-e9d1d3a9feaf_erss2020-01-22',
       display_name: 'iTunes',
       name: 'iTunesIVAGB',
       id: '5d8415b3ca549f00528a99f0',
       url:
        'https://itunes.apple.com/gb/tv-season/the-wolf/id1474308581?i=1474393087' },
     { icon:
        'https://utellyassets7.imgix.net/locations_icons/utelly/black_new/AmazonInstantVideoIVAGB.png?w=92&auto=compress&app_version=a0041586-5e2a-4a1d-8e92-e9d1d3a9feaf_erss2020-01-22',
       display_name: 'Amazon Instant Video',
       name: 'AmazonInstantVideoIVAGB',
       id: '5d8415b31e1521005490e1bc',
       url:
        'https://www.amazon.co.uk/gp/product/B07GHB1WYY?creativeASIN=B07GHB1WYY&ie=UTF8&linkCode=xm2&tag=utellycom00-21' },
     { icon:
        'https://utellyassets7.imgix.net/locations_icons/utelly/black_new/GooglePlayIVAGB.png?w=92&auto=compress&app_version=a0041586-5e2a-4a1d-8e92-e9d1d3a9feaf_erss2020-01-22',
       display_name: 'Google Play',
       name: 'GooglePlayIVAGB',
       id: '5d84d6dcd95dc7385f6a43e1',
       url:
        'https://play.google.com/store/tv/show?amp=&amp=&cdid=tvseason-zzcpA-biDg-7K62LabUOvg&gdid=tvepisode-qQq4o8J4YBA&gl=GB&hl=en&id=zpGSvPh6EjEhUvPV45Rs5w' } ];
    res.json(data);
    console.log('sent data from endpoint /amazon');
});

module.exports = router;