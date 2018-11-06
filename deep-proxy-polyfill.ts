interface AnyObject {
  [key: string]: any;
};

export type GetHandler = (obj: Object, key: string, root: Object, keys: string[]) => any;
export type SetHandler = (obj: Object, key: string, value: any, root: Object, keys: string[]) => any;

export interface Handler {
  get?: GetHandler;
  set?: SetHandler;
}

const isProxyable = (obj: Object): boolean =>
  typeof obj === 'object' &&
  obj !== null &&
  (

    // { }
    obj.constructor === Object ||

    // Object.create(null)
    Object.getPrototypeOf(obj) === null
  );

const recursiveDeepProxy = <Shape extends AnyObject>(
  target: Shape,
  handler: Handler,
  root: Object,
  keys: string[]
) => {

  // If this object can't be proxied, return it as-is.
  if (!isProxyable(target)) {
    return target;
  }

  const getHandler: GetHandler | undefined = handler.get;
  const setHandler: SetHandler | undefined = handler.set;
  return Object.keys(target).reduce(
    (accumulator: Object, key: string): Object => {

      const attributes: PropertyDescriptor & ThisType<any> = {
        configurable: false,
        enumerable: true
      };

      // Custom getter
      if (getHandler) {
        attributes.get = (): any => {
          return recursiveDeepProxy(
            getHandler(target, key, root, keys),
            handler, root, keys.concat(key)
          );
        };
      }

      // Default getter
      else {
        attributes.get = (): any => {
          return recursiveDeepProxy(
            target[key],
            handler, root, keys.concat(key)
          );
        };
      }

      // Custom setter
      if (setHandler) {
        attributes.set = (value: any): void => {
          setHandler(target, key, value, root, keys);
        };
      }

      // Default setter
      else {
        attributes.set = (value: any): void => {
          target[key] = value;
        };
      }

      Object.defineProperty(accumulator, key, attributes);
      return accumulator;
    },

    // If the original Object has no prototype, neither should this one.
    Object.getPrototypeOf(target) === null ?
      Object.create(null) :
      {}
  );
};

export default function deepProxy<Shape extends AnyObject>(target: Shape, handler: Handler = {}): Shape {
  return recursiveDeepProxy(target, handler, target, []);
};
