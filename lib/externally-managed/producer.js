'use strict';

const fs = require('fs');
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
    console.log('Service reported an exception: ' + exception);
  }).on('error', err => {
    console.log('Error: ' + err);
  }).on('connect_error', err => {
    console.log('Connection error: ' + err);
  });

function send() {
  const content = 'Testing 1-2-3'
  const producerPrivateKeyPEM = fs.readFileSync(__dirname + '/cert/key.pem', {encoding: 'UTF-8'});
  const signature = require('crypto').createSign('RSA-SHA256').update(content).sign(producerPrivateKeyPEM);
  socket.emit('produce', {
    headers: {
      from: common.DESTINATIONS.EXTERNALLY_MANAGED,
      to: common.DESTINATIONS.EXTERNALLY_MANAGED,
      signature
    }
    , content
  },
    'samplekey',
    err => {
      if (err) {
        console.log('Delivery error: ' + err);
      }
    });
}