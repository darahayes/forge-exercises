var seneca = require('seneca')()
seneca.client()

var msg = {role: 'exercises', cmd: 'save', name: 'Default_Pushup', category: 'Body Weight', tags: ['Chest', 'Arms'], created_by: null}

// seneca.act(msg, function(err, response) {
// 	console.log(response);
// });

// seneca.act({role: 'exercises', cmd: 'remove', exercise: '569ea6adadc0e42a4e07fb71'}, function(err, response) {
// 	console.log(response)
// });

seneca.act({role: 'exercises', cmd: 'list'}, console.log);