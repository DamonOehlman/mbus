var createTrie = require('array-trie');
var reDelim = /[\.\:]/;

/**
  # mbus

  If Node's EventEmitter and Eve were to have a child, it might look something like this.
  No wildcard support at this stage though...

  ## Example Usage

  Displayed below is a simple example:

  <<< examples/simple.js

  ```
  foo.bar triggered
  ```

  Another simple example demonstrates, how a message bus can be provided a
  parent message bus to relay messages to once after any local handlers have
  been invoked:

  <<< examples/parent.js

  ```
  foo triggered bar
  foo.bar triggered
  ```

  ## Understanding Event Namespaces

  By default, events are emitted with a dot delimited format which respects
  their lineage.  A good example of this is the second example shown above.

  It is not mandatory for a child bus to add it's own namespace when events
  are invoked, however, as the bus can be created with an empty namespace:

  <<< examples/empty-namespace.js

  ```
  foo triggered bar
  bar triggered at parent level
  ```

  This can be very useful when you want to unify events into a single event
  bus but distribute their creation across a number of packages.

  ## Event Feeds

  In some situations, it is more desirable to get information on all the
  events that are passing through a bus rather than attempting to intercept
  individual events.  This behaviour can be done using mbus via the `feed`
  function:

  <<< examples/feed.js

  ```
  received event name: foo, with args:  [ 'hello', 'there' ]
  received event name: bar, with args:  []
  ```

  Additionally, feeds can be attached to a bus parent to capture namespaced
  events:

  <<< examples/feed-parent.js

  ```
  received event name: foo.bar, with args:  [ 'hello', 'there' ]
  received event name: foo.baz, with args:  []
  ```

  ## Reference

**/

var createBus = module.exports = function(namespace, parent, scope) {
  var registry = createTrie();
  var feeds = [];

  function bus(name) {
    var args = [].slice.call(arguments, 1);
    var parts = getNameParts(name);
    var delimited = parts.join('.');
    var handlers = registry.get(parts) || [];
    var results;

    // send through the feeds
    feeds.forEach(function(feed) {
      feed({ name: delimited, args: args });
    });

    // run the registered handlers
    results = handlers.map(function(handler) {
      return handler.apply(scope || this, args);
    });

    // run the parent handlers
    if (bus.parent) {
      results = results.concat(
        bus.parent.apply(scope || this, [namespace.concat(parts)].concat(args))
      );
    }

    return results;
  }

  function feed(handler) {
    function stop() {
      feeds.splice(feeds.indexOf(handler), 1);
    }

    feeds.push(handler);
    return stop;
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

  /**
    ### bus#on(name, handler)

    Register an event handler for the event `name`.

  **/
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


  /**
    ### bus#once(name, handler)

    Register an event handler for the event `name` that will only
    trigger once (i.e. the handler will be deregistered immediately after
    being triggered the first time).

  **/
  function once(name, handler) {
    return on(name, function handleEvent() {
      var result = handler.apply(this, arguments);
      bus.off(name, handleEvent);

      return result;
    });
  }

  if (typeof namespace == 'function') {
    parent = namespace;
    namespace = '';
  }

  namespace = (namespace && namespace.split(reDelim)) || [];

  bus.feed = feed;
  bus.on = on;
  bus.once = once;
  bus.off = off;
  bus.parent = parent || (namespace && namespace.length > 0 && createBus());

  return bus;
};
