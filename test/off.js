var test = require('tape');
var bus = require('../')('test');

test('bus emits simple events', function(t) {
  t.plan(1);
  bus.once('foo', function(data) {
    t.equal(data, 'bar');
  });

  bus('foo', 'bar');
});

test('off deregisters targeted handler', function(t) {
  function handleEvent(data) {
    t.fail('Should not receive event');
  }

  t.plan(1);
  bus.on('foo', handleEvent);

  setTimeout(function() {
    t.pass('event not triggered');
  }, 500);

  bus.off('foo', handleEvent);
  bus('foo', 'bar');
});

test('off deregistering unknown event does not affect event flow', function(t) {
  var failTimer = setTimeout(function() {
    t.fail('event not triggered');
  }, 500);

  function handleEvent(data) {
    clearTimeout(failTimer);
    t.pass('event triggered');
  }

  t.plan(1);
  bus.once('foo', handleEvent);

  bus.off('foo', function() {});
  bus('foo', 'bar');
});

test('off deregisters handler loaded with once', function(t) {
  function handleEvent(data) {
    t.fail('Should not receive event');
  }

  t.plan(1);
  bus.once('foo', handleEvent);

  setTimeout(function() {
    t.pass('event not triggered');
  }, 500);

  bus.off('foo', handleEvent);
  bus('foo', 'bar');
});
