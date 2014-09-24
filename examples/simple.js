var bus = require('..')();

bus.on('foo.bar', function() {
  console.log('foo.bar triggered');
});

bus('foo.bar');
