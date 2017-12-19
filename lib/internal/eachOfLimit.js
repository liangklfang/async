import noop from 'lodash/noop';
import once from './once';
import iterator from './iterator';
import onlyOnce from './onlyOnce';
import breakLoop from './breakLoop';
export default function _eachOfLimit(limit) {
    return function (obj, iteratee, callback) {
        callback = once(callback || noop);
        if (limit <= 0 || !obj) {
            return callback(null);
        }
        var nextElem = iterator(obj);
        //1.获取传入的参数的迭代器对象
        var done = false;
        var running = 0;
        function iterateeCallback(err, value) {
            running -= 1;
            if (err) {
                done = true;
                callback(err);
            }
            else if (value === breakLoop || (done && running <= 0)) {
                done = true;
                return callback(null);
            }
            else {
                //5.如果没有结束那么继续执行replenish方法
                replenish();
            }
        }
        function replenish () {
            //4.如果小于并发的limit数量，同时程序没有结束，那么一直运行
            while (running < limit && !done) {
                var elem = nextElem();
                // 2.相当于直接调用next方法，但是只有在没有运行的代码的时候才会调用callback
                if (elem === null) {
                    done = true;
                    if (running <= 0) {
                        callback(null);
                    }
                    return;
                }
                running += 1;
                //3.传入的方法为value,key和回调函数
                iteratee(elem.value, elem.key, onlyOnce(iterateeCallback));
            }
        }
        //4.继续执行代码
        replenish();
    };
}
