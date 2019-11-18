'use strict';

const fs = require('fs');
const common = require('../common');

const socket = require('socket.io-client').connect(common.API_ENDPOINT,
  {
    extraHeaders: {
      Authorization: 'Basic ' + Buffer.from(common.APP_CREDENTIAL.USER + ':' +
        common.APP_CREDENTIAL.PASSWORD).toString('base64')
    }
  })
  .on('connect', () => {
    console.log('Consumer connected.');
    socket.emit('subscribe', [common.DESTINATIONS.EXTERNALLY_MANAGED], (err, result) => {
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
  }).on('data', (pkcs7Envelope, key, timestamp) => {

    const forge = require('node-forge');
    const pkcs7 = forge.pkcs7.messageFromPem(pkcs7Envelope);
    const consumerPrivateKeyPEM = fs.readFileSync(__dirname + '/cert/key.pem', { encoding: 'UTF-8' });
    pkcs7.decrypt(pkcs7.recipients[0], forge.pki.privateKeyFromPem(consumerPrivateKeyPEM));
    const message = JSON.parse(pkcs7.content.toString());
    console.log('Message: ' + message.content);
    console.log('Key: ' + key + ', timestamp: ' + timestamp);

    const producerCertPEM = fs.readFileSync(__dirname + '/cert/cert.pem', { encoding: 'UTF-8' });
    console.log('Signature checks out: ' +
      require('crypto').createVerify('RSA-SHA256')
        .update(message.content)
        .verify(producerCertPEM,
          Buffer.from(message.headers.signature)));
  });