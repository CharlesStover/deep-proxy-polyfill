export type GetHandler<T> = (obj: T, key: keyof T, root: Object, keys: Array<keyof T>) => any;
export type SetHandler<T> = (obj: T, key: keyof T, value: any, root: Object, keys: Array<keyof T>) => any;

export interface Handler<T> {
  get?: GetHandler<T>;
  set?: SetHandler<T>;
}

const isProxyable = (obj: any): obj is Object =>
  typeof obj === 'object' &&
  obj !== null &&
  (

    // { }
    obj.constructor === Object ||

    // Object.create(null)
    Object.getPrototypeOf(obj) === null
  );

const recursiveDeepProxy = <Shape>(
  target: any,
  handler: Handler<Shape>,
  root: Object,
  keys: Array<keyof Shape>,
) => {

  // If this object can't be proxied, return it as-is.
  if (!isProxyable(target)) {
    return target;
  }

  const getHandler: GetHandler<Shape> | undefined = handler.get;
  const setHandler: SetHandler<Shape> | undefined = handler.set;
  return (Object.keys(target) as Array<keyof Shape>).reduce(
    (accumulator: Object, key: keyof Shape): Object => {

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

export default function deepProxy<Shape>(target: Shape, handler: Handler<Shape> = {}): Shape {
  return recursiveDeepProxy(target, handler, target, []);
};
