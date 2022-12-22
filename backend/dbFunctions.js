/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
// this is a node app, we must use commonJS modules/ require

// import the mongodb driver
const { MongoClient } = require('mongodb');

// import ObjectID
const { ObjectId } = require('mongodb');

// the mongodb server URL
const userName = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
// put the project name before the question mark
const dbURL = `mongodb+srv://${userName}:${password}@cluster0.8mojuiy.mongodb.net/Pennstagram?retryWrites=true&w=majority`;

// three posts per page -scroll
const postPerPage = 3;

/**
 * MongoDB database connection
 * It will be exported so we can close the connection
 * after running our tests
 */
let MongoConnection;
// connection to the db
const connect = async () => {
  // always use try/catch to handle any exception
  try {
    MongoConnection = (await MongoClient.connect(
      dbURL,
      { useNewUrlParser: true, useUnifiedTopology: true },
    )); // we return the entire connection, not just the DB
    // check that we are connected to the db
    console.log(`connected to db: ${MongoConnection.db().databaseName}`);
    return MongoConnection;
  } catch (err) {
    console.log(err.message);
  }
};
/**
  *
  * @returns the database attached to this MongoDB connection
  */
const getDB = async () => {
  // test if there is an active connection
  if (!MongoConnection) {
    await connect();
  }
  return MongoConnection.db();
};

/**
  *
  * Close the mongodb connection
  */
const closeMongoDBConnection = async () => {
  await MongoConnection.close();
};

