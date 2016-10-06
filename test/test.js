'use strict';

var config = require('../src/config');

var request = require('supertest');

describe('react-boilerplate', function() {
  var app;
  beforeEach(function() {
    this.timeout(100000);
    app = require('../src/server');
  });
  it('main page', function(done) {
    this.timeout(100000);
    request(app).get('/').expect(200, done);
  });
});
