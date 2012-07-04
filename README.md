 cantest - silly testing for canvas static output

[![Build Status](https://secure.travis-ci.org/eladb/node-cantest.png)](http://travis-ci.org/eladb/node-cantest)

__cantest__ is a simple way to validate that a canvas drawing function did not break.
It basically executes the test and compares the PNG result to an expected PNG file.

Note that for now __cantest__ can be used (for now) only for static outputs, but it's cool anyway :-).

Use [npm](npmjs.org) to install __cantest__:

```bash
$ npm install -g cantest
```

You will also need __node-canvas__ for drawing stuff in your tests:

```bash
# local install (no -g) - test code requires it
$ npm install canvas
```

Create a test (e.g. `mytest.js`):

```js
var Canvas = require('canvas'); 

module.exports = function() {
  var canvas = new Canvas(200, 200);
  var ctx = canvas.getContext('2d');

  // https://github.com/learnboost/node-canvas#example

  ctx.fillStyle = 'orange';
  ctx.fillRect(0, 0, 200, 200);

  ctx.fillStyle = 'black';

  ctx.font = '30px Impact';
  ctx.rotate(.1);
  ctx.fillText("Awesome!", 50, 100);

  var te = ctx.measureText('Awesome!');
  ctx.strokeStyle = 'rgba(128,100,0,0.5)';
  ctx.beginPath();
  ctx.lineTo(50, 102);
  ctx.lineTo(50 + te.width, 102);
  ctx.stroke();

  // the test must return the canvas
  return canvas;
};
```

Run __cantest__ for the first time. Since `mytest.png` does not exist, it will be generated
by __cantest__ but the test will fail (exit code 1).

```bash
$ cantest mytest.js
[mytest.js] mytest.png created
```

Next time you run the test, it should succeed quitely:

```bash
$ cantest mytest.js
$ 
```

Now, change something in `mytest.js`. For example, replace:

```js
ctx.fillStyle = 'orange';
```

With:

```js
ctx.fillStyle = 'green';
```

And when you run __cantest__ again:

```bash
$ cantest mytest.js
[mytest.js] Test failed. See actual output in .actual.mytest.png
```

The browser window should also open and you should see:

![failure](https://github.com/eladb/node-cantest/raw/master/doc/failure.png)


## Command line

```bash
$ cantest -h
Usage: cantest <files...> {options}

Options:
  -b, --browse   Open browser if test fails to compare results (use --no-browse to negate)  [default: true]
  -v, --verbose  Verbose output                                                             [default: false]
  -h, --help     Show help                                                                
```

## API

### cantest(module, [options], [callback))

Executes the function exported by the `module`. The function should return a `Canvas` object (created by `node-canvas`).

 * `module` is the path to a node.js module.
 * `options` is optional.
 * `options.expected` may contain the name of a `.png` image that contains the expected result. By default, it is assumed to be the 
   name of the test file with a `.png` extension. For example, if module is `test55.js` the expected file is `test55.png`.
 * `options.actual` can be used to export the actual result into a `.png` file. Otherwise, it will be written into a temp file which
   will be deleted (upon success).
 * `callback` is optional and may contain a `function(err, result)` where `result` is:
   * `passed` - `Boolean` indicating whether the test passed or not.
   * `expected` - `String` path to the png file that contains the expected result.
   * `actual` - `String` path to the png file that contains the actual result.
   * `test` - `String` the base name of the test file.
   * `compare` - Optional `String` with path to an an HTML for comparison between actual and expected.

### assert.canvasEqual(c1, c2, [message])

An extension to the `assert` module which compares two `Cavnas` objects. Any of `c1` and `c2` may also be a `Buffer`.

## License

(The MIT License)

Copyright (c) 2011 Elad Ben-Israel

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
>>>>>>> Initial commit
