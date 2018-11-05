export type GetSpy = (obj: Object, key: string, root: Object, keys: string[]) => any;
export type SetSpy = (obj: Object, key: string, value: any, root: Object, keys: string[]) => any;

const isSpyable = (obj: Object): boolean =>
  typeof obj === 'object' &&
  obj !== null &&
  (

    // { }
    obj.constructor === Object ||

    // Object.create(null)
    Object.getPrototypeOf(obj) === null
  );

const recursiveSpyOn = <Shape extends {}>(
  obj: Shape,
  getSpy: GetSpy | null,
  setSpy: SetSpy | null,
  root: Object,
  keys: string[]
) => {
  return Object.keys(obj).reduce(
    (accumulator: Object, key: string): Object => {

      const attributes: PropertyDescriptor & ThisType<any> = {
        configurable: false,
        enumerable: true
      };

      if (getSpy) {
        attributes.get = (): any => {
          const get = getSpy(obj, key, root, keys);
          if (isSpyable(get)) {
            return recursiveSpyOn(get, getSpy, setSpy, root, keys.concat(key));
          }
          return get;
        };
      }

      if (setSpy) {
        attributes.set = (v: any): void => {
          setSpy(obj, key, v, root, keys);
        };
      }

      Object.defineProperty(accumulator, key, attributes);
      return accumulator;
    },

    // If the original Object has no prototype, neither should this one.
    Object.getPrototypeOf(obj) === null ?
      Object.create(null) :
      {}
  );
};

export default function spyOn<Shape extends {}>(
  obj: Shape,
  getSpy: GetSpy | null = null,
  setSpy: SetSpy | null = null
): Shape {
  return recursiveSpyOn(obj, getSpy, setSpy, obj, []);
};
