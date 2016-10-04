// session.js
var express = require('express');
var router = express.Router();
var socket = require('controllers/socket');

/* A route to receive a POST request to add new sessions to a socket.io room */
router.post('/', function(req, res, next) {

  var token = socket.register({
    room: req.body.room,
    gbrkNr: req.body.gbrkNr,
    sessionId: req.body.sessionId
  });

  res.send({
    "token": token
  });

});


/* A route to emit a message to a socket.io room */
router.put('/room', function(req, res, next) {

  socket.emitToRoom({
    io: res.io,
    room: req.body.room,
    event: req.body.event,
    data: req.body.data
  });

  res.send({
    "result": true
  });

});

/* A route to emit a message to a socket.io client */
router.put('/user', function(req, res, next) {
  socket.emitToUser({
    io: res.io,
    username: req.body.username,
    event: req.body.event,
    data: req.body.data
  });

  res.send({
    "result": true
  });

});


module.exports = router;
