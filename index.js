'use strict'
const Config = require('./config');
const Seneca = require('seneca')();

Seneca.use('mongo-store', Config.mongo);

Seneca.use(require('./lib/exercises'));
Seneca.listen(Config.service);