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
describe('Delete a post endpoint integration test', () => {
  /**
 * If you get an error with afterEach
 * inside .eslintrc.json in the
 * "env" key add -'jest': true-
 */
  let res;
  let db;
  let testPostID;

  /**
     *  Make sure that the data is in the DB before running
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
    // eslint-disable-next-line no-underscore-dangle
    testPostID = JSON.parse(res.text)._id;
  });

  const clearDatabase = async () => {
    try {
      // delete a testUser
      await db.collection('users').deleteOne({ username: 'testUser' });
      const result = await db.collection('posts').deleteOne({ _id: ObjectId(testPostID) });
      console.log('info', result);
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
      await closeMongoDBConnection(); // mongo client started when running express.
    } catch (err) {
      return err;
    }
  });

  test('Endpoint response: status code, type and content', async () => {
    // successful deletion returns 200 status code
    const resp = await request(webapp).delete(`/post/${testPostID}`).set({ Authorization: `${jwtoken}` });
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    // the post is not in the database
    const resp1 = await db.collection('posts').findOne({ _id: ObjectId(testPostID) });
    expect(resp1).toBeNull();
  });

  test('wrong post id format/exception - response 404', async () => {
    const resp = await request(webapp).delete('/post/1').set({ Authorization: `${jwtoken}` });
    expect(resp.status).toEqual(404);
  });

  test('post id not in system (correct id format) - response 404', async () => {
    const resp = await request(webapp).delete('/post/63738b602fe72e59d4a72ccc').set({ Authorization: `${jwtoken}` });
    expect(resp.status).toEqual(404);
  });
});
