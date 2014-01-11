'use strict';

var res = require('http').ServerResponse.prototype;
if (res._hasTrailersPatch) return;

//
// We don't need to patch the `writeHead` method if the connect has introduced
// an `header` event. This code is an exact copy of connect and is copyrighted
// by sencha/connect.
//
if (!res._hasConnectPatch) {
  var writeHead = res.writeHead;

  /**
   * Did we emit the `header` event.
   *
   * @type {Boolean}
   * @private
   */
  res._emittedHeader = false;

  /**
   * Write the HTTP headers to the stream.
   *
   * @param {Number} statusCode The statusCode of the request.
   * @Param {String} reasonPhrase The reasonPhrase of the statusCode.
   */
  res.writeHead = function patchedWriteHead(statusCode, reasonPhrase, headers) {
    if (typeof reasonPhrase === 'object') headers = reasonPhrase;
    if (typeof headers === 'object') {
      for (var key in headers) {
        if (headers.hasOwnProperty(key)) {
          this.setHeader(key, headers[key]);
        }
      }
    }

    if (!this._emittedHeader) this.emit('header');
    this._emittedHeader = true;

    return writeHead.call(this, statusCode, reasonPhrase);
  };
}
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
