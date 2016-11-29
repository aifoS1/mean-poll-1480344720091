/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser')
var methodOverride = require('method-override')

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
app.set('port', process.env.VCAP_APP_PORT || 3000);

app.use(bodyParser.json())
app.use(methodOverride())


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Handle Errors gracefully
app.use(function(err, req, res, next) {
	if(!err) return next();
	console.log(err.stack);
	res.json({error: true});
});

// Main App Page
app.get('/', routes.index);

// MongoDB API Routes
app.get('/polls/polls', routes.list);
app.get('/polls/:id', routes.poll);
app.post('/polls', routes.create);
app.post('/vote', routes.vote);

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

io.sockets.on('connection', routes.vote);

// server.listen(app.get('port'), function(){
//   console.log('Express server listening on port ' + app.get('port'));
// });

// start server on the specified port and binding host
server.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
