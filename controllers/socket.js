var jwt = require('jsonwebtoken');
var config = require('config.json');

var sessions = [];

function register(registration) {
  winston.info('Create token for new registration', registration);
  // Just return a JWT token with room and sessionId
  return jwt.sign(registration, config.websocket.secret, {
    expiresIn: '1d'
  });
};

function emitToRoom(options) {
  winston.info('emitting a message to a room', options)
  options.io.to(options.room).emit(options.event, options.data);
};

function emitToUser(options) {
  winston.info('emitting a message to a user', options)
  options.io.to(sessions[options.username]).emit(options.event, options.data);
}

function onConnect(socket) {

    winston.info('A new client is connected. The user may join a room with a token.');

    socket.on('join-room', function(data) {

      winston.info('The client attemps to join room with token', data.token);

      jwt.verify(data.token, config.secret, function(err, decoded) {
        if (err) {
          err = new Error('Invalid token');
          winston.error(err);
          socket.emit(err);
        } else {
          winston.log(decoded, socket.id);
          sessions[decoded.username] = socket.id;
          socket.join(decoded.room);
        }
      });

    });
}

module.exports = {
  register: register,
  emitToRoom: emitToRoom,
  emitToUser: emitToUser,
  onConnect: onConnect
}
