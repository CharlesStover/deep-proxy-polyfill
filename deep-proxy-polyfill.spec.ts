import { expect } from 'chai';
import deepProxy from './deep-proxy-polyfill';

interface TestObject {
  a?: number | TestObject;
  b?: number | TestObject;
  c?: number | TestObject;
}

describe('deep-proxy-polyfill', () => {
  it('should return a new object', () => {
    const obj = {};
    expect(obj).to.equal(obj);
    expect(deepProxy(obj)).not.to.equal(obj);
  });

  it('should subscribe to get', () => {
    let subscribed: null | keyof TestObject = null;
    const get = (obj: TestObject, key: keyof TestObject) => {
      subscribed = key;
      return obj[key];
    };
    expect(subscribed).to.equal(null);
    const test: TestObject = { a: 1, b: 2 };
    deepProxy<TestObject>(test, { get }).a;
    expect(subscribed).to.equal('a');
    expect(subscribed).not.to.equal('b');
  });

  it('should subscribe to set', () => {
    let subscribed: null | keyof TestObject= null;
    const set = (obj: TestObject, key: keyof TestObject, value: any) => {
      subscribed = key;
      obj[key] = value;
    };
    expect(subscribed).to.equal(null);
    const test: TestObject = { a: 1, b: 2 };
    deepProxy(test, { set }).a = 2;
    expect(subscribed).to.equal('a');
    expect(subscribed).not.to.equal('b');
  });

  it('should deep subscribe to get', () => {
    let subscribed: null | Array<keyof TestObject> = null;
    const get = (obj: TestObject, key: keyof TestObject, _: TestObject, keys: Array<keyof TestObject>) => {
      subscribed = keys.concat(key);
      return obj[key];
    };
    const test: TestObject = {
      a: {
        b: {
          c: 1,
        },
      },
    };
    expect(subscribed).to.equal(null);
    // @ts-ignore: "a might be a number"
    deepProxy(test, { get }).a.b.c;
    expect(subscribed).not.to.equal(null);
    expect(subscribed).to.be.an('array');
    expect(subscribed).to.have.lengthOf(3);
    if (subscribed) {
      expect(subscribed[0]).to.equal('a');
      expect(subscribed[1]).to.equal('b');
      expect(subscribed[2]).to.equal('c');
    }
  });

  it('should deep subscribe to set', () => {
    let subscribed: null | Array<keyof TestObject> = null;
    const set = (obj: TestObject, key: keyof TestObject, value: any, _: TestObject, keys: Array<keyof TestObject>) => {
      subscribed = keys.concat(key);
      obj[key] = value;
    };
    const test: TestObject = {
      a: {
        b: {
          c: 1,
        },
      },
    };
    expect(subscribed).to.equal(null);
    // @ts-ignore: "a might be a number"
    deepProxy(test, { set }).a.b.c = 'str';
    expect(subscribed).not.to.equal(null);
    expect(subscribed).to.be.an('array');
    expect(subscribed).to.have.lengthOf(3);
    if (subscribed) {
      expect(subscribed[0]).to.equal('a');
      expect(subscribed[1]).to.equal('b');
      expect(subscribed[2]).to.equal('c');
    }
    // @ts-ignore: "a might be a number"
    expect(test.a.b.c).not.to.equal(1);
    // @ts-ignore: "a might be a number"
    expect(test.a.b.c).to.equal('str');
  });
});
