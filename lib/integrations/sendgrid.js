/**
 * Created by USER on 02/03/2018.
 */
const Log = require('../utils/logger');
const sgMail = require('@sendgrid/mail');

module.exports = function postToSendgrid(options) {
  return new Promise((resolve, reject) => {
    const {
      apiKey, to, from, text,
    } = options;
    sgMail.setApiKey(apiKey);
    const msg = {
      to,
      from,
      subject: 'Pipeline Report:',
      text,
    };
    sgMail.send(msg);
    Log.d(`Successively sent a mail to ${to} through sendgrid`);
    resolve(); '';
  });
};
