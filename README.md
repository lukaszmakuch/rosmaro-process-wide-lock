# Process-wide lock for Rosmaro
This package provides process-wide, in-memory locks for [Rosmaro](https://github.com/lukaszmakuch/rosmaro). They are useful in situation where a Rosmaro model is used only by one process (like development environments or the browser).

## Usage
```js
const make_lock = require('rosmaro-process-wide-lock').default
const lock = make_lock()
```

## Installing
```
$ npm i rosmaro-process-wide-lock --save
```
