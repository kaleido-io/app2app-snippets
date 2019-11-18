'use strict';

const axios = require('axios');
const common = require('./common');

const REST_API_ENDPOINT = 'https' + common.API_ENDPOINT.substr(3);

axios({
    url: REST_API_ENDPOINT + '/addressbook',
    auth: {
      username: common.APP_CREDENTIAL.USER,
      password: common.APP_CREDENTIAL.PASSWORD
    }
}).then(response => {
  console.log(JSON.stringify(response.data, null, 2));
}).catch(err => {
  console.log('Failed to access address book: ' + err);
});