module.exports = function(options) {

var seneca = this;

seneca.add({role: 'exercises', cmd: 'save'}, save_exercise);
seneca.add({role: 'exercises', cmd: 'list'}, list_exercises);
seneca.add({role: 'exercises', cmd: 'remove'}, remove_exercise);

function save_exercise(msg, cb) {
	seneca.make('sys/exercises')
						.data$({
							name: msg.exercise.name,
							category: msg.exercise.category,
							tags: msg.exercise.tags,
							created_by: msg.exercise.created_by
						})
						.save$(cb);
}

function list_exercises(msg, cb) {
	seneca.make('sys/exercises').list$({created_by: null}, cb);
}

function remove_exercise(msg, cb) {
	seneca.make('sys/exercises').remove$({id: msg.exercise.id}, function(err, resp) {
		cb(err, {info: 'exercise removed'});
	});
}

}