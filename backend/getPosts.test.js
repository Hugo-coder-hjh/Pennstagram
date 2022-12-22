/* eslint-disable consistent-return */
const request = require('supertest');
const { ObjectId } = require('mongodb');
// import json web token
const jwt = require('jsonwebtoken');
const { closeMongoDBConnection, connect } = require('./dbFunctions');
const webapp = require('./server');

let mongo;

// secret key
const secret = 'tHI$_iSz_a_Very_$trong&_SeCRet_queYZ_fOR_Team32';

// get the token
const jwtoken = jwt.sign({ username: 'testUser' }, secret, { expiresIn: '60000s' });

// TEST POST ENDPOINT
describe('GET post(s) endpoint integration test', () => {
  /**
 * If you get an error with afterEach
 * inside .eslintrc.json in the
 * "env" key add -'jest': true-
*/
  let db;
  let testPostID;
  let res;
  // test resource to create / expected response
  const testPost = {
    photo: '123', userId: '123', comment: '0', profilePicture: '123', username: '123', desc: '123', likes: '0',
  };
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
    res = await request(webapp).post('/post/')
      .set({ Authorization: `${jwtoken}` })
      .send('photo=123&userId=123&comment=0&profilePicture=123&username=123&desc=123&likes=0');
    // eslint-disable-next-line no-underscore-dangle
    testPostID = JSON.parse(res.text)._id;
  });

  const clearDatabase = async () => {
    try {
      // delete a testUser
      await db.collection('users').deleteOne({ username: 'testUser' });
      const result = await db.collection('posts').deleteOne({ _id: ObjectId(testPostID) });
      const { deletedCount } = result;
      if (deletedCount === 1) {
        console.log('info', 'Successfully deleted test post');
      } else {
        console.log('warning', 'test post was not deleted');
      }
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

  test('Get a post endpoint status code and data', async () => {
    const resp = await request(webapp).get(`/post/${testPostID}`).set({ Authorization: `${jwtoken}` });
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const postArr = JSON.parse(resp.text);
    // testPost.photo = `http://localhost:8080/images/${testPost.photo}`;
    // testPost is in the response
    expect(postArr).toMatchObject({ _id: testPostID, ...testPost });
  });

  test('post not in db status code 404', async () => {
    const resp = await request(webapp).get('/post/1').set({ Authorization: `${jwtoken}` });
    expect(resp.status).toEqual(404);
    expect(resp.type).toBe('application/json');
  });
});
