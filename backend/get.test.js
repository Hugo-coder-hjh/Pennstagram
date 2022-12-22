/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
const request = require('supertest');
// import ObjectID
//  const { ObjectId } = require('mongodb');

// import json web token
const jwt = require('jsonwebtoken');

// secret key
const secret = 'tHI$_iSz_a_Very_$trong&_SeCRet_queYZ_fOR_Team32';

// get the token
const jwtoken = jwt.sign({ username: 'testUser' }, secret, { expiresIn: '60000s' });

const { closeMongoDBConnection, connect } = require('./dbFunctions');
const webapp = require('./server');
require('dotenv').config();

let mongo;

// TEST GET ENDPOINT
describe('GET users endpoint integration test', () => {
  /**
   * If you get an error with afterEach
   * inside .eslintrc.json in the
   * "env" key add -'jest': true-
  */
  let db;
  let testUserId;
  let userBId;
  const testUser1 = {
    name: 'testuser1', username: 'test1', followees: [3, 4], followers: [1, 2, 3],
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

    // add first testUser
    await db.collection('users').insertOne({
      name: 'testuser1', username: 'test1', followees: [3, 4], followers: [1, 2, 3],
    });
    // get the first testUser back and get the id
    const user1 = await db.collection('users').findOne({ username: 'test1' });
    testUserId = user1._id.toString();
    console.log('testUserId', testUserId);

    // add second testUser
    await db.collection('users').insertOne({
      name: 'testuser2', username: 'test2', followees: [1], followers: [testUserId],
    });

    // add third testUser
    await db.collection('users').insertOne({
      name: 'testuser3', username: 'test3', followees: [3, 4], followers: [1, 2, 3],
    });

    // get the second testUser back and get the id
    const user2 = await db.collection('users').findOne({ username: 'test2' });
    userBId = user2._id.toString();
    console.log('userBId', userBId);
  });

  const clearDatabase = async () => {
    try {
      // delete testusers
      await db.collection('users').deleteOne({ username: 'testUser' });
      await db.collection('users').deleteOne({ name: 'testuser1' });
      await db.collection('users').deleteOne({ name: 'testuser2' });
      await db.collection('users').deleteOne({ name: 'testuser3' });
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

  test('Get all users endpoint status code and data', async () => {
    const resp = await request(webapp).get('/users/').set({ Authorization: `${jwtoken}` });
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const userArr = JSON.parse(resp.text).data;
    // testUser is in the response
    expect(userArr).toEqual(expect.arrayContaining([{ _id: testUserId, ...testUser1 }]));
  });

  test('Get a user endpoint status code and data', async () => {
    const resp = await request(webapp).get(`/users/${testUserId}`).set({ Authorization: `${jwtoken}` });
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const userArr = JSON.parse(resp.text).data;
    // testUser is in the response
    console.log('userArr', userArr);
    expect(userArr).toMatchObject({ _id: testUserId, ...testUser1 });
  });

  test('user not in db status code 404', async () => {
    const resp = await request(webapp).get('/users/1').set({ Authorization: `${jwtoken}` });
    expect(resp.status).toEqual(404);
    expect(resp.type).toBe('application/json');
  });

  test('Get followers by userId', async () => {
    const resp = await request(webapp).get(`/users/${testUserId}/followers`).set({ Authorization: `${jwtoken}` });
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const userFollowers = JSON.parse(resp.text).data;
    // testUser's followers is in the response
    expect(userFollowers).toMatchObject([1, 2, 3]);
  });

  test('Get followees by userId', async () => {
    const resp = await request(webapp).get(`/users/${testUserId}/followees`).set({ Authorization: `${jwtoken}` });
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const userFollowees = JSON.parse(resp.text).data;
    // testUser's followees is in the response
    expect(userFollowees).toMatchObject([3, 4]);
  });

  test('Get recommendation by userId', async () => {
    const resp = await request(webapp).get(`/recommendation/${testUserId}`)
      .set({ Authorization: `${jwtoken}` });
    expect(resp.status).toEqual(404);
    expect(resp.type).toBe('application/json');
    // console.log('response', JSON.parse(resp.text));
    // const recommendation = JSON.parse(resp.text).data;
    // // testUser's recommendation is in the response
    // expect(recommendation).toMatchObject(new ObjectId('63802e2540bc39e436163b27'));
  });

  test('Get follower posts number by userId', async () => {
    console.log('##id', userBId);
    const resp = await request(webapp).get(`/num/${userBId}`).set({ Authorization: `${jwtoken}` });
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    // console.log('response', JSON.parse(resp.text));
    const postsNum = JSON.parse(resp.text);
    // console.log('##num', postsNum);
    // testUser's followees is in the response
    expect(postsNum).toBe(0);
  });
});
