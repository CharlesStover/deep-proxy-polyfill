"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
var isProxyable = function (obj) {
    return typeof obj === 'object' &&
        obj !== null &&
        (obj.constructor === Object ||
            Object.getPrototypeOf(obj) === null);
};
var recursiveDeepProxy = function (target, handler, root, keys) {
    if (!isProxyable(target)) {
        return target;
    }
    var getHandler = handler.get;
    var setHandler = handler.set;
    return Object.keys(target).reduce(function (accumulator, key) {
        var attributes = {
            configurable: false,
            enumerable: true
        };
        if (getHandler) {
            attributes.get = function () {
                return recursiveDeepProxy(getHandler(target, key, root, keys), handler, root, keys.concat(key));
            };
        }
        else {
            attributes.get = function () {
                return recursiveDeepProxy(target[key], handler, root, keys.concat(key));
            };
        }
        if (setHandler) {
            attributes.set = function (value) {
                setHandler(target, key, value, root, keys);
            };
        }
        else {
            attributes.set = function (value) {
                target[key] = value;
            };
        }
        Object.defineProperty(accumulator, key, attributes);
        return accumulator;
    }, Object.getPrototypeOf(target) === null ?
        Object.create(null) :
        {});
};
function deepProxy(target, handler) {
    if (handler === void 0) { handler = {}; }
    return recursiveDeepProxy(target, handler, target, []);
}
exports.default = deepProxy;
;
