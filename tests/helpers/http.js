const request = require('supertest');

function sendJson(app, method, url, body) {
  const req = request(app)[method](url).set('Content-Type', 'application/json');

  if (body !== undefined) {
    return req.send(JSON.stringify(body));
  }

  return req;
}

module.exports = {
  sendJson,
};
