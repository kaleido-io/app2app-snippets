'use strict';

const common = require('../common');

const socket = require('socket.io-client').connect(common.API_ENDPOINT + '?auto_commit=false',
  {
    extraHeaders: {
      Authorization: 'Basic ' + Buffer.from(common.APP_CREDENTIAL.USER +
        ':' + common.APP_CREDENTIAL.PASSWORD).toString('base64')
    }
  })
  .on('connect', () => {
    console.log('Consumer connected.')
    socket.emit('subscribe', [common.DESTINATIONS.KALEIDO_MANAGED], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    });
  }).on('disconnect', () => {
    console.log('Consumer disconnected.');
  }).on('exception', exception => {
    console.log('Exception: ' + exception);
  }).on('error', err => {
    console.log('Error: ' + err);
  }).on('connect_error', err => {
    console.log('Connection error: ' + err);
  }).on('data', (message, key, timestamp) => {
    console.log('Message from: ' + message.headers.from);
    console.log('Content: ' + message.content);
    console.log('key: ' + key);
    console.log('timestamp: ' + timestamp);
    socket.emit('commit');
    console.log('Commit emitted')
  });