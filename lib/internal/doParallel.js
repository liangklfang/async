import eachOf from '../eachOf';
import wrapAsync from './wrapAsync';
// * async.every(['file1','file2','file3'], function(filePath, callback) {
//  *     fs.access(filePath, function(err) {
//  *         callback(null, !err)
//  *     });
//  * }, function(err, result) {
//  *     // if result is true then every file exists
//  * });
export default function doParallel(fn) {
    return function (obj, iteratee, callback) {
        return fn(eachOf, obj, wrapAsync(iteratee), callback);
    };
}
