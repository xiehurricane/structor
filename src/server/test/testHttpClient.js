import HttpClient from '../src/HttpClient.js';

let client = new HttpClient();

client.get('https://api.github.com')
    .then( response => {
        console.log(JSON.stringify(response, null, 4));
        //console.log(response);
    })
    .catch( err => {
        console.error(JSON.stringify(err, null, 4));
    });

client.get('https://api.github.com/repos/ipselon/structor-market-site')
    .then( response => {
        console.log(JSON.stringify(response, null, 4));
        //console.log(response);
    })
    .catch( err => {
        console.error(JSON.stringify(err, null, 4));
    });

client.get('https://api.github.com/repos/ipselon/structor/downloads')
    .then( response => {
        console.log(JSON.stringify(response, null, 4));
        //console.log(response);
    })
    .catch( err => {
        console.error(JSON.stringify(err, null, 4));
    });


