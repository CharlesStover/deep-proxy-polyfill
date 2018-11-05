# Deep Proxy Polyfill

Acts as a _recursive_ Proxy for getter and setter attributes on an object.

## Install

* `npm install deep-proxy-polyfill --save` or
* `yarn add deep-proxy-polyfill`

## Getter

```JavaScript
import spyOn from 'deep-proxy-polyfill';

const rootObject = {
  a: {
    b: {
      c: 1
    }
  }
};

const getSpy = (obj, key, root, keys) => {
  assert(root === rootObject);

  // [ 'a', 'b' ]
  if (keys.length == 2) {
    assert(obj === rootObject.a.b);
    asset(key === 'c');
    return obj[key] + 2;
  }

  return obj[key];
};

const spyObject = spyOn(rootObject, getSpy);

// Getter returns an additional 2.
console.log(spyObject.a.b.c);
```

## Setter

```JavaScript
import spyOn from 'deep-proxy-polyfill';

const rootObject = {
  a: {
    b: {
      c: 1
    }
  }
};

// Enable getters.
const getSpy = (obj, key) => {
  return obj[key];
};

const setSpy = (obj, key, value, root, keys) => {
  assert(root === rootObject);
  obj[key] = value + 2;
};

const spyObject = spyOn(rootObject, getSpy, setSpy);

// Setter adds 2.
spyObject.a.b.c = 3;

assert(spyObject.a.b.c === 5);

```
