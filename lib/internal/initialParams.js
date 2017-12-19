import slice from './slice';
/**
 * 类似于柯里化某一个函数
 */
export default function (fn) {
    return function (/*...args, callback*/) {
        var args = slice(arguments);
        var callback = args.pop();
        fn.call(this, args, callback);
    };
}
