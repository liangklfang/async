/**
 * 调用方式: doLimit(eachOfLimit, 1);
 */
export default function doLimit(fn, limit) {
    return function (iterable, iteratee, callback) {
        return fn(iterable, limit, iteratee, callback);
    };
}
