var createTrie = require('array-trie');
var reDelim = /[\.\:]/;

var createBus = module.exports = function(namespace, parent, scope) {
  var registry = createTrie();

  function bus(name) {
    var args = [].slice.call(arguments, 1);
    var parts = getNameParts(name);
    var handlers = registry.get(parts);

    // run the parent handlers
    if (bus.parent) {
      bus.parent.apply(scope || this, [ namespace.concat(parts) ].concat(args));
    }

    return handlers && handlers.map(function(handler) {
      return handler.apply(scope || this, args);
    });
  }

  function getNameParts(name) {
    return Array.isArray(name) ? name : name.split(reDelim);
  }

  function off(name, handler) {
    var handlers = registry.get(getNameParts(name));

    if (handlers) {
      handlers.splice(handlers.indexOf(handler), 1);
    }
  }

  function on(name, handler) {
    var parts = getNameParts(name);
    var handlers = registry.get(parts);

    if (handlers) {
      handlers.push(handler);
    }
    else {
      registry.set(parts, [ handler ]);
    }

    return bus;
  }

  function once(name, handler) {
    on(name, function handleEvent() {
      handler.apply(this, arguments);
      bus.off(name, handleEvent);
    });
  }

  if (typeof namespace == 'function') {
    parent = namespace;
    namespace = '';
  }

  namespace = (namespace && namespace.split(reDelim)) || [];

  bus.on = on;
  bus.once = once;
  bus.off = off;
  bus.parent = parent || (namespace && namespace.length > 0 && createBus());

  return bus;
};
