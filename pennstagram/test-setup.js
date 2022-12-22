const LocalStorage = require('./local-storage-mock');

global.localStorage = new LocalStorage();
