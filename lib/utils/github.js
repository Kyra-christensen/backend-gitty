const fetch = require('cross-fetch');

const exchangeCodeForToken = async (code) => {
  const token = fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    body: {
      code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    },
    headers: {
      Accept: 'application/json'
    }
  });
  return token;
};
module.exports = { exchangeCodeForToken };
