var bus = require('..')('test');

bus.on('foo.bar', function() {
  console.log('foo.bar triggered');
});

bus('foo.bar');
