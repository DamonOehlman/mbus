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

test('clear targeted handlers', function(t) {
  var failTimer = setTimeout(function() {
    t.fail('bar not triggered');
  }, 1000);

  t.plan(2);
  bus.once('foo', function() {
    t.fail('Should not receive event');
  });

  bus.once('bar', function() {
    t.pass('received bar');
    clearTimeout(failTimer);
  });

  setTimeout(function() {
    t.pass('event not triggered');
  }, 500);

  bus.clear('foo');
  bus('foo');
  bus('bar');
});

test('clear targeted, nested handlers', function(t) {
  var failTimer = setTimeout(function() {
    t.fail('foo.baz not triggered');
  }, 1000);

  t.plan(2);
  bus.once('foo.bar', function() {
    t.fail('Should not receive event');
  });

  bus.once('foo.baz', function() {
    t.pass('received foo.baz');
    clearTimeout(failTimer);
  });

  setTimeout(function() {
    t.pass('event not triggered');
  }, 500);

  bus.clear('foo.bar');
  bus('foo.bar');
  bus('foo.baz');
});
