describe('trailers', function () {
  'use strict';

  var request = require('request')
    , http = require('http')
    , res = http.ServerResponse.prototype
    , setHeader = res.setHeader
    , end = res.end
    , port = 2222;

  var chai = require('chai')
    , expect = chai.expect;

  //
  // Override the trailers AFTER we've gotten the references.
  //
  var trailers = require('../');

  it('overrides the `setHeader` method', function () {
    expect(res.setHeader).to.not.equal(setHeader);
  });

  it('overrides the `end` method', function () {
    expect(res.end).to.not.equal(end);
  });

  it('doesnt export anything', function () {
    expect(Object.keys(trailers).length).to.equal(0);
  });

  it('introduces the `trailers` object', function () {
    expect(res.trailers).to.be.a('object');
  });

  it('doesnt throw when you write multiple headers', function (done) {
    var server = http.createServer(function (req, res) {
      res.setHeader('Content-Type', 'text/html');
      res.write('foo');

      setTimeout(function () {
        res.setHeader('X-WhatEver', 'value');
        res.end();
      }, 10);
    });

    server.listen(port, function () {
      request('http://localhost:'+ port, function (err, res) {
        expect(res.trailers['x-whatever']).to.equal('value');
        server.close();
        done(err);
      });
    });
  });
});
