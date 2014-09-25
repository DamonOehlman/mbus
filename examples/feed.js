var bus = require('..')();
var stopFeed = bus.feed(function(evt) {
  console.log('received event name: ' + evt.name + ', with args: ', evt.args);
});

// trigger some events
bus('foo', 'hello', 'there');
bus('bar');

// terminate the feed
stopFeed();

// won't be logged as the feed has been stopped
bus('baz');
