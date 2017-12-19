import asyncify from '../asyncify';
var supportsSymbol = typeof Symbol === 'function';
//1.是否支持Symbol，以及如何判断一个函数是否是Async函数
function isAsync(fn) {
    return supportsSymbol && fn[Symbol.toStringTag] === 'AsyncFunction';
}
//2.对Async函数进行处理,其他函数绕过
function wrapAsync(asyncFn) {
    return isAsync(asyncFn) ? asyncify(asyncFn) : asyncFn;
}
export default wrapAsync;
export { isAsync };
