const { Router } = require('express');
const Post =  require('../models/Post');
const authenticate = require('../middleware/authenticate');

module.exports = Router()
  .post('/', authenticate, async (req, res, next) => {
    Post.insert({
      ...req.body,
      username: req.user.username
    })
      .then((post) => res.send(post))
      .catch((error) => next(error));

    
    // const post = await Post.insert(req.body);
    // res.send(post);
  })

  .get('/', authenticate, async (req, res, next) => {
    Post.getAllPosts({
      ...req.body
    })
      .then((post) => res.send(post))
      .catch((error) => next(error));


    // try {
    //   const posts = await Post.getAllPosts();
    //   res.send(posts);
    // } catch (error) {
    //   next(error);
    // }
  });
