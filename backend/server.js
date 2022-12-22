/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
// Express app file
// console.log(111);
const multer = require('multer');
// const path = require('path');

// (1) import express
const express = require('express');

// (2) import and enable cors
// (cross-origin resource sharing)
const cors = require('cors');

// const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// import json web token
const jwt = require('jsonwebtoken');

// deployment
const path = require('path');

// s3
const s3 = require('./s3manips');

// secret key
const secret = 'tHI$_iSz_a_Very_$trong&_SeCRet_queYZ_fOR_Team32';

// import authentication operations
const auth = require('./authentication');

// (3) create an instanece of our express app
const webapp = express();

// (4) enable cors
webapp.use(cors());

// (6) configure express to parse bodies
webapp.use(express.urlencoded({ extended: true }));
webapp.use(express.json());

// deployment
webapp.use(express.static(path.join(__dirname, '../pennstagram/build')));

// (7) import the db interactions module
// const { default: axios } = require('axios');
const dbLib = require('./dbFunctions');

// root endpoint / route
// webapp.get('/', (req, resp) => {
//   resp.json({ message: 'welcome to our backend!' });
// });

// users
// implement the GET /users endpoint
webapp.get('/users', async (req, res) => {
  console.log('READ all users');
  if (await auth.authenticateUser(req.headers.authorization, secret)) {
    try {
      // get the data from the db
      const results = await dbLib.getAllUsers();
      // send the response with the appropriate status code
      res.status(200).json({ data: results });
    } catch (err) {
      res.status(404).json({ message: 'there was error' });
    }
  } else {
    res.status(401).json({ error: 'failed authentication' });
  }
});

// implement the GET /users/:id endpoint
webapp.get('/users/:id', async (req, res) => {
  console.log('READ a user');
  if (await auth.authenticateUser(req.headers.authorization, secret)) {
    try {
      // get the data from the db
      const results = await dbLib.getUserById(req.params.id);
      if (results === undefined) {
        res.status(404).json({ error: 'unknown user' });
        return;
      }
      // send the response with the appropriate status code
      res.status(200).json({ data: results });
    } catch (err) {
      res.status(404).json({ message: 'there was error' });
    }
  } else {
    res.status(401).json({ error: 'failed authentication' });
  }
});

// implement the PUT /users/id endpoint
webapp.put('/users/:id', async (req, res) => {
  console.log('UPDATE followers/followees of a user');
  if (await auth.authenticateUser(req.headers.authorization, secret)) {
    // parse the body of the request
    if (!req.body.followers) {
      res.status(404).json({ message: 'missing valid userObject' });
      return;
    }

    try {
      const result = await dbLib.updateUser(req.params.id, req.body);
      // send the response with the appropriate status code
      res.status(200).json({ message: result });
    } catch (err) {
      res.status(404).json({ message: 'there was error' });
    }
  } else {
    res.status(401).json({ error: 'failed authentication' });
  }
});

// followers/followees
// implement the GET /users/:id/followers endpoint
webapp.get('/users/:id/followers', async (req, res) => {
  console.log('READ the followers of a user');
  if (await auth.authenticateUser(req.headers.authorization, secret)) {
    try {
      // get the data from the db
      const results = await dbLib.getFollowersByUserId(req.params.id);
      if (results === undefined) {
        res.status(404).json({ error: 'unknown user (followers)' });
        return;
      }
      // send the response with the appropriate status code
      res.status(200).json({ data: results });
    } catch (err) {
      res.status(404).json({ message: 'there was error' });
    }
  } else {
    res.status(401).json({ error: 'failed authentication' });
  }
});

// implement the GET /users/:id/followees endpoint
webapp.get('/users/:id/followees', async (req, res) => {
  console.log('READ the followees of a user');
  if (await auth.authenticateUser(req.headers.authorization, secret)) {
    try {
      // get the data from the db
      const results = await dbLib.getFolloweesByUserId(req.params.id);
      if (results === undefined) {
        res.status(404).json({ error: 'unknown user (followees)' });
        return;
      }
      // send the response with the appropriate status code
      res.status(200).json({ data: results });
    } catch (err) {
      res.status(404).json({ message: 'there was error' });
    }
  } else {
    res.status(401).json({ error: 'failed authentication' });
  }
});

// implement the GET recommendation/:id endpoint
webapp.get('/recommendation/:id', async (req, res) => {
  console.log('READ the recommendation list of a user');
  if (await auth.authenticateUser(req.headers.authorization, secret)) {
    try {
      // call the function
      const results = await dbLib.getRecommendationById(req.params.id);
      if (results === undefined) {
        res.status(404).json({ error: 'unknown user' });
        return;
      }
      // send the response with the appropriate status code
      res.status(200).json({ data: results });
    } catch (err) {
      res.status(404).json({ message: 'there was error' });
    }
  } else {
    res.status(401).json({ error: 'failed authentication' });
  }
});

