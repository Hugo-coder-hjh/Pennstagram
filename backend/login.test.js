// import supertest
const request = require('supertest');
const bcrypt = require('bcrypt');
// import the function to close the mongodb connection
const { closeMongoDBConnection, connect } = require('./dbFunctions');

// import the express server
const webapp = require('./server');

// connection to the DB
let mongo;

describe('POST /login enpoint tests', () => {
  let db; // the db
  // let response; // the response from our express server
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
    const hashedPassword = await bcrypt.hash('testPassword', 10);
    await db.collection('users').insertOne({
      name: 'testUser', username: 'testUser', password: hashedPassword, lockUntil: 0, loginAttempts: 0,
    });
    // send the request to the API and collect the response
    // response = await request(webapp).post('/login')
    //   .send('username=testUser&password=testPassword');
  });
  /**
 * removes all testing data from the DB
 */
  const clearDatabase = async () => {
    try {
      const result = await db.collection('users').deleteOne({ username: 'testUser' });
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
 * response body
 */

  test('missing a field (confirmpassword) 404', async () => {
    const res = await request(webapp).post('/api/login')
      .send('username=123');
    expect(res.status).toEqual(404);
  });
});
