/* eslint-disable consistent-return */
const request = require('supertest');
// Import MongoDB module
const { ObjectId } = require('mongodb');

// import json web token
const jwt = require('jsonwebtoken');

// secret key
const secret = 'tHI$_iSz_a_Very_$trong&_SeCRet_queYZ_fOR_Team32';

// get the token
const jwtoken = jwt.sign({ username: 'testUser' }, secret, { expiresIn: '60000s' });

const { closeMongoDBConnection, connect } = require('./dbFunctions');
const webapp = require('./server');

let mongo;

// TEST PUT ENDPOINT
describe('Update a post endpoint integration test', () => {
  /**
 * If you get an error with afterEach
 * inside .eslintrc.json in the
 * "env" key add -'jest': true-
 */

  let res;
  let db;
  let testPostID; // will store the id of the test student

  /**
     * Make sure that the data is in the DB before running
     * any test
     * connect to the DB
     */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    // post a testUser
    await db.collection('users').insertOne({ name: 'testUser', username: 'testUser' });
    res = await request(webapp).post('/post/').set({ Authorization: `${jwtoken}` })
      .send('photo=123&userId=123&comment=0&profilePicture=123&username=123&desc=123&likes=0');
    // get the id of the test post
    // eslint-disable-next-line no-underscore-dangle
    testPostID = JSON.parse(res.text)._id;
  });

  const clearDatabase = async () => {
    try {
      // delete a testUser
      await db.collection('users').deleteOne({ username: 'testUser' });
      await db.collection('posts').deleteOne({ _id: ObjectId(testPostID) });
    } catch (err) {
      console.log('error', err.message);
    }
  };
  /**
 * Delete all test data from the DB
 * Close all open connections
 */
  afterAll(async () => {
    await clearDatabase();
    try {
      await mongo.close();
      await closeMongoDBConnection(); // mongo client that started server.
    } catch (err) {
      return err;
    }
  });

  test('Endpoint status code and response async/await', async () => {
    res = await request(webapp).put(`/post/${testPostID}`).set({ Authorization: `${jwtoken}` })
      .send('photo=234&desc=234');
    expect(res.status).toEqual(200);
    expect(res.type).toBe('application/json');

    // the database was updated
    const updatedPost = await db.collection('posts').findOne({ _id: ObjectId(testPostID) });
    expect(updatedPost.desc).toEqual('234');
    expect(updatedPost.photo).toEqual('234');
  });

  test('missing fields 404', async () => {
    res = await request(webapp).put(`/post/${testPostID}`).set({ Authorization: `${jwtoken}` })
      .send('userId=234');
    expect(res.status).toEqual(404);
  });
});
