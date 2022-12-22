/* eslint-disable no-undef */
/* eslint-disable camelcase */
const AWS = require('aws-sdk');
// const fs = require('fs');
require('dotenv').config();

// The access ID and secret key of the S3 bucket
const ID = process.env.contact_your_ta_to_get_the_key;
const SECRET = process.env.contact_your_ta_to_get_the_secret_key;

// The name of the bucket that you have created
const BUCKET_NAME = 'aw3-upload-cis557';

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
});

// upload a file
const uploadFile = (fileContent) => {
  // Setting up S3 upload parameters
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileContent.originalname, // File name we want to upload
    Body: fileContent.buffer,
  };
  return s3.upload(params).promise();
};

// export the functions
module.exports = {
  uploadFile,
};
