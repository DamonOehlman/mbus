var bus = require('..')();
var foo = require('..')('foo', bus);

bus.on('foo.bar', function() {
  console.log('foo.bar triggered');
});

foo.on('bar', function() {
  console.log('foo triggered bar');
});

foo('bar');
