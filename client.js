var seneca = require('seneca')()
seneca.client()

var exercise = {name: 'pushup4', category: 'Body Weight', tags: ['Chest', 'Arms'], type: 'weight/reps', created_by: 'Ronan'}

seneca.act({role: 'exercises', cmd: 'save', exercise: exercise}, function(err, response) {
	seneca.act({role: 'exercises', cmd: 'remove', exercise: {id: response.id}}, function(err, response) {
		console.log(response);
	})
});

seneca.act({role: 'exercises', cmd: 'list', user: 'Ronan'}, function(err, response) {
	console.log(response)
});