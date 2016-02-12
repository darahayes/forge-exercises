module.exports = function(options) {

var seneca = this;

seneca.add({role: 'exercises', cmd: 'save'}, save_exercise);
seneca.add({role: 'exercises', cmd: 'list'}, list_exercises);
// seneca.add({role: 'exercises', cmd: 'user_exercises'}, user_exercises);
seneca.add({role: 'exercises', cmd: 'remove'}, remove_exercise);
seneca.add({role: 'exercises', cmd: 'remove_exercises'}, remove_exercises);

function save_exercise(msg, cb) {
	var data
	seneca.make('sys/exercises')
		.data$(map_exercise_data(msg))
		.save$(cb);

	function map_exercise_data(msg) {
		if (msg.category === "Resistance") {
			return {
				name: msg.name,
				category: msg.category,
				tags: msg.tags,
				created_by: msg.created_by,
				main_target: msg.main_target,
				equipment: msg.equipment
			}
		}
		else if (msg.category === 'Cardio') {
			return {
				name: msg.name,
				category: msg.category,
				created_by: msg.created_by
			}
		}
	}
}

// function list_exercises(msg, cb) {
// 	seneca.make('sys/exercises').list$({created_by: null}, cb);
// }

function list_exercises(msg, cb) {
	seneca.make('sys/exercises').native$(function(err, db) {
		var collection = db.collection('sys_exercises');
		collection.find({$or: [{created_by: null}, {created_by: msg.created_by}]}).toArray(cb);
	});
}

// function user_exercises(msg, cb) {
// 	seneca.make('sys/exercises').list$({created_by: msg.created_by}, cb);
// }

function remove_exercise(msg, cb) {
	seneca.make('sys/exercises').remove$({id: msg.exercise}, function(err, resp) {
		cb(err, {info: 'exercise removed'});
	});
}

function remove_exercises(msg, cb) {
	seneca.make('sys/exercises').native$(function(err, db) {
		var collection = db.collection('sys_exercises');
		collection.remove({created_by: msg.user}, function(err, num) {
			if (err) return cb(err);
			cb(null, {info: `Removed all exercises created by ${msg.user}`})
		});
	})
}

}