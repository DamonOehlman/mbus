var bus = require('..')();
var foo = require('..')('', bus);

bus.on('bar', function() {
  console.log('bar triggered at parent level');
});

foo.on('bar', function() {
  console.log('foo triggered bar');
});

foo('bar');
