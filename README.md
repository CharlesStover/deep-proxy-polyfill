# Deep Proxy Polyfill

Acts as a _recursive_ Proxy for getter and setter attributes on an object.

[![package](https://img.shields.io/github/package-json/v/CharlesStover/deep-proxy-polyfill.svg)](https://github.com/CharlesStover/deep-proxy-polyfill/)
[![build](https://travis-ci.com/CharlesStover/deep-proxy-polyfill.svg)](https://travis-ci.com/CharlesStover/deep-proxy-polyfill/)
[![downloads](https://img.shields.io/npm/dt/deep-proxy-polyfill.svg)](https://www.npmjs.com/package/deep-proxy-polyfill)
[![minified size](https://img.shields.io/bundlephobia/min/deep-proxy-polyfill.svg)](https://www.npmjs.com/package/deep-proxy-polyfill)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/deep-proxy-polyfill.svg)](https://www.npmjs.com/package/deep-proxy-polyfill)

## Install

* `npm install deep-proxy-polyfill --save` or
* `yarn add deep-proxy-polyfill`

## Getter

```JavaScript
import deepProxy from 'deep-proxy-polyfill';

const rootObject = {
  a: {
    b: {
      c: 1
    }
  }
};

const getHandler = (obj, key, root, keys) => {
  assert(root === rootObject);

  // [ 'a', 'b' ]
  if (keys.length == 2) {
    assert(obj === rootObject.a.b);
    asset(key === 'c');
    return obj[key] + 2;
  }

  return obj[key];
};

const proxy = deepProxy(rootObject, { get: getHandler });

// Getter returns an additional 2.
assert(proxy.a.b.c === 3);
```

## Setter

```JavaScript
import deepProxy from 'deep-proxy-polyfill';

const rootObject = {
  a: {
    b: {
      c: 1
    }
  }
};

// Set values with an additional 2.
const setHandler = (obj, key, value, root, keys) => {
  assert(root === rootObject);
  obj[key] = value + 2;
};

const proxy = deepProxy(rootObject, { set: setHandler });
proxy.a.b.c = 3;

assert(proxy.a.b.c === 5);
```
