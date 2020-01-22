const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/youtube', (req, res) => {
    // fetch("https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=wayne", {
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
    //     console.log(data['results'][1]);
    //     console.log(data['results'][1]['locations'][0]);
    // })
    // .catch(err => {
    //     console.log(err);
    // });
    const data = { id: '5d992d85302b840050537018',
    picture:
     'https://utellyassets9-1.imgix.net/api/Images/fa6d7866d1c572ead038f3b38e218069/Redirect',
    name: 'Wayne',
    locations:
     [ { icon:
          'https://utellyassets7.imgix.net/locations_icons/utelly/black_new/YouTubePremiumIVAGB.png?w=92&auto=compress&app_version=a0041586-5e2a-4a1d-8e92-e9d1d3a9feaf_erss2020-01-22',
         display_name: 'YouTube Premium',
         name: 'YouTubePremiumIVAGB',
         id: '5d84d6e5d95dc7385f6a444f',
         url:
          'https://www.youtube.com/playlist?list=PLLtYcdNLQ8ZQZ9UsdinNFlqxkOwgydajt' } ],
    provider: 'iva',
    weight: 0 }
    const data2 = { icon:
        'https://utellyassets7.imgix.net/locations_icons/utelly/black_new/YouTubePremiumIVAGB.png?w=92&auto=compress&app_version=a0041586-5e2a-4a1d-8e92-e9d1d3a9feaf_erss2020-01-22',
       display_name: 'YouTube Premium',
       name: 'YouTubePremiumIVAGB',
       id: '5d84d6e5d95dc7385f6a444f',
       url:
        'https://www.youtube.com/playlist?list=PLLtYcdNLQ8ZQZ9UsdinNFlqxkOwgydajt' }
    const finalData = [data, data2];
    res.json(finalData);
    console.log('sent data from endpoint /youtube');
});

module.exports = router;