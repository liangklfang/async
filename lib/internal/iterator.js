import isArrayLike from 'lodash/isArrayLike';
import getIterator from './getIterator';
import keys from 'lodash/keys';
function createArrayIterator(coll) {
    var i = -1;
    var len = coll.length;
    return function next() {
        return ++i < len ? {value: coll[i], key: i} : null;
    }
}
// 这里类似于Generator的迭代器，其key是通过循环下标来得到的
function createES2015Iterator(iterator) {
    var i = -1;
    return function next() {
        var item = iterator.next();
        if (item.done)
            return null;
        i++;
        return {value: item.value, key: i};
    }
}
//object是没有默认的迭代器行为的，他的key就是通过Object.keys来获取
function createObjectIterator(obj) {
    var okeys = keys(obj);
    var i = -1;
    var len = okeys.length;
    return function next() {
        var key = okeys[++i];
        return i < len ? {value: obj[key], key: key} : null;
    };
}
export default function iterator(coll) {
    // 数组的迭代器
    if (isArrayLike(coll)) {
        return createArrayIterator(coll);
    }
    var iterator = getIterator(coll);
    return iterator ? createES2015Iterator(iterator) : createObjectIterator(coll);
}