// posts
// implement the GET /posts endpoint

// READ all posts per page for scroll
webapp.get('/posts/:id', async (req, res) => {
  console.log('READ all posts per page');
  if (await auth.authenticateUser(req.headers.authorization, secret)) {
    const page = req.query.p || 0;
    try {
    // get the data from the db
      const results = await dbLib.getAllPostsById(req.params.id, page);
      // send the response with the appropriate status code
      if (results === undefined) {
        res.status(404).json({ error: 'unknown user' });
        return;
      }
      res.status(200).json(results);
    } catch (err) {
      res.status(404).json({ message: 'there was error' });
    }
  } else {
    res.status(401).json({ error: 'failed authentication' });
  }
});

// READ the number of all posts by Id
webapp.get('/num/:id', async (req, res) => {
  console.log('READ the number of all posts');
  if (await auth.authenticateUser(req.headers.authorization, secret)) {
    try {
      // get the data from the db
      const results = await dbLib.getPostsNumById(req.params.id);
      // send the response with the appropriate status code
      if (results === undefined) {
        res.status(404).json({ error: 'unknown user' });
        return;
      }
      res.status(200).json(results);
    } catch (err) {
      res.status(404).json({ message: 'there was error' });
    }
  } else {
    res.status(401).json({ error: 'failed authentication' });
  }
});

// implement the GET /post/:id endpoint
webapp.get('/post/:id', async (req, res) => {
  console.log('READ a post');
  if (await auth.authenticateUser(req.headers.authorization, secret)) {
    try {
      // get the data from the db
      const results = await dbLib.getPostById(req.params.id);
      if (results === undefined) {
        res.status(404).json({ error: 'unknown user' });
        return;
      }
      // send the response with the appropriate status code
      res.status(200).json(results);
    } catch (err) {
      res.status(404).json({ message: 'there was error' });
    }
  } else {
    res.status(401).json({ error: 'failed authentication' });
  }
});

// implement the POST /post/ endpoint
webapp.post('/post/', async (req, res) => {
  console.log('CREATE a post');
  if (await auth.authenticateUser(req.headers.authorization, secret)) {
    // parse the body of the request
    if (!req.body.photo || !req.body.userId || !req.body.comment || !req.body.profilePicture
      || !req.body.username || !req.body.desc || !req.body.likes) {
      res.status(404).json({ message: 'missing some fields' });
      return;
    }
    try {
      // create the new post
      const newPost = {
        photo: req.body.photo,
        userId: req.body.userId,
        comment: req.body.comment,
        profilePicture: req.body.profilePicture,
        username: req.body.username,
        desc: req.body.desc,
        likes: req.body.likes,
        visi: req.body.visi,
      };
      const result = await dbLib.createPost(newPost);
      // send the response with the appropriate status code
      // res.status(201).json({ data: { id: result, ...newPost } });
      res.status(201).json({ id: result, ...newPost });
    } catch (err) {
      res.status(409).json({ message: 'there was error' });
    }
  } else {
    res.status(401).json({ error: 'failed authentication' });
  }
});

// implement the DELETE /posts/id endpoint
webapp.delete('/post/:id', async (req, res) => {
  console.log('DELETE a post');
  if (await auth.authenticateUser(req.headers.authorization, secret)) {
    try {
      const result = await dbLib.deletePostbyId(req.params.id);
      if (result.deletedCount === 0) {
        res.status(404).json({ error: 'post not in the system' });
        return;
      }
      // send the response with the appropriate status code
      res.status(200).json({ message: result });
    } catch (err) {
      res.status(404).json({ message: 'there was error' });
    }
  } else {
    res.status(401).json({ error: 'failed authentication' });
  }
});

// implement the PUT /post/id endpoint
webapp.put('/post/:id', async (req, res) => {
  console.log('UPDATE post');
  if (await auth.authenticateUser(req.headers.authorization, secret)) {
    // parse the body of the request
    if (!req.body.photo && !req.body.desc) {
      res.status(404).json({ message: 'missing fields' });
      return;
    }
    try {
      const result = await dbLib.updatePost(
        req.params.id,
        req.body.photo,
        req.body.desc,
        req.body.likes,
        req.body.visi,
      );
      // send the response with the appropriate status code
      res.status(200).json({ message: result });
    } catch (err) {
      res.status(404).json({ message: 'there was error' });
    }
  } else {
    res.status(401).json({ error: 'failed authentication' });
  }
});

