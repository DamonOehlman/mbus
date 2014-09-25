var test = require('tape');
var bus = require('../')('test');

test('can attach to a feed', function(t) {
  var stopFeed = bus.feed(function(evt) {
    t.equal(evt.name, 'foo');
    t.deepEqual(evt.args, [ 'Hi', 'there' ]);

    stopFeed();
    t.pass('feed stopped');
  });

  bus.once('bar', function() {
    t.pass('captured bar');
  });

  t.plan(4);
  bus('foo', 'Hi', 'there');

  // this should not hit the feed as the feed has been stopped
  bus('bar');
});
