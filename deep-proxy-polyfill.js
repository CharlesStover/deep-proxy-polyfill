"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isSpyable = function (obj) {
    return typeof obj === 'object' &&
        obj !== null &&
        (obj.constructor === Object ||
            Object.getPrototypeOf(obj) === null);
};
var recursiveSpyOn = function (obj, getSpy, setSpy, root, keys) {
    return Object.keys(obj).reduce(function (accumulator, key) {
        var attributes = {
            configurable: false,
            enumerable: true
        };
        if (getSpy) {
            attributes.get = function () {
                var get = getSpy(obj, key, root, keys);
                if (isSpyable(get)) {
                    return recursiveSpyOn(get, getSpy, setSpy, root, keys.concat(key));
                }
                return get;
            };
        }
        if (setSpy) {
            attributes.set = function (v) {
                setSpy(obj, key, v, root, keys);
            };
        }
        Object.defineProperty(accumulator, key, attributes);
        return accumulator;
    }, Object.getPrototypeOf(obj) === null ?
        Object.create(null) :
        {});
};
function spyOn(obj, getSpy, setSpy) {
    if (getSpy === void 0) { getSpy = null; }
    if (setSpy === void 0) { setSpy = null; }
    return recursiveSpyOn(obj, getSpy, setSpy, obj, []);
}
exports.default = spyOn;
;
