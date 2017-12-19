import isArray from 'lodash/isArray';
import noop from 'lodash/noop';
import once from './internal/once';
import slice from './internal/slice';

import onlyOnce from './internal/onlyOnce';
import wrapAsync from './internal/wrapAsync';

/**
 * Runs the `tasks` array of functions in series, each passing their results to
 * the next in the array. However, if any of the `tasks` pass an error to their
 * own callback, the next function is not executed, and the main `callback` is
 * immediately called with the error.
 *
 * @name waterfall
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Array} tasks - An array of [async functions]{@link AsyncFunction}
 * to run.
 * Each function should complete with any number of `result` values.
 * The `result` values will be passed as arguments, in order, to the next task.
 * @param {Function} [callback] - An optional callback to run once all the
 * functions have completed. This will be passed the results of the last task's
 * callback. Invoked with (err, [results]).
 * @returns undefined
 * @example
 *
 * async.waterfall([
 *     function(callback) {
 *         callback(null, 'one', 'two');
 *     },
 *     function(arg1, arg2, callback) {
 *         // arg1 now equals 'one' and arg2 now equals 'two'
 *         callback(null, 'three');
 *     },
 *     function(arg1, callback) {
 *         // arg1 now equals 'three'
 *         callback(null, 'done');
 *     }
 * ], function (err, result) {
 *     // result now equals 'done'
 * });
 *
 * // Or, with named functions:
 * async.waterfall([
 *     myFirstFunction,
 *     mySecondFunction,
 *     myLastFunction,
 * ], function (err, result) {
 *     // result now equals 'done'
 * });
 * function myFirstFunction(callback) {
 *     callback(null, 'one', 'two');
 * }
 * function mySecondFunction(arg1, arg2, callback) {
 *     // arg1 now equals 'one' and arg2 now equals 'two'
 *     callback(null, 'three');
 * }
 * function myLastFunction(arg1, callback) {
 *     // arg1 now equals 'three'
 *     callback(null, 'done');
 * }
 */
export default  function(tasks, callback) {
    callback = once(callback || noop);
    if (!isArray(tasks)) return callback(new Error('First argument to waterfall must be an array of functions'));
    if (!tasks.length) return callback();
    var taskIndex = 0;
    function nextTask(args) {
        var task = wrapAsync(tasks[taskIndex++]);
        //(1)首先将我们的task调用asyncify，asyncify后的函数能够接受(...args, callback)参数
        args.push(onlyOnce(next));
        // (3)onlyOnce方法返回一个函数，这个函数只能被调用一次。这个函数会被放到本次nextTask的最后一个元素
        task.apply(null, args);
        //(4)第一个回调函数被传入的只有callback,而第二个
    }
    /**
     *(2)这个next方法就是asyncify处理传入的回调函数，该回调函数的第一个参数是error,可以参见asyncify的代码
     *   而slice(arguments, 1)就是将上一个回调函数的执行结果传递给下一个函数
     */
    function next(err/*, ...args*/) {
        if (err || taskIndex === tasks.length) {
            return callback.apply(null, arguments);
        }
        nextTask(slice(arguments, 1));
    }
    nextTask([]);
}
