var assert = require('assert');

// compares to canvas objects or two buffers.
assert.canvasEqual = function(actual, expected, message) {
  message = message || "Non-equal canvas objects";

  var actual_buff = Buffer.isBuffer(actual) ? actual : actual.toBuffer();
  var expected_buff = Buffer.isBuffer(expected) ? expected : expected.toBuffer();

  assert.equal(actual_buff.length, expected_buff.length, message);

  for (var i = 0; i < expected_buff.length; ++i) {
    assert.equal(actual_buff[i], expected_buff[i], message);
  }
};

module.exports = assert;