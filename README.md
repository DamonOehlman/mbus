# mbus

If Node's EventEmitter and Eve were to have a child, it might look something like this.
No wildcard support at this stage though...


[![NPM](https://nodei.co/npm/mbus.png)](https://nodei.co/npm/mbus/)

[![unstable](https://img.shields.io/badge/stability-unstable-yellowgreen.svg)](https://github.com/dominictarr/stability#unstable) [![Build Status](https://img.shields.io/travis/DamonOehlman/mbus.svg?branch=master)](https://travis-ci.org/DamonOehlman/mbus) 

## Example Usage

Displayed below is a simple example:

```js
var bus = require('mbus')();

bus.on('foo.bar', function() {
  console.log('foo.bar triggered');
});

bus('foo.bar');

```

__OUTPUT:__

```
foo.bar triggered
```

Another simple example demonstrates, how a message bus can be provided a parent message bus to relay messages to once after any local handlers have been invoked:

```js
var bus = require('mbus')();
var foo = require('mbus')('foo', bus);

bus.on('foo.bar', function() {
  console.log('foo.bar triggered');
});

foo.on('bar', function() {
  console.log('foo triggered bar');
});

foo('bar');

```

__OUTPUT:__

```
foo triggered bar
foo.bar triggered
```

## Understanding Event Namespaces

By default, events are emitted with a dot delimited format which respects their lineage.  A good example of this is the second example shown above.

It is not mandatory for a child bus to add it's own namespace when events are invoked, however, as the bus can be created with an empty namespace:

```js
var bus = require('mbus')();
var foo = require('mbus')('', bus);

bus.on('bar', function() {
  console.log('bar triggered at parent level');
});

foo.on('bar', function() {
  console.log('foo triggered bar');
});

foo('bar');

```

__OUTPUT:__

```
foo triggered bar
bar triggered at parent level
```

This can be very useful when you want to unify events into a single event bus but distribute their creation across a number of packages.

## Event Feeds

In some situations, it is more desirable to get information on all the events that are passing through a bus rather than attempting to intercept individual events.  This behaviour can be done using mbus via the `feed` function:

```js
var bus = require('mbus')();
var stopFeed = bus.feed(function(evt) {
  console.log('received event name: ' + evt.name + ', with args: ', evt.args);
});

// trigger some events
bus('foo', 'hello', 'there');
bus('bar');

// terminate the feed
stopFeed();

// won't be logged as the feed has been stopped
bus('baz');

```

__OUTPUT:__

```
received event name: foo, with args:  [ 'hello', 'there' ]
received event name: bar, with args:  []
```

Additionally, feeds can be attached to a bus parent to capture namespaced events:

```js
var bus = require('mbus')();
var foo = require('mbus')('foo', bus);
var stopFeed = bus.feed(function(evt) {
  console.log('received event name: ' + evt.name + ', with args: ', evt.args);
});

// trigger some events
foo('bar', 'hello', 'there');
foo('baz');

```

__OUTPUT:__

```
received event name: foo.bar, with args:  [ 'hello', 'there' ]
received event name: foo.baz, with args:  []
```


## Reference

### `mbus(namespace?, parent?, scope?)`

Create a new message bus with `namespace` inheriting from the `parent`
mbus instance.  If events from this message bus should be triggered with
a specific `this` scope, then specify it using the `scope` argument.

### `mbus#clear()`

Reset the handler registry, which essential deregisters all event listeners.

_Alias:_ `removeAllListeners`

### `mbus#feed(handler)`

Attach a handler function that will see all events that are sent through
this bus in an "object stream" format that matches the following format:

```
{ name: 'event.name', args: [ 'event', 'args' ] }
```

The feed function returns a function that can be called to stop the feed
sending data.

### `mbus#off(name, handler)`

Deregister an event handler.

### `mbus#on(name, handler)`

Register an event handler for the event `name`.

### `mbus#once(name, handler)`

Register an event handler for the event `name` that will only
trigger once (i.e. the handler will be deregistered immediately after
being triggered the first time).

## License(s)

### MIT

Copyright (c) 2014 Damon Oehlman <damon.oehlman@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
