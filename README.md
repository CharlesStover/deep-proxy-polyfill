# Deep Proxy Polyfill [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Deeply%20nest%20JavaScript%20Proxy's%20get%20and%20set%20property%20listeners,%20even%20in%20browsers%20that%20don't%20support%20Proxies!&url=https://github.com/CharlesStover/deep-proxy-polyfill&via=CharlesStover&hashtags=javascript,typescript,webdev,webdevelopment)

Acts as a deep or recursive Proxy for getter and setter attributes on an object.

[![version](https://img.shields.io/npm/v/deep-proxy-polyfill.svg)](https://www.npmjs.com/package/deep-proxy-polyfill/)
[![minified size](https://img.shields.io/bundlephobia/min/deep-proxy-polyfill.svg)](https://www.npmjs.com/package/deep-proxy-polyfill)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/deep-proxy-polyfill.svg)](https://www.npmjs.com/package/deep-proxy-polyfill)
[![downloads](https://img.shields.io/npm/dt/deep-proxy-polyfill.svg)](https://www.npmjs.com/package/deep-proxy-polyfill)
[![build](https://travis-ci.com/CharlesStover/deep-proxy-polyfill.svg)](https://travis-ci.com/CharlesStover/deep-proxy-polyfill/)

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
