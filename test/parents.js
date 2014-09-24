var test = require('tape');
var a = require('../')('a');
var b = require('../')('b', a);
var c = require('../')('c', b);

test('c emits foo', function(t) {
  t.plan(1);
  c.once('foo', function(value) {
    t.equal(value, 'bar');
  });

  c('foo', 'bar');
});

test('b emits c.foo', function(t) {
  t.plan(1);
  b.once('c.foo', function(value) {
    t.equal(value, 'bar');
  });

  c('foo', 'bar');
});

test('a emits b.c.foo', function(t) {
  t.plan(1);
  a.once('b.c.foo', function(value) {
    t.equal(value, 'bar');
  });

  c('foo', 'bar');
});

test('all handlers can process the event', function(t) {
  t.plan(4);

  c.once('foo', function(value) {
    t.equal(value, 'bar');
    return 1;
  });

  b.once('c.foo', function(value) {
    t.equal(value, 'bar');
    return 2;
  });

  a.once('b.c.foo', function(value) {
    t.equal(value, 'bar');
    return 3;
  });

  t.deepEqual(c('foo', 'bar'), [ 1, 2, 3 ]);
});