// implement the GET /invisi/:id endpoint
webapp.get('/invisi/:id', async (req, res) => {
  console.log('READ an invisiArray');
  if (await auth.authenticateUser(req.headers.authorization, secret)) {
    try {
      // get the data from the db
      const results = await dbLib.getInvisiByUserId(req.params.id);
      if (results === undefined) {
        res.status(404).json({ error: 'unknown user' });
        return;
      }
      // send the response with the appropriate status code
      res.status(200).json({ data: results });
    } catch (err) {
      res.status(404).json({ message: 'there was error' });
    }
  } else {
    res.status(401).json({ error: 'failed authentication' });
  }
});

// implement the PUT /invisi/:id endpoint
webapp.put('/invisi/:id', async (req, res) => {
  console.log('UPDATE the invisiArr of a user');
  if (await auth.authenticateUser(req.headers.authorization, secret)) {
    // parse the body of the request
    if (!req.body) {
      res.status(404).json({ message: 'missing valid invisiArr' });
      return;
    }

    try {
      const result = await dbLib.updateInvisi(req.params.id, req.body);
      // send the response with the appropriate status code
      res.status(200).json({ message: result });
    } catch (err) {
      res.status(404).json({ message: 'there was error' });
    }
  } else {
    res.status(401).json({ error: 'failed authentication' });
  }
});

// Using for S3

// the memory storage stores the files in memory as Buffer objects
const upload = multer({ storage: multer.memoryStorage() });

// implement the POST /upload/ endpoint
// When upload or edit the image, image form will be sent to this endpoint
// Then upload the image form to s3 using uploadFile() function and return the URL of the image
webapp.post('/upload', upload.single('file'), async (req, res) => {
  if (await auth.authenticateUser(req.headers.authorization, secret)) {
    try {
      // console.log('File request successfully in server is data ?', req.file);

      // upload file to S3
      const data = await s3.uploadFile(req.file);

      // console.log('File uploded successfully in server is data ?', data);
      // console.log('File uploded successfully in server is location ?', data.Location);

      // return the data location (URL of the image)
      res.status(200).json({ data: data.Location });
      // return res.status(200).json('File uploded successfully in server');
    } catch (error) {
      // console.error(error);
      res.status(404).json({ message: 'there was error' });
    }
  } else {
    res.status(401).json({ error: 'failed authentication' });
  }
});

// comments
// implement the GET /comments/:id endpoint
webapp.get('/comments/:id', async (req, res) => {
  console.log('GET comment array by postId');
  if (await auth.authenticateUser(req.headers.authorization, secret)) {
    try {
      // get the data from db
      const results = await dbLib.getCommentsByPostId(req.params.id);
      if (results === undefined) {
        res.status(404).json({ message: 'unknown post' });
      }
      // return response
      res.status(200).json({ data: results });
    } catch (err) {
      res.status(404).json({ message: 'there was error' });
    }
  } else {
    res.status(401).json({ error: 'failed authentication' });
  }
});

// implement the PUT /comments/:id endpoint
webapp.put('/comments/:id', async (req, res) => {
  console.log('UPDATE comment array by postId');
  if (await auth.authenticateUser(req.headers.authorization, secret)) {
    if (!req.body.comment) {
      res.status(404).json({ message: 'missing new comment array' });
      return;
    }
    try {
      // get the data from db
      const result = await dbLib.updateCommentsByPostId(req.body.comment, req.params.id);
      res.status(200).json({ message: result });
    } catch (err) {
      res.status(404).json({ message: 'there was error' });
    }
  } else {
    res.status(401).json({ error: 'failed authentication' });
  }
});

// comment
// implement the GET /comment/:id endpoint
webapp.get('/comment/:id', async (req, res) => {
  console.log('GET a comment by commentId');
  if (await auth.authenticateUser(req.headers.authorization, secret)) {
    try {
      // get the data from db
      const results = await dbLib.getCommentByCommentId(req.params.id);
      if (results === undefined) {
        res.status(404).json({ message: 'unknown comment' });
      }
      // return response
      res.status(200).json({ data: results });
    } catch (err) {
      res.status(404).json({ message: 'there was error' });
    }
  } else {
    res.status(401).json({ error: 'failed authentication' });
  }
});

// implement the POST /comment endpoint
webapp.post('/comment', async (req, res) => {
  console.log('POST a comment');
  if (await auth.authenticateUser(req.headers.authorization, secret)) {
    if (!req.body.userId || !req.body.content || !req.body.postId || !req.body.name) {
      res.status(404).json({ message: 'missing userId, name, postId, or content' });
      return;
    }
    try {
      // create a comment
      const newComment = {
        name: req.body.name,
        userId: req.body.userId,
        postId: req.body.postId,
        content: req.body.content,
      };
      const result = await dbLib.addAComment(newComment);
      res.status(201).json({ data: { id: result, ...newComment } });
    } catch (err) {
      res.status(404).json({ message: 'there was error' });
    }
  } else {
    res.status(401).json({ error: 'failed authentication' });
  }
});

