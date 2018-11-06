interface AnyObject {
    [key: string]: any;
}
export declare type GetHandler = (obj: Object, key: string, root: Object, keys: string[]) => any;
export declare type SetHandler = (obj: Object, key: string, value: any, root: Object, keys: string[]) => any;
export interface Handler {
    get?: GetHandler;
    set?: SetHandler;
}
export default function deepProxy<Shape extends AnyObject>(target: Shape, handler?: Handler): Shape;
export {};
