require('app-module-path').addPath(__dirname); // relative filepaths
var express = require('express');
var webSocketApp = express();
var RESTApp = express();
var webSocketServer = require('http').Server(webSocketApp);
var RESTServer = require('http').Server(RESTApp);
var bodyParser = require('body-parser');
var io = require('socket.io')(webSocketServer);
var config = require('config.json');
var winston = require('winston');
var auth = require('middlewares/auth');
var socket = require("routes/socket");
var onConnect = require('controllers/socket').onConnect;

// setup REST Api
RESTApp.use(bodyParser.json());
//RESTApp.use(auth);
RESTApp.use(function(req, res, next){
  res.io = io;
  next();
});
RESTApp.use('/socket', socket);

// setup WebSocket Api
io.on('connection', onConnect);

webSocketServer.listen(config.REST.port, function() {
  winston.info('The REST server is up and running on port', config.REST.port);
});

RESTServer.listen(config.websocket.port, function() {
  winston.info('The WebSocket server is up and running on port', config.websocket.port);
});

// setup WebSocket Api
