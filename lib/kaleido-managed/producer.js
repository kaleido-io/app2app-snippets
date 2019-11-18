'use strict';

const common = require('../common');

const socket = require('socket.io-client').connect(common.API_ENDPOINT,
  {
    extraHeaders: {
      Authorization: 'Basic ' + Buffer.from(common.APP_CREDENTIAL.USER +
        ':' + common.APP_CREDENTIAL.PASSWORD).toString('base64')
    }
  })
  .on('connect', () => {
    console.log('Producer connected.');
    send();
  }).on('delivery-report', data => {
    console.log('Delivery report key: ' + data.key.toString() + ', timestamp: ' + data.timestamp);
  }).on('disconnect', () => {
    console.log('Producer disconnected.');
  }).on('exception', exception => {
    console.log('Exception: ' + exception);
  }).on('error', err => {
    console.log('Error: ' + err);
  }).on('connect_error', err => {
    console.log('Connection error: ' + err);
  });

function send() {
  socket.emit('produce', {
    headers: {
      from: common.DESTINATIONS.KALEIDO_MANAGED,
      to: common.DESTINATIONS.KALEIDO_MANAGED,
    }
    , content: 'Testing 1-2-3'
  },
    'samplekey',
    err => {
      if (err) {
        console.log('Delivery error: ' + err);
      }
    });
}