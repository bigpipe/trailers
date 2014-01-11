describe('trailers', function () {
  'use strict';

  var res = require('http').ServerResponse.prototype
    , setHeader = res.setHeader
    , end = res.end;

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
});
