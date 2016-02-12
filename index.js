var seneca = require('seneca')();

seneca.use('mongo-store', {
	name: 'progress',
	host: '127.0.0.1',
	port: 27017
});

seneca.use('lib/exercises');
seneca.listen();