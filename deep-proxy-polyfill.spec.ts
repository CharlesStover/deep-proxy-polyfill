import { expect } from 'chai';
import deepProxy from './deep-proxy-polyfill';

interface AnyObject {
  [key: string]: any;
}

describe('deep-proxy-polyfill', () => {
  it('should return a new object', () => {
    const obj = {};
    expect(obj).to.equal(obj);
    expect(deepProxy(obj)).not.to.equal(obj);
  });

  it('should subscribe to get', () => {
    let subscribed: null | string = null;
    const getSpy = (obj: AnyObject, key: string) => {
      subscribed = key;
      return obj[key];
    };
    expect(subscribed).to.equal(null);
    const test: AnyObject = { a: 1, b: 2 };
    deepProxy(test, getSpy).a;
    expect(subscribed).to.equal('a');
    expect(subscribed).not.to.equal('b');
  });

  it('should subscribe to set', () => {
    let subscribed: null | string = null;
    const setSpy = (obj: AnyObject, key: string, value: any) => {
      subscribed = key;
      obj[key] = value;
    };
    expect(subscribed).to.equal(null);
    const test: AnyObject = { a: 1, b: 2 };
    deepProxy(test, null, setSpy).a = null;
    expect(subscribed).to.equal('a');
    expect(subscribed).not.to.equal('b');
  });

  it('should deep subscribe to get', () => {
    let subscribed: null | string[] = null;
    const getSpy = (obj: AnyObject, key: string, _: AnyObject, keys: string[]) => {
      subscribed = keys.concat(key);
      return obj[key];
    };
    const test: AnyObject = {
      a: {
        b: {
          c: 1
        }
      }
    };
    expect(subscribed).to.equal(null);
    deepProxy(test, getSpy).a.b.c;
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
    let subscribed: null | string[] = null;
    const getSpy = (obj: AnyObject, key: string) => {
      return obj[key];
    };
    const setSpy = (obj: AnyObject, key: string, value: any, _: AnyObject, keys: string[]) => {
      subscribed = keys.concat(key);
      obj[key] = value;
    };
    const test: AnyObject = {
      a: {
        b: {
          c: 1
        }
      }
    };
    expect(subscribed).to.equal(null);
    deepProxy(test, getSpy, setSpy).a.b.c = 'str';
    expect(subscribed).not.to.equal(null);
    expect(subscribed).to.be.an('array');
    expect(subscribed).to.have.lengthOf(3);
    if (subscribed) {
      expect(subscribed[0]).to.equal('a');
      expect(subscribed[1]).to.equal('b');
      expect(subscribed[2]).to.equal('c');
    }
    expect(test.a.b.c).not.to.equal(1);
    expect(test.a.b.c).to.equal('str');
  });
});
