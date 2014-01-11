# Trailers

[![Build Status](https://travis-ci.org/3rd-Eden/trailers.png?branch=master)](https://travis-ci.org/3rd-Eden/trailers)

HTTP is amazing, it has amazing features that most of us aren't using. One of
these features are trailing headers. These are headers that can be send after
you've already written your initial HTTP headers. The only caveat is that they
only work with `transfer-encoding: chunked`, luckly, this is enabled by default
in Nodejs.

## Installation

The module can be downloaded from the npm registry:

```
npm install --save trailers
```

The `--save` tells `npm` to automatically add the installed version to your
`package.json`

## Usage

When using this module, nothing changes how you and program your Node.js
applications. The only difference is that you can write headers AFTER you've
written the headers of your response. You can still use `res.setHeaders` just
like you would normally do.

To run this module simply include it in your application:

```js
require('trailers');
```

That's it. Everything is magically fixed.

## The magic

The module overrides the prototypes of the `OutgoingMessage` class in Node.js
which is what you get a `Response` object in a HTTP server. The `setHeader`
method is overridden method to check if the headers are already flushed to the
client and queues the headers in a new `trailers` object when they are already
written. We override the `end` method so we can flush these headers using the
`addTrailers` method.

## License

MIT
