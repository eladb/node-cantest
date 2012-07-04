var path = require('path');
var fs = require('fs');
var open = require('open');

var assert = require('assert');
require('./assert'); // adds `assert.canvasEqual()`.

// executes the function exported by the module `module`. The function should 
// return a Canvas object (created by `node-canvas`).
// `module` is the path to a node.js module.
// `options` is optional.
// `options.expected` may contain the name of a `.png` image that contains the expected result. By default, it is assumed to be the 
// name of the test file with a `.png` extension. For example, if module is `test55.js` the expected file is `test55.png`.
// `options.actual` can be used to export the actual result into a `.png` file. Otherwise, it will be written into a temp file which
// will be deleted (upon success).
// `callback` is optional and may contain a `function(err, result)`.
module.exports = function(module, options, callback) {
  if (!module) throw new Error('`module` is required');

  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  // default callback would throw on error./
  if (!callback) {
    callback = function(err) {
      if (err) throw err;
    };
  }

  options = options || {};

  var testFile = path.resolve(module);
  var testName = path.basename(testFile, '.js');

  var expectedFile = options.expected || path.join(path.dirname(testFile), testName + '.png');
  var actualFile = options.actual || path.join(path.dirname(testFile), '.actual.' + testName + '.png');
  
  var fn = require(testFile);


  var canvas;

  try {
    canvas = fn();
  }
  catch(e) {
    return callback(e);
  }

  // verify that we can export the canvas to a buffer
  if (!canvas.toBuffer) {
    return callback(new Error('test module must export a function that returns a `node-canvas` object with a `toBuffer` function'));
  }

  var result = { test: testName };

  // convert canvas to a the `actual` buffer.
  return canvas.toBuffer(function(err, actual) {

    // write output to the 'actual' file.
    return fs.writeFile(actualFile, actual, function(err) {
      if (err) return callback(err);

      // read expectations file
      return fs.readFile(expectedFile, function(err, expected) {

        // if the expectation file does not exist, write it and exit with an error
        if (err) {
          return fs.writeFile(expectedFile, actual, function(err) {
            if (err) return callback(err);
            result.actual = result.expected = expectedFile;
            result.passed = false;
            return callback(null, result);
          });
        }

        try {

          // compare canvas objects
          assert.canvasEqual(actual, expected);

          // if all goes well, delete the actual temp file (if `options.actual` is not specified)
          if (!options.actual) {
            fs.unlink(actualFile);
          }

          result.passed = true;
          result.actual = result.expected = expectedFile;
          return callback(null, result);
        }
        catch (e) {

          result.error = e;
          result.expected = expectedFile;
          result.actual = actualFile;

          return createComparisonHTML(result, function(err, output) {
            var htmlFile = path.join('/tmp', Math.round(Math.random() * 100000) + '.html');
            return fs.writeFile(htmlFile, output, function(err) {
              if (err) return callback(err);
              result.passed = false;
              result.compare = htmlFile;
              return callback(null, result);
            });
          });
        }
      });
    });
  });

  function createComparisonHTML(dict, callback) {
    fs.readFile(path.join(__dirname, 'compare.html'), function(err, template) {
      if (err) return callback(err);

      var html = template.toString();

      for (var k in dict) {
        html = html.replace(new RegExp('{{' + k + '}}', 'g'), dict[k].toString());
      }

      return callback(null, html);
    });
  } 

};

module.exports.Canvas = require('canvas');
