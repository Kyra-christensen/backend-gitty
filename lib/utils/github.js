const fetch = require('cross-fetch');
const { response } = require('express');

const exchangeCodeForToken = async (code) => {
  fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    body: {
      code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    },
    headers: {
      Accept: 'application/json'
    }
  })
    .then((token) => response.json(token));
};

const getGithubProfile = async (token) => {
  const response = await fetch('https://api.github.com/user', {
    method: 'GET',
    headers: {
      Authorization: `token ${token}`
    }
  })
    .then(({ avatar_url, login }) => response.json({ avatar_url, login }));

};
module.exports = { exchangeCodeForToken, getGithubProfile };
