var test = require('tape');
var bus = require('../')('test');

test('bus emits simple events', function(t) {
  t.plan(1);
  bus.once('foo', function(data) {
    t.equal(data, 'bar');
  });

  bus('foo', 'bar');
});

test('clear deregisters all listeners', function(t) {
  t.plan(1);
  bus.once('foo', function(data) {
    t.fail('Should not receive event');
  });

  setTimeout(function() {
    t.pass('event not triggered');
  }, 500);

  bus.clear();
  bus('foo', 'bar');
});
