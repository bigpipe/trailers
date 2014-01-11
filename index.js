'use strict';

var res = require('http').ServerResponse.prototype;

//
// Prevent double overrides of this module.
//
if (res._hasTrailersPatch) return;

/**
 * The original setHeader method.
 *
 * @type {Function}
 * @api private
 */
var setHeader = res.setHeader;

/**
 * The trailing headers that should be written at the end of the request.
 *
 * @type {Object}
 * @private
 */
res.trailers = {};

/**
 * Patch the `setHeader` method of the Outgoing message so it becomes aware of
 * a flushed header. It will store the headers in the trailer object so they are
 * flushed when the response is ended.
 *
 * @param {String} name Header name.
 * @param {String} value Header value.
 * @api public
 */
res.setHeader = function patchedSetHeader(name, value) {
  if (this._header) {
    this.trailers[name] = value;
  } else {
    setHeader.call(this, name, value);
  }
};

var end = res.end;

/**
 * Patch the `end` method so it will write out the trailing headers before the
 * connections is closed.
 *
 * @param {Mixed} data Optional data to write.
 * @param {String} encoding The encoding of the message.
 * @param {Function} callback The callback function.
 * @api public
 */
res.end = function patchedEnd(data, encoding, callback) {
  if (Object.keys(this.trailers).length) {
    this.addTrailers(this.trailers);
  }

  return end.call(this, data, encoding, callback);
};

//
// Make sure that the trailers patch is only loaded once.
//
res._hasTrailersPatch = true;
