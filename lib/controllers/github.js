const { Router } = require('express');
const GithubService = require('../services/GithubService');
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
const { sign } = require('../utils/jwt');


module.exports = Router()
  .get('/login', (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=${process.env.REDIRECT_URI}`
    );
  })

  .get('/login/callback', (req, res, next) => {
    GithubService.create(req.query.code)
      .then((user) => {
        res.cookie(process.env.COOKIE_NAME, sign(user), { httpOnly: true, maxAge: ONE_DAY_IN_MS
        }).redirect('/api/v1/posts');
      })
      .catch((error) => next(error));

    // try {
    //   const user = await GithubService.create(req.query.code);

    //   const payload = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
    //     expiresIn: '1 day',
    //   });

    //   res
    //     .cookie(process.env.COOKIE_NAME, payload, {
    //       httpOnly: true,
    //       maxAge: ONE_DAY_IN_MS,
    //     })
    //     .redirect('/api/v1/posts');
    // } catch (error) {
    //   next(error);
    // }
  })

  .delete('/', (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME)
      .json({ success: true, message: 'Signed out successfully!' });
  });
