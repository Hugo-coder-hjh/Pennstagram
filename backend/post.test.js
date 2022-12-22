// import supertest
const request = require('supertest');

// import json web token
const jwt = require('jsonwebtoken');

// import the function to close the mongodb connection
const { closeMongoDBConnection, connect } = require('./dbFunctions');

// import the express server
const webapp = require('./server');

// secret key
const secret = 'tHI$_iSz_a_Very_$trong&_SeCRet_queYZ_fOR_Team32';

// get the token
const jwtoken = jwt.sign({ username: 'testUser' }, secret, { expiresIn: '60000s' });
// console.log('jwtoken', jwtoken);
// connection to the DB
let mongo;

describe('POST /comment enpoint tests', () => {
  let db; // the db
  let response; // the response from our express server
  /**
     * We need to make the request to the endpoint
     * before running any test.
     * We need to connecto the DB for all the DB checks
     * If beforeAll is undefined
     * inside .eslintrc.js, add 'jest' to the 'env' key
     */
  beforeAll(async () => {
    // connect to the db
    mongo = await connect();
    // get the db
    db = mongo.db();
    // post a testUser
    await db.collection('users').insertOne({ name: 'testUser', username: 'testUser' });
    // send the request to the API and collect the response
    response = await request(webapp).post('/comment')
      .set({ Authorization: `${jwtoken}` })
      .send('name=testuser&userId=123&postId=456&content=how are you');
  });
  /**
 * removes all testing data from the DB
 */
  const clearDatabase = async () => {
    try {
      // delete a testUser
      await db.collection('users').deleteOne({ username: 'testUser' });
      const result = await db.collection('comments').deleteOne({ name: 'testuser' });
      console.log('result', result);
    } catch (err) {
      console.log('error', err.message);
    }
  };

  /**
 * After running the tests, we need to remove any test data from the DB
 * We need to close the mongodb connection
 */
  afterAll(async () => {
    // we need to clear the DB
    try {
      await clearDatabase();
      await mongo.close(); // the test  file connection
      await closeMongoDBConnection(); // the express connection
    } catch (err) {
      return err;
    }
    return null;
  });

  /**
 * Status code and response type
 */
  test('the status code is 201 and response type', () => {
    expect(response.status).toBe(201); // status code
    expect(response.type).toBe('application/json');
  });

  /**
 * response body
 */
  test('the new comment is returned', () => {
    const testComment = {
      name: 'testuser', userId: '123', postId: '456', content: 'how are you',
    };
    expect(JSON.parse(response.text).data).toMatchObject(testComment); // status code
  });

  test('The new comment is in the database', async () => {
    const insertedComment = await db.collection('comments').findOne({ name: 'testuser' });
    expect(insertedComment.name).toEqual('testuser');
  });

  test('missing a field (name) 404', async () => {
    const res = await request(webapp).post('/comment')
      .set({ Authorization: `${jwtoken}` })
      .send('userId=123&postId=456&content=how are you');
    expect(res.status).toEqual(404);
  });
});
