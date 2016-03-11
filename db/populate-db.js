'use strict';

const Async = require('async');
const Seneca = require('seneca')();
const DB = require('./db.json');
const Config = require('../config')


Seneca.use('mongo-store', Config.mongo);
//use the actual exercises microservice to populate the database
Seneca.use('../lib/exercises');

//tasks to be run in order to populate the DB
const tasks = [
	function remove_existing(cb) {
		Seneca.act({role: 'exercises', cmd: 'remove_exercises', user: null}, function(err) {
			cb(err, 'Removed all non-user owned exercises from exercises database');
		})
	},
	function add_resistance(cb) {
		Async.eachSeries(DB.resistance, add_exercise, function(err) {
			cb(err, 'Populated Exercises database with resistance exercises');
		})
	},
	function add_cardio(cb) {
		Async.eachSeries(DB.cardio, add_exercise, function(err) {
			cb(err, 'Populated Exercises database with cardio exercises');
		})
	}
];

function add_exercise(ex, next) {
	Seneca.act(generate_msg(ex), next);
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

//once Seneca is loaded run the tasks
Seneca.ready(() => {

	Async.series(tasks, done);

	function done(err, results) {
		if (err) { throw err; }
		console.log(results.join('\n'));
		process.exit(0);
	}
});