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

// TEST DELETE ENDPOINT
describe('Delete a comment endpoint integration test', () => {
  /**
   * If you get an error with afterEach
   * inside .eslintrc.json in the
   * "env" key add -'jest': true-
   */
  let res;
  let db;
  let testCommentID;

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
    res = await request(webapp).post('/comment')
      .set({ Authorization: `${jwtoken}` })
      .send('name=testuser&userId=123&postId=456&content=how are you');
    // eslint-disable-next-line no-underscore-dangle
    testCommentID = JSON.parse(res.text).data._id;
  });

  const clearDatabase = async () => {
    try {
      // delete a testUser
      await db.collection('users').deleteOne({ username: 'testUser' });
      const result = await db.collection('comments').deleteOne({ name: 'testuser' });
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
    return null;
  });

  test('Endpoint response: status code, type and content', async () => {
    // successful deletion returns 200 status code
    const resp = await request(webapp)
      .delete(`/comment/${testCommentID}`)
      .set({ Authorization: `${jwtoken}` });
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    // the comment is not in the database
    const resp1 = await db.collection('comments').findOne({ _id: ObjectId(testCommentID) });
    expect(resp1).toBeNull();
  });

  test('wrong comment id format/exception - response 404', async () => {
    const resp = await request(webapp)
      .delete('/comment/1')
      .set({ Authorization: `${jwtoken}` });
    expect(resp.status).toEqual(404);
  });

  test('comment id not in system (correct id format) - response 404', async () => {
    const resp = await request(webapp)
      .delete('/comment/63738b602fe72e59d4a72ccc')
      .set({ Authorization: `${jwtoken}` });
    expect(resp.status).toEqual(404);
  });
});
