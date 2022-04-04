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

const getGithubProfile = async (token) => {
  const response = await fetch('https://api.github.com/user', {
    method: 'GET',
    headers: {
      Authorization: `token ${token}`
    }
  });
  return response;

};
module.exports = { exchangeCodeForToken, getGithubProfile };
