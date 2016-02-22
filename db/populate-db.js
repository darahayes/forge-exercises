var async = require('async');
var seneca = require('seneca')();
var db = require('./db.json');

seneca.use('mongo-store', {
	name: 'progress',
	host: '127.0.0.1',
	port: 27017
});
//use the actual exercises microservice to populate the database
seneca.use('../lib/exercises');

//tasks to be run in order to populate the db
var tasks = [
	function remove_existing(cb) {
		seneca.act({role: 'exercises', cmd: 'remove_exercises', user: null}, function(err) {
			cb(err, 'Removed all non-user owned exercises from exercises database');
		})
	},
	function add_resistance(cb) {
		async.eachSeries(db.resistance, add_exercise, function(err) {
			cb(err, 'Populated Exercises database with resistance exercises');
		})
	},
	function add_cardio(cb) {
		async.eachSeries(db.cardio, add_exercise, function(err) {
			cb(err, 'Populated Exercises database with cardio exercises');
		})
	}
];

function add_exercise(ex, next) {
	seneca.act(generate_msg(ex), next);
}

function generate_msg(ex) {
	if (ex.category === 'Resistance') {
		return {
			role: 'exercises',
			cmd: 'save',
			name: ex.name,
			category: ex.category,
			tags: ex.tags,
			created_by: null,
			main_target: ex.main_target,
			equipment: ex.equipment
		};
	}
	else if (ex.category === 'Cardio') {
		return {
			role: 'exercises',
			cmd: 'save',
			name: ex.name,
			category: ex.category,
			created_by: null,
		};
	}
}

//once seneca is loaded run the tasks
seneca.ready(function() {

	async.series(tasks, done);

	function done(err, results) {
		if (err) { throw err; }
		console.log(results.join('\n'));
		process.exit(0);
	}
});