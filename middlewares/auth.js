var basicAuth = require('basic-auth');
var config = require('config.json');

function authenticate(req, res, next) {
  var user = basicAuth(req);
  if (!user || !user.name || !user.pass) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    res.sendStatus(401);
  }
  if (user.name === config.username && user.pass === config.password) {
    next();
  } else {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    res.sendStatus(401);
  }
};

module.exports = {
  authenticate: authenticate
};
