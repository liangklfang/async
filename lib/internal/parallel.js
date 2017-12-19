import noop from 'lodash/noop';
import isArrayLike from 'lodash/isArrayLike';
import slice from './slice';
import wrapAsync from './wrapAsync';
//(1)调用方式如下
// export default function series(tasks, callback) {
//     parallel(eachOfSeries, tasks, callback);
// }
// * async.series({
 // *     one: function(callback) {
 // *         setTimeout(function() {
 // *             callback(null, 1);
 // *         }, 200);
 // *     },
 // *     two: function(callback){
 // *         setTimeout(function() {
 // *             callback(null, 2);
 // *         }, 100);
 // *     }
 // * }, function(err, results) {
 // *     // results is now equal to: {one: 1, two: 2}
 // * });
export default function _parallel(eachfn, tasks, callback) {
    callback = callback || noop;
    var results = isArrayLike(tasks) ? [] : {};
    eachfn(tasks, function (task, key, callback) {
        //(1)asyncify后的函数接受一个回调函数，其接受的参数为(...args,callback)
        wrapAsync(task)(function (err, result) {
            // (3)这里的result是每一次执行函数后传入的结果
            if (arguments.length > 2) {
                result = slice(arguments, 1);
            }
            //(2)这里的key是one或者two
            results[key] = result;
            callback(err);
        });
    }, function (err) {
        callback(err, results);
    });
}
