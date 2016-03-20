import Client from '../src/Client.js';
import StateManager from '../src/StateManager.js';

let sm = new StateManager();

sm.setIn('client.serviceURL', 'https://helmetrex.com');


let client = new Client(sm);

client.get('https://helmetrex.com/iyoiuysm/public/gallery/list')
    .then( response => {
        console.log(JSON.stringify(response, null, 4));
    })
    .catch( err => {
        console.error(JSON.stringify(err, null, 4));
    });