// implement the PUT /comment/:id endpoint
webapp.put('/comment/:id', async (req, res) => {
  console.log('UPDATE a comment');
  if (await auth.authenticateUser(req.headers.authorization, secret)) {
    if (!req.body.commentId || !req.body.content) {
      res.status(404).json({ message: 'missing content or commentId' });
      return;
    }
    try {
      const result = await dbLib.updateComment(req.body.content, req.body.commentId);
      res.status(200).json({ data: result });
    } catch (err) {
      res.status(404).json({ message: 'there was error' });
    }
  } else {
    res.status(401).json({ error: 'failed authentication' });
  }
});

// implement the DELETE /comment/:id endpoint
webapp.delete('/comment/:id', async (req, res) => {
  console.log('DELETE a comment');
  if (await auth.authenticateUser(req.headers.authorization, secret)) {
    try {
      const result = await dbLib.deleteAComment(req.params.id);
      console.log(result.deletedCount);
      if (result.deletedCount === 0) {
        res.status(404).json({ message: 'comment not in the system' });
        return;
      }
      res.status(200).json({ data: result });
    } catch (err) {
      res.status(404).json({ message: 'there was error' });
    }
  } else {
    res.status(401).json({ error: 'failed authentication' });
  }
});

// authentication
webapp.post('/api/registration', async (req, res) => {
  console.log('CREAT a user');
  console.log(req.body.username);
  if (!req.body.name || !req.body.username || !req.body.password || !req.body.confirmpassword) {
    res.status(404).json({ message: 'missing name, username, password or confirmPassword' });
    return;
  }
  if (req.body.password !== req.body.confirmpassword) {
    res.status(404).json({ message: 'two input password must be consistent' });
    return;
  }
  const findUser = await dbLib.getUserByUsername(req.body.username);
  // user exist
  if (findUser) {
    res.status(404).json({ message: 'user already exists' });
    return;
  }
  try {
    // hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // create the new user
    const today = new Date();
    const date = today.toDateString();
    // const month = Date.prototype.getMonth();
    // const year = Date.prototype.getFullYear();
    const newUser = {
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword,
      display: req.body.username,
      regiDate: date,
      loginAttempts: 0,
      lockUntil: 0,
      profilePic: `https://robohash.org/${req.body.name}?set=set2&size=180x180`,
      followees: [],
      followers: [],
      posts: [],
    };
    // post the new user into the database
    const result = await dbLib.addUser(newUser);
    // send the response with the appropriate status code
    res.status(201).json({ data: { id: result, ...newUser } });
  } catch (err) {
    res.status(409).json({ message: 'there was error' });
  }
});
// update for deployment
webapp.get('*', async (_req, res) => {
  // always success at the first sight
  // res.status(200).json({ message: 'welcome to login page' });
  res.sendFile(path.join(__dirname, '../pennstagram/build/index.html'));
});

webapp.post('/api/login', async (req, res) => {
  console.log('login with given username and password');
  // check if the username or password is null
  if (!req.body.username || !req.body.password) {
    res.status(404).json({ message: 'missing username or password' });
    return;
  }
  const { username } = req.body;
  const { password } = req.body;
  // get the user with login username
  const findUser = await dbLib.getUserByUsername(username);
  // user does not exist
  if (!findUser) {
    res.status(404).json({ message: 'user not found' });
  } else {
    // user exist
    console.log('found the user');
    if (findUser.lockUntil < Date.now()) {
      // not in the lock time
      // try to login
      bcrypt.compare(password, findUser.password, async (err, data) => {
        if (err) throw err;
        if (data) {
          console.log('login success');
          // login successul
          // renew the attempts and lock time
          findUser.loginAttempts = 0;
          findUser.lockUntil = 0;
          await dbLib.updateUserAfterLogin(findUser._id, findUser);
          let jwtoken;
          try {
            jwtoken = jwt.sign({ username: findUser.username }, secret, { expiresIn: '1800s' });
          } catch (error) {
            res.status(401).json({ message: 'Setting token failed' });
            return;
          }
          res.status(200).json({ data: { ...findUser }, token: jwtoken });
        } else {
          findUser.loginAttempts += 1;
          console.log('login attempts', findUser.loginAttempts);
          await dbLib.updateUserAfterLogin(findUser._id, findUser);
          if (findUser.loginAttempts > 3) {
            findUser.lockUntil = Date.now() + (1000 * 60 * 5);
            await dbLib.updateUserAfterLogin(findUser._id, findUser);
            res.status(403).json({ message: 'Account locked for 5 minutes. Max login attempts exceeded.' });
            return;
          }
          res.status(401).json({ message: 'Invalid credencial' });
        }
      });
    } else {
      res.status(403).json({ message: 'User account locked' });
    }
  }
});

// catch all endpoint
webapp.use((req, resp) => {
  resp.status(404).json({ error: 'invalid endpoint' });
});

// do not forget to export the express server
module.exports = webapp;