// users
// READ user information by given id
const getUserById = async (userId) => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('users').findOne({ _id: ObjectId(userId) });
    // print the result
    console.log(`User: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// READ all the users information
const getAllUsers = async () => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('users').find({}).toArray();
    // print the results
    console.log(`Users: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// UPDATE a user given their ID
// takes a userId and a updated UserObject
const updateUser = async (userId, userObject) => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('users').updateOne(
      { _id: ObjectId(userId) }, // query or filter
      {
        $set: {
          followers: userObject.followers,
          followees: userObject.followees,
          posts: userObject.posts,
        },
      },
    );
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// followees&followers
// READ a user's followers by given userId
const getFollowersByUserId = async (userId) => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('users').findOne({ _id: ObjectId(userId) });
    // print the result
    console.log(`Followers: ${JSON.stringify(result.followers)}`);
    return result.followers;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// READ a user's followees (followings) by given userId
const getFolloweesByUserId = async (userId) => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('users').findOne({ _id: ObjectId(userId) });
    // print the result
    console.log(`Followees: ${JSON.stringify(result.followees)}`);
    return result.followees;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// GET RecommendationById
const getRecommendationById = async (userId) => {
  try {
    const recommendation = [];
    let intersec = [];
    const currentUser = await getUserById(userId);
    const allUsers = await getAllUsers();
    allUsers.forEach((user) => {
      if (JSON.stringify(currentUser) !== JSON.stringify(user)) {
        // find the intersection of two users followers lists
        intersec = currentUser.followers.filter((value) => user.followers.includes(value));
        // the followers in the intersec should not be followed by the currentUser
        if (intersec.length >= 3 && !currentUser.followers.includes(user._id.toString())) {
          recommendation.push(user._id.toString());
        }
      }
    });
    return recommendation;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// posts
// READ post information by given id
const getPostById = async (postId) => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('posts').findOne({ _id: ObjectId(postId) });
    // print the result
    console.log(`Post: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// READ all the posts of a user's followers information
const getAllPostsById = async (id, page) => {
  try {
    // create a result array to store all the legal posts
    const posts = [];
    // get the db
    const db = await getDB();
    // get the array of followers ids
    const followers = await getFollowersByUserId(id);
    console.log('followers length', followers.length);
    console.log(followers);
    // if followers ids exists
    if (followers.length > 0) {
      await Promise.all(followers.map(async (follower) => {
        // get the first page result
        const postArr = await await db.collection('posts').find({ userId: follower }).skip(page * postPerPage).limit(postPerPage)
          .toArray();
        // return 3 posts every time
        posts.push(...postArr);
      }));
    }
    return posts;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// READ all the posts of a user's followers information
const getPostsNumById = async (id) => {
  try {
    // create a result array to store all the legal posts
    const posts = [];
    let postsNum = 0;
    // get the db
    const db = await getDB();
    // get the array of followers ids
    const followers = await getFollowersByUserId(id);
    console.log('followers length', followers.length);
    console.log(followers);
    // if followers ids exists
    if (followers.length > 0) {
      await Promise.all(followers.map(async (follower) => {
        // get the first page result
        const postArr = await await db.collection('posts').find({ userId: follower }).toArray();
        // return 3 posts every time
        posts.push(...postArr);
      }));
    }
    if (posts.length > 0) {
      postsNum = posts.length;
    }
    // return the number of all the posts
    console.log('the number of all posts', postsNum);
    return postsNum;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// CREATE a new post
// takes a db connector and a post object
// and add the post to the DB
const createPost = async (newPost) => {
  // get the db
  const db = await getDB();
  db.collection('posts').insertOne(
    newPost,
    (err, result) => {
      // if there was an error
      if (err) {
        console.log(`error: ${err.message}`);
      }
      // print the id of the post
      console.log(`New post created with id: ${result.insertedId}`);
      // return the result
      return result.insertedId;
    },
  );
};

// DELETE a post given their ID
const deletePostbyId = async (postId) => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('posts').deleteOne(
      { _id: ObjectId(postId) },
    );
    // print the result
    console.log(`Student: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// UPDATE a post given their ID
// takes a postId and a updated postObject
const updatePost = async (postId, newPhoto, newDesc, likeUpdate, visiUpdate) => {
  try {
    // get the db
    const db = await getDB();
    console.log('db!!!!!!!!!', likeUpdate);
    const result = await db.collection('posts').updateOne(
      { _id: ObjectId(postId) }, // query or filter
      {
        $set: {
          photo: newPhoto, desc: newDesc, likes: likeUpdate, visi: visiUpdate,
        },
      },
    );
    console.log('dbResults', result);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// Hide the post by one's followers
// takes a userId and a updated invisibility array
const updateInvisi = async (id, invisiArr) => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('invisi').updateOne(
      { userId: id }, // query or filter
      {
        $set: {
          userId: id,
          invisi: invisiArr,
        },
      },
      // when no document matches, this operation will insert the replacement document
      { upsert: true },
    );
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// get the invisibility array by userId query
const getInvisiByUserId = async (userId) => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('invisi').findOne({ userId });
    // print the result
    console.log(`invisiArr: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// comments
// READ a post's comment array
const getCommentsByPostId = async (postId) => {
  const db = await getDB();
  try {
    const result = await db.collection('posts').findOne({ _id: ObjectId(postId) });
    return result.comment;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// UPDATE a post's comment array
const updateCommentsByPostId = async (newComment, postId) => {
  const db = await getDB();
  try {
    const result = await db.collection('posts').updateOne(
      // query the post with given id
      { _id: ObjectId(postId) },
      // set the comment array to the new array
      {
        $set: { comment: newComment },
      },
    );
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// comment
// READ a comment
const getCommentByCommentId = async (commentId) => {
  const db = await getDB();
  try {
    const result = await db.collection('comments').findOne({ _id: ObjectId(commentId) });
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// CREATE a comment
const addAComment = async (newComment) => {
  const db = await getDB();
  // insert the new comment into database
  db.collection('comments').insertOne(
    newComment,
    (err, result) => {
      // if there was an error
      if (err) {
        console.log(`error: ${err.message}`);
      }
      // print the id of the new comment
      console.log(`New comment created with id: ${result.insertedId}`);
      // return the result
      return result.insertedId;
    },
  );
};

// UPDATE a comment
const updateComment = async (newContent, commentId) => {
  const db = await getDB();
  // update the comment with commentId
  try {
    const result = await db.collection('comments').updateOne(
      // query the comment with given id
      { _id: ObjectId(commentId) },
      // set the content to the new content
      {
        $set: { content: newContent },
      },
    );
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// DELETE a comment
const deleteAComment = async (commentId) => {
  const db = await getDB();
  try {
    const result = await db.collection('comments').deleteOne(
      { _id: ObjectId(commentId) },
    );
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// authentication
const addUser = async (newUser) => {
  const db = await getDB();
  const usernameCheck = newUser.username;
  const findUser = await db.collection('users').findOne({ username: usernameCheck });
  console.log(findUser);
  if (findUser != null) {
    console.log('user already exists in database');
    return;
  }
  db.collection('users').insertOne(
    newUser,
    (err, result) => {
      // if there was an error
      if (err) {
        console.log(`error: ${err.message}`);
      }
      // print the id of the new user
      console.log(`New user created with id: ${result.insertedId}`);
      // return the result
      return result.insertedId;
    },
  );
};

const getUserByUsername = async (username) => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('users').findOne({ username });
    // print the result
    // console.log(`User: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// UPDATE a user given their Id
// takes a userId and a updated UserObject
const updateUserAfterLogin = async (userId, userObject) => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('users').updateOne(
      { _id: ObjectId(userId) }, // query or filter
      {
        $set: {
          loginAttempts: userObject.loginAttempts,
          lockUntil: userObject.lockUntil,
        },
      },
    );
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// export the functions
module.exports = {
  closeMongoDBConnection,
  getDB,
  connect,
  getUserById,
  getAllUsers,
  updateUser,
  getFollowersByUserId,
  getFolloweesByUserId,
  getRecommendationById,
  getPostById,
  getAllPostsById,
  getPostsNumById,
  createPost,
  deletePostbyId,
  updatePost,
  addUser,
  getUserByUsername,
  getCommentsByPostId,
  getCommentByCommentId,
  addAComment,
  updateComment,
  deleteAComment,
  updateCommentsByPostId,
  updateInvisi,
  getInvisiByUserId,
  updateUserAfterLogin,
};
