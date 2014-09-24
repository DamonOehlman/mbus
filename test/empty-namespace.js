var test = require('tape');
var a = require('../')('a');
var b = require('../')('', a);

test('a emits foo (no namespace prepended by b)', function(t) {
  t.plan(1);
  a.once('foo', function(value) {
    t.equal(value, 'bar');
  });

  b('foo', 'bar');
});

test('parent of a emits a.foo', function(t) {
  t.plan(1);
  a.parent.once('a.foo', function(value) {
    t.equal(value, 'bar');
  });

  b('foo', 'bar');
});
