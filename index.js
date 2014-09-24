var createTrie = require('array-trie');
var reDelim = /[\.\:]/;

var createBus = module.exports = function(namespace, parent) {
  var registry = createTrie();

  function bus(name) {
    var args = [].slice.call(arguments, 1);
    var parts = Array.isArray(name) ? name : name.split(reDelim);
    var handlers = registry.get(parts);

    // run the parent handlers
    if (bus.parent) {
      bus.parent.apply(null, [ namespace.concat(parts) ].concat(args));
    }

    return handlers && handlers.map(function(handler) {
      return handler.apply(null, args);
    });
  }

  function off(name, handler) {
    var parts = name.split(reDelim);
    var handlers = registry.get(parts);

    if (handlers) {
      handlers.splice(handlers.indexOf(handler), 1);
    }
  }

  function on(name, handler) {
    var parts = name.split(reDelim);
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
