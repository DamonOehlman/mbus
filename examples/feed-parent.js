var bus = require('..')();
var foo = require('..')('foo', bus);
var stopFeed = bus.feed(function(evt) {
  console.log('received event name: ' + evt.name + ', with args: ', evt.args);
});

// trigger some events
foo('bar', 'hello', 'there');
foo('baz');
