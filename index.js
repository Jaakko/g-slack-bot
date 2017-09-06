'use strict';
var https = require('https');
var API_KEY = "YOUR_API_KEY"

exports.http = (request, response) => {
	var q = request.body.text
	console.log('request text: '+ q);
	var body = {
		'q': q,
		'source': 'en',
		'target': 'es',
		'format': 'text'
	}
	
	var path = '/language/translate/v2?key=' + API_KEY;
	var options = {
		host: "translation.googleapis.com",
		path: path,
		method: 'POST',
		headers: {'Content-Type': 'application/json'}
	};
	var callback = function(res) {
		var str = ''
		var translateResponse;
		res.on('data', function (chunk) {
			str += chunk;
		});
		
		res.on('end', function () {
			translateResponse = JSON.parse(str);
			var responseText = {
				'response_type': "in_channel",
				'text': translateResponse.data.translations[0].translatedText
			};
			response.status(200).send(responseText);
		});
	}
	var req = https.request(options, callback);
	req.on('error', function(e) {
		console.log('problem with request: '+ e);
	});

	req.write(JSON.stringify(body));
	req.end();
	
	
};

exports.event = (event, callback) => {
	console.log('Hello Event World!');
	callback();
};
