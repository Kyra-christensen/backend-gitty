const { Router } = require('express');
const jwt = require('jsonwebtoken');
const GithubUser = require('../models/GithubUser');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .get('/login', async (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=${process.env.REDIRECT_URI}`
    );
  })

  .get('/login/callback', async (req, res, next) => {
    try {
      const { code } = req.query;

      const token = await exchangeCodeForToken(code);

      const profile = await getGithubProfile(token);

      let user = await GithubUser.findByEmail(profile.email);

      if(!user) {
        user = await GithubUser.insert({
          username: profile.login,
          email: profile.email,
          avatarUrl: profile.avatar_url
        });
      }
      
      const payload = jwt.sign(user.toJSON(), process.env.JWT_SECRET, { expiresIn: '1 day' });

      res
        .cookie(process.env.COOKIE_NAME, payload, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .send({ message: 'Successfully signed in!', user });
    } catch (error) {
      next(error);
    }
  });
