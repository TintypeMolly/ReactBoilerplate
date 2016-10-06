'use strict';

var request = require('supertest');

var app = require('../src/server').default;

describe('react-boilerplate', function() {
  it('main page', function(done) {
    this.timeout(100000);
    request(app).get('/').expect(200, done);
  });
  it('invalid page', function(done) {
    this.timeout(100000);
    request(app).get('/invalid').expect(404, done);
  });
});
