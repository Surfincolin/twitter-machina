var express = require('express')
	, http = require('http')
	, stylus = require('stylus')
	, Twit = require('twit')
	, _ = require('underscore')
	, path = require("path");

// Setup - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server); // this tells socket.io to use our express server
var stream_phrase = "bieber";
var twitterQueries = [["BarackObama", "MichelleObama"],["WholeFoods","McDonalds"]];
var twitterQuery_1 = "BarackObama";
var twitterQuery_2 = "MichelleObama";
var numberOfQueries = 20;
// Setup stuff.
app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	// NB: this must be before the static use call below, unless doesn't work... why?
/*	app.use(stylus.middleware(
		{ src: __dirname + '/public'
		, compile: compile
		}
	));*/
	app.use(express.static(__dirname + '/public'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});


// - - - -
/*
lessMiddleware = require('less-middleware');

var app = express();
app.configure(function(){
  var bootstrapPath = path.join(__dirname, 'node_modules', 'bootstrap');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use('/img', express.static(path.join(bootstrapPath, 'img')));
  app.use(app.router);
  app.use(lessMiddleware(path.join(__dirname, 'source', 'less'), {
    dest: path.join(__dirname, 'public'),
    parser: {
      paths: [path.join(bootstrapPath, 'less')],
    }
  }));
  app.use(express.static(path.join(__dirname, 'public')));
});
*/
// - - - - - -




function compile(str, path) {
	return stylus(str).set('filename', path)
}
app.configure('development', function(){
	app.use(express.errorHandler());
});

// Web pages & routes - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Routes to the various pages.
app.get('/', function (req, res) {
		res.render('index.jade',
			{title: 'Twitter Machina - Prototype', twitterQuery_1_msg: twitterQuery_1, twitterQuery_2_msg: twitterQuery_2}
		);
});

//
console.log("Express server listening on port 3000");

// Twitter API usage - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


// Open a socket to stream results continuously to our webpage.
io.sockets.on('connection', function (socket) {
	console.log('A new user connected!');
	// socket.emit('info', { msg: 'The world is round, there is no up or down.' });       //OLD

	socket.on('eClientRequestsTwitterQuery', function (comparisonId, item1, item2) {
		console.log("serverApp.js- eClientRequestsTwitterQuery- ENTER- item1: "+ item1 +" | item2: "+ item2);
		sendQueries(socket, comparisonId, item1, item2);
	});

});

// Sends 2 queries to Twitter for a Comparison object.
function sendQueries(socket, comparisonId, item1, item2) {
	console.log("serverApp.js- sendQueries- ENTER- comparisonId = "+ comparisonId +" | item1 = "+ item1 +" | item2 = "+ item2);

	// Search tweets from twitter user #1's timeline.
	function getQueries(iQ) {
		T.get('statuses/user_timeline', { screen_name: item1, exclude_replies: true, include_rts: false, count: iQ }, function(err, data, response) {
			if (err) {
				console.log("ERROR- serverApp.js- search #1.");
				console.error(err.stack);
			} else if (data.length >= numberOfQueries) {
						var dataSet1 = data.slice(0, numberOfQueries+1);
						socket.emit('eServerReturnsTwitterResult_'+ comparisonId, {iData: dataSet1, iQueryNum: 1, iQueryString: item1});
				} else {
						var curSearch1 = iQ + numberOfQueries;
						if (curSearch1 > numberOfQueries*1) { // Multiply for more
							var dataSet1 = data.slice(0, numberOfQueries+1);
							socket.emit('eServerReturnsTwitterResult_'+ comparisonId, {iData: dataSet1, iQueryNum: 1, iQueryString: item1});
						} else {
							getQueries(curSearch1);
						}
				}
			}
			
		);
	};
	getQueries(numberOfQueries);

	// Ger twitter user #1's image url.
	T.get('users/show/:screen_name', { screen_name: item1 }, function (err, data, response) {
	  console.log("USER IMAGE: ")
	  console.log(data.profile_image_url)
	  socket.emit('eServerReturnsUserImage_'+ comparisonId, {iImageUrl: data.profile_image_url, iQueryNum: 1});
	})


	// Search tweets from twitter user #2's timeline.
	function getQueries2(iQ) {
		T.get('statuses/user_timeline', { screen_name: item2, exclude_replies: true, include_rts: false, count: iQ }, function(err, data, response) {
			if (err) {
				console.log("ERROR- serverApp.js- search #2.");
				console.error(err.stack);
			} else if (data.length >= numberOfQueries) {
						var dataSet2 = data.slice(0, numberOfQueries+1);
						socket.emit('eServerReturnsTwitterResult_'+ comparisonId, {iData: dataSet2, iQueryNum: 2, iQueryString: item2});
				} else {
						var curSearch2 = iQ + numberOfQueries;
						if (curSearch2 > numberOfQueries*1) { // Multiply for more
							var dataSet2 = data.slice(0, numberOfQueries+1);
							socket.emit('eServerReturnsTwitterResult_'+ comparisonId, {iData: dataSet2, iQueryNum: 2, iQueryString: item2});
						} else {
							getQueries2(curSearch2);
						}
				}
			}
			
		);
	};
	getQueries2(numberOfQueries);
	
	// Ger twitter user #2's image url.
	T.get('users/show/:screen_name', { screen_name: item2 }, function (err, data, response) {
	  console.log("USER IMAGE: ")
	  console.log(data.profile_image_url)
	  socket.emit('eServerReturnsUserImage_'+ comparisonId, {iImageUrl: data.profile_image_url, iQueryNum: 2});
	})
}

// Twitter credentials.
// Replace these with your own!
// DEV: Using Alex's keys.
var T = new Twit({
		consumer_key: 'lG3ef2gaY5yeX0kVj7W3DFDG3'
	, consumer_secret: 'HNcGrpUvd9mIAaE6qHhYfupdS49IEZ5Vgl7TwVYVtHCYq0dd2D'
	, access_token: '48737760-s2s2jcYDNhKuiZFdCRchedjUTg4VuztWpCdQaJQNu'
	, access_token_secret: 'DPgXfVNT2e4bqOcjl5rhur1tP5PRk6tu5MH2HeYTScaW3'
});

// Extras - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


// Handle uncaughtException errors, to prevent app from crashing when one happens.
process.on('uncaughtException', function(err) {
	console.error("ERROR- uncaughtException- "+ err.stack);
});