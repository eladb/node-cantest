var Canvas = require('..').Canvas;

module.exports = function() {
  var canvas = new Canvas(200, 200);
  var ctx = canvas.getContext('2d');
  
  ctx.fillStyle = 'red';
  ctx.fillRect(10, 10, 50, 50);
  
  return canvas;
};
