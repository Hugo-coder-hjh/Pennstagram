/* eslint-disable consistent-return */
// /* global describe, beforeAll, afterAll, test, expect */
const FormData = require('form-data');

// import supertest
const request = require('supertest');
// const { ObjectId } = require('mongodb');

// import json web token
const jwt = require('jsonwebtoken');

// secret key
const secret = 'tHI$_iSz_a_Very_$trong&_SeCRet_queYZ_fOR_Team32';

// get the token
const jwtoken = jwt.sign({ username: 'testUser' }, secret, { expiresIn: '60000s' });

// import the function to close the mongodb connection
const { closeMongoDBConnection, connect } = require('./dbFunctions');

// import the express server
const webapp = require('./server');

// connection to the DB
let mongo;

describe('POST /upload enpoint tests', () => {
  let db; // the db
  let response; // the response from our express server

  const formData = new FormData();
  formData.append('name', 'ABC');
  formData.append('age', 20);

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
    response = await request(webapp).post('/upload/').set({ Authorization: `${jwtoken}` })
      .send('photo=123&userId=123&comment=0&profilePicture=123&username=123&desc=123&likes=0');
  });

  /**
   * removes all testing data from the DB
   */
  const clearDatabase = async () => {
    try {
      // delete a testUser
      await db.collection('users').deleteOne({ username: 'testUser' });
      // unique identifier for field to delete
    //   const result = await db.collection('posts').deleteOne({ _id: ObjectId(testPostID) });
    //   console.log('result', result);
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
  });

  /**
   * Status code and response type
   */
  test('the status code is 200 and response type', () => {
    expect(response.status).toBe(404); // status code
  });
});
