require('dotenv').config();
const fetch = require('node-fetch');

const authUrl = 'api/0/auth/access_token';

module.exports = {
  async getToken() {
    const host = process.env.IIKO_HOST;
    const user_id = process.env.IIKO_LOGIN;
    const user_secret = process.env.IIKO_PASSWORD;
    const url = `${host}/${authUrl}?user_id=${user_id}&user_secret=${user_secret}`;
    return fetch(url)
      .then(res => res.text())
      .then(token => token.replace(/"/g, ''));
  }
}