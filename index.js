var seneca = require('seneca')();

seneca.use('mongo-store', {
	name: 'progress',
	host: '127.0.0.1',
	port: 27017,
	strict:{result:false}
});

seneca.use('exercises');
seneca.listen();