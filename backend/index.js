/* eslint-disable no-console */
/**
 * This module will start the express server
 */
// (8) Import dotenv
require('dotenv').config();

const webapp = require('./server');

// (5) define the port
const port = process.env.PORT || 8080;

// start the server and connect to the DB
webapp.listen(port, async () => {
  console.log(`Server running on port: ${port}`);
});
