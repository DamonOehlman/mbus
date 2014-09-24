var test = require('tape');
var bus = require('../')('test');

test('bus emits simple events', function(t) {
  t.plan(1);
  bus.once('foo', function(data) {
    t.equal(data, 'bar');
  });

  bus('foo', 'bar');
})
test('bus namespaces events correctly', function(t) {
  t.plan(1);
  bus.parent.once('test.foo', function(data) {
    t.equal(data, 'bar');
  });

  bus('foo', 'bar');
});
