Displayed below is a simple example:

<<< examples/simple.js

__OUTPUT:__

```
foo.bar triggered
```

Another simple example demonstrates, how a message bus can be provided a parent message bus to relay messages to once after any local handlers have been invoked:

<<< examples/parent.js

__OUTPUT:__

```
foo triggered bar
foo.bar triggered
```

## Understanding Event Namespaces

By default, events are emitted with a dot delimited format which respects their lineage.  A good example of this is the second example shown above.

It is not mandatory for a child bus to add it's own namespace when events are invoked, however, as the bus can be created with an empty namespace:

<<< examples/empty-namespace.js

__OUTPUT:__

```
foo triggered bar
bar triggered at parent level
```

This can be very useful when you want to unify events into a single event bus but distribute their creation across a number of packages.

## Event Feeds

In some situations, it is more desirable to get information on all the events that are passing through a bus rather than attempting to intercept individual events.  This behaviour can be done using mbus via the `feed` function:

<<< examples/feed.js

__OUTPUT:__

```
received event name: foo, with args:  [ 'hello', 'there' ]
received event name: bar, with args:  []
```

Additionally, feeds can be attached to a bus parent to capture namespaced events:

<<< examples/feed-parent.js

__OUTPUT:__

```
received event name: foo.bar, with args:  [ 'hello', 'there' ]
received event name: foo.baz, with args:  []
```
