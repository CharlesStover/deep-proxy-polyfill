export declare type GetSpy = (obj: Object, key: string, root: Object, keys: string[]) => any;
export declare type SetSpy = (obj: Object, key: string, value: any, root: Object, keys: string[]) => any;
export default function spyOn<Shape extends {}>(obj: Shape, getSpy?: GetSpy | null, setSpy?: SetSpy | null): Shape;
