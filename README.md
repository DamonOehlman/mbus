# mbus

If Node's EventEmitter and Eve were to have a child, it might look something like this.
No wildcard support at this stage though...


[![NPM](https://nodei.co/npm/mbus.png)](https://nodei.co/npm/mbus/)

[![Build Status](https://img.shields.io/travis/DamonOehlman/mbus.svg?branch=master)](https://travis-ci.org/DamonOehlman/mbus) 

## Example Usage

Displayed below is a simple example:

```js
var bus = require('mbus')();

bus.on('foo.bar', function() {
  console.log('foo.bar triggered');
});

bus('foo.bar');

```

Another simple example demonstrates, how a message bus can be provided a
parent message bus to relay messages to once after any local handlers have
been invoked:

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

## Understanding Event Namespaces

By default, events are emitted with a dot delimited format which respects
their lineage.  A good example of this is the second example shown above.

It is not mandatory for a child bus to add it's own namespace when events
are invoked, however, as the bus can be created with an empty namespace:

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

This can be very useful when you want to unify events into a single event
bus but distribute their creation across a number of packages.

## Reference

### bus#on(name, handler)

Register an event handler for the event `name`.

### bus#once(name, handler)

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
