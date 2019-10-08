import moment from 'moment';
import CryptoJS from 'crypto-js';
/**
 * 节流函数
 * 短时间内触发多次绑定事件造成性能问题，如 onresize,onscroll等，使用节流函数可确保在指定时间内只触发一次
 * @param {Function} func 方法体
 * @param {Number} wait 延迟时长,ms
 * @param {Boolean} immediate 是否立即执行
 */
export const throttle = (fn, wait = 100, immediate = false) => {
    let timer,
        timeStamp = 0;
    let context, args;

    let run = () => {
        timer = setTimeout(() => {
            if (!immediate) {
                fn.apply(context, args);
            }
            clearTimeout(timer);
            timer = null;
        }, wait);
    };

    return function() {
        context = this;
        args = arguments;
        if (!timer) {
            // console.log('throttle, set');
            if (immediate) {
                fn.apply(context, args);
            }
            run();
        } else {
            // console.log('throttle, ignore');
        }
    };
};

/**
 * 防抖函数
 * 强制一个函数在某个连续时间段内只执行一次，哪怕它本来会被调用多次。
 * @param {Function} func 方法体
 * @param {Number} wait 延迟时长,ms
 * @param {Boolean} immediate 是否立即执行
 */
export const debounce = (fn, wait = 100, immediate = false) => {
    let timer,
        startTimeStamp = 0;
    let context, args;

    let run = (timerInterval) => {
        timer = setTimeout(() => {
            let now = new Date().getTime();
            let interval = now - startTimeStamp;
            if (interval < timerInterval) {
                // the timer start time has been reset，so the interval is less than timerInterval
                // console.log('debounce reset', timerInterval - interval);
                startTimeStamp = now;
                run(timerInterval - interval); // reset timer for left time
            } else {
                if (!immediate) {
                    fn.apply(context, args);
                }
                clearTimeout(timer);
                timer = null;
            }
        }, timerInterval);
    };

    return function() {
        context = this;
        args = arguments;
        let now = new Date().getTime();
        startTimeStamp = now; // set timer start time

        if (!timer) {
            // console.log('debounce set', wait);
            if (immediate) {
                fn.apply(context, args);
            }
            run(wait); // last timer alreay executed, set a new timer
        }
    };
};

/**
 * 判断参数是否为空
 * @param {object} obj 需校验的参数
 */
export const isEmpty = (obj) => {
    if (obj === null || obj === undefined) {
        return true;
    } else if (typeof obj === 'number') {
        return false;
    } else {
        if (obj === '') {
            return true;
        }

        let arr = Array.isArray(obj);
        if (arr && arr.length === 0) {
            return true;
        }

        let keys = Object.keys(obj);
        if (keys && keys.length === 0) {
            return true;
        }
    }
    return false;
};

/**
 * 比较两个对象是否一样
 * @param {object} objectA
 * <对象1>
 * @param {object} objectB
 * <对象2>
 */
export const isEqual = (objectA, objectB) => {
    if (objectA && objectB && typeof objectA == 'object' && typeof objectB == 'object') {
        let i, length, key;

        //数组
        let arrA = Array.isArray(objectA),
            arrB = Array.isArray(objectB);
        if (arrA != arrB) return false;
        if (arrA && arrB) {
            length = objectA.length;
            if (length != objectB.length) return false;
            for (i = length; i-- !== 0; ) if (!isEqual(objectA[i], objectB[i])) return false;
            return true;
        }

        //时间
        let dateA = objectA instanceof Date,
            dateB = objectA instanceof Date;
        if (dateA != dateB) return false;
        if (dateA && dateB) return objectB.getTime() === objectB.getTime();

        //正则
        let regexpA = objectA instanceof RegExp,
            regexpB = objectA instanceof RegExp;
        if (regexpA != regexpB) return false;
        if (regexpA && regexpB) return objectB.toString() === objectB.toString();

        //对象
        let keys = Object.keys(objectA);
        length = keys.length;
        if (length !== Object.keys(objectB).length) return false;

        for (i = length; i-- !== 0; )
            if (!Object.prototype.hasOwnProperty.call(objectB, keys[i])) return false;

        for (i = length; i-- !== 0; ) {
            key = keys[i];
            if (!isEqual(objectA[key], objectB[key])) return false;
        }
        return true;
    }
    //字符串，数字等
    return objectA === objectB;
};

/**
 * 判断入参是否为对象
 * @param {Object} obj 需校验的参数
 */
const isObject = (obj) => {
    // Avoid a V8 JIT bug in Chrome 19-20.
    // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
    var type = typeof obj;
    return type === 'function' || (!!obj && type == 'object');
};

/**
 * 对象深拷贝
 * @param {Object} obj
 */
export const deepClone = (obj) => {
    if (!isObject(obj) || !isObject(obj)) {
        return obj;
    }
    // 判断复制的目标是数组还是对象
    const targetObj = obj.constructor === Array ? [] : {};
    for (let keys in obj) {
        // 遍历目标
        if (obj.hasOwnProperty(keys)) {
            if (obj[keys] && typeof obj[keys] === 'object') {
                // 如果值是对象，就递归一下
                targetObj[keys] = obj[keys].constructor === Array ? [] : {};
                targetObj[keys] = deepClone(obj[keys]);
            } else {
                // 如果不是，就直接赋值
                targetObj[keys] = obj[keys];
            }
        }
    }
    return targetObj;
};

/**
 *
 * @param {Object} target 目标对象
 * @param {Object} source 源对象
 * @param {Boolean} overwrite 是否覆盖
 */
export const merge = (target, source, overwrite = false) => {
    if (!isObject(source) || !isObject(target)) {
        return overwrite ? deepClone(source) : target;
    }
    for (let key in source) {
        if (source.hasOwnProperty(key)) {
            let targetProp = target[key];
            let sourceProp = source[key];

            if (isObject(sourceProp) && isObject(targetProp)) {
                // 如果需要递归覆盖，就递归调用merge
                merge(targetProp, sourceProp, overwrite);
            } else if (overwrite || !(key in target)) {
                // 否则只处理overwrite为true，或者在目标对象中没有此属性的情况
                // NOTE，在 target[key] 不存在的时候也是直接覆盖
                target[key] = deepClone(source[key]);
            }
        }
    }
    return target;
};

/**
 * 对象集合通过字段去重
 * @param {Array} arr 对象集合
 * @param {string} field 参考字段
 */
export const uniqueList = (arr, field) => {
    var map = {};
    var res = [];
    for (var i = 0; i < arr.length; i++) {
        if (!map[arr[i][field]]) {
            map[arr[i][field]] = 1;
            res.push(arr[i]);
        }
    }
    return res;
};

/**
 * 判断单天还是多天，单天返回true，多天返回false
 * @param {Date} dateOne
 * <日期1>
 * @param {Date} dateTwo
 * <日期2>
 */
export const judgeIsToday = (dateOne, dateTwo) => {
    let flagYear = moment(dateOne).isBefore(dateTwo, 'year');
    let flagMonth = moment(dateOne).isBefore(dateTwo, 'month');
    let flagDay = moment(dateOne).isBefore(dateTwo, 'day');
    let flagIsToday;
    if (flagYear) {
        flagIsToday = false;
    } else if (flagMonth) {
        flagIsToday = false;
    } else if (flagDay) {
        flagIsToday = false;
    } else {
        flagIsToday = true;
    }
    return flagIsToday;
};

/**
 * 获取URL参数
 */
export const getRequest = () => {
    let url = location.search;
    let theRequest = new Object();
    if (url.indexOf('?') != -1) {
        let str = url.substr(1);
        let strs = str.split('&');
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split('=')[0]] = unescape(decodeURIComponent(strs[i].split('=')[1]));
        }
    }
    return theRequest;
};
/**
 * 校验对象属性值，为null时转换为undefined，以便ES初始化语法能正常工作
 * @param obj
 */
export const checkObjNullValue = (obj) => {
    for (let key in obj) {
        if (obj[key] == null) {
            obj[key] = undefined;
        }
    }
};

/**
 * 去掉字符串中的字母
 * @param {String} str
 */
export const dislodgeLetter = (str) => str.replace(/[^0-9\.\-]/gi, '');

/**
 * 生成长度为11位的随机字母数字字符串
 */
export const random = () =>
    Math.random()
        .toString(36)
        .substring(2);

/**

/**
 * 去除字符串前面的0
 * @param {String} str
 */
export const dislodgeFontZero = (str) => {
    if (str.startsWith('0.') || str.startsWith('-')) {
        return str;
    }
    return str.replace(/\b(0+)/gi, '');
};

/**
 * 根据单位设置测量值的小数点位数(向下取整，与检测仪器保持一致)
 * @param {测量值} value
 * @param {测量单位} unit
 */
export const decimalsByUnit = (value, unit, type) => {
    let valueRes = null,
        data = null;
    if (unit == 'dB') {
        data = Math.round(parseFloat(value));
        valueRes = type == 'onlyData' ? data : data + unit;
    } else if (unit == 'mV') {
        data = Math.round(parseFloat(value) * 10) / 10;
        valueRes = type == 'onlyData' ? data : data + unit;
    } else {
        data = Math.round(parseFloat(value) * 100) / 100;
        valueRes = type == 'onlyData' ? data : data + unit;
    }
    return valueRes;
};

/**
 * 合并两个数据并去重
 */
export const concatArrays = (arr1, arr2) => {
    var arr = arr1.concat();
    for (var i = 0; i < arr2.length; i++) {
        arr.indexOf(arr2[i]) === -1 ? arr.push(arr2[i]) : 0;
    }
    return arr;
};

/**
 * 判断传入的字符串是否是json格式
 * @param {String} str
 */
export const isJson = (str) => {
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
            if (typeof obj == 'object' && obj) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            console.log(`error：${str}!!!${e}`);
            return false;
        }
    }
    console.log('It is not a string!');
};

/**
 * 判断数组内元素是否全相同
 * @param {Array} array
 */
export const isArrayEqual = (array) => {
    if (array.length > 0) {
        return !array.some((value) => value !== array[0]);
    } else {
        return true;
    }
};

/**
 * 取小数点n两位(直接取后两位，不进行四舍五入);
 * @param {Number} num
 * 传入的数字
 * @param {Number} count
 * 保留的位数 默认取小数点后两位
 */
export const getLastCountDecimal = (num, count = 2) => {
    let newNum = parseInt(num * Math.pow(10, count)) / Math.pow(10, count);
    return newNum;
};

/**
 * 首字母的大小写转换
 * @param {type}
 */
export const initialCase = (type, item) => {
    if (type == 'upper') {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
    } else {
        return item.substring(0, 1).toLowerCase() + item.substring(1);
    }
};

/**参数说明：
 * 根据长度截取先使用字符串，超长部分追加…
 * str 对象字符串
 * len 目标字节长度
 * 返回值： 处理结果字符串
 */
export const cutString = (str, len) => {
    //length属性读出来的汉字长度为1
    if (str.length * 2 <= len) {
        return str;
    }
    var strlen = 0;
    var s = '';
    for (var i = 0; i < str.length; i++) {
        s = s + str.charAt(i);
        if (str.charCodeAt(i) > 128) {
            strlen = strlen + 2;
            if (strlen >= len) {
                // return s.substring(0, s.length - 1) + "...";
                return s.substring(0, s.length - 1);
            }
        } else {
            strlen = strlen + 1;
            if (strlen >= len) {
                // return s.substring(0, s.length - 2) + "...";
                return s.substring(0, s.length - 2);
            }
        }
    }
    return s;
};

/**
 * 验证字符串是中文，英文还是数字
 * 中文返回0，英文返回1，数字返回2
 * @param {param}
 */
export const isChinese = (param) => {
    var regExpChinese = new RegExp('[\u4E00-\u9FA5]+');
    var regExpEnglish = new RegExp('[A-Za-z]+');
    var regExpNum = new RegExp('[0-9]+');
    if (regExpChinese.test(param)) {
        return 0;
    } else if (regExpEnglish.test(param)) {
        return 1;
    } else if (regExpNum.test(param)) {
        return 2;
    }
};

/**
 *将秒转换为可视化的时间
 */
export const formatSeconds = (value, formatMessage, locale) => {
    let secondTime = parseInt(value); // 秒
    let minuteTime = 0; // 分
    let hourTime = 0; // 小时
    if (secondTime > 60) {
        //如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60);
        //获取秒数，秒数取佘，得到整数秒数
        secondTime = parseInt(secondTime % 60);
        //如果分钟大于60，将分钟转换成小时
        if (minuteTime > 60) {
            //获取小时，获取分钟除以60，得到整数小时
            hourTime = parseInt(minuteTime / 60);
            //获取小时后取佘的分，获取分钟除以60取佘的分
            minuteTime = parseInt(minuteTime % 60);
        }
    }
    let result = `${parseInt(secondTime)}${formatMessage(locale.Second)}`;
    if (minuteTime > 0) {
        result = `${parseInt(minuteTime)}${formatMessage(locale.Minute)}${result}`;
    }
    if (hourTime > 0) {
        result = `${parseInt(hourTime)}${formatMessage(locale.Hour)}${result}`;
    }
    return result;
};

export const preventRepeatClick = (func, that, delayTime = 1000) => {
    const { isClick } = that.state;
    if (isClick) {
        that.setState({ isClick: false });
        func();
        setTimeout(() => {
            that.setState({ isClick: true });
        }, delayTime);
    }
};

//将科学计数法转换为小数
export const toNonExponential = (num) => {
    var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
    console.log(m);
    return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
};

/**
 * 字符串转换，一般用于多语言key转换
 * @param {string} type
 * <模块类型>
 * @param {string} key
 * <待转换的值>
 */
export const convertLocalKey = (type, key) => {
    let res = '';
    switch (type) {
        case 'systemLog':
            {
                switch (key) {
                    case 'addMenu':
                        res = 'SystemLogCreateMenu';
                        break;
                    case 'editMenu':
                        res = 'SystemLogModifyMenu';
                        break;
                    case 'deleteMenu':
                        res = 'SystemLogDelMenu';
                        break;
                    case 'addOperation':
                        res = 'SystemLogOperateCreate';
                        break;
                    case 'editOperation':
                        res = 'SystemLogOperateEdit';
                        break;
                    case 'deleteOperation':
                        res = 'SystemLogOperateDel';
                        break;
                    case 'addRecordGroup':
                        res = 'SystemLogDataGroupCreate';
                        break;
                    case 'editRecordGroup':
                        res = 'SystemLogDataGroupEdit';
                        break;
                    case 'deleteRecordGroup':
                        res = 'SystemLogDataGroupDel';
                        break;
                    case 'addUserGroup':
                        res = 'SystemLogUserGroupCreate';
                        break;
                    case 'editUserGroup':
                        res = 'SystemLogUserGroupEdit';
                        break;
                    case 'deleteUserGroup':
                        res = 'SystemLogUserGroupDel';
                        break;
                    case 'addUser':
                        res = 'SystemLogUserCreate';
                        break;
                    case 'editUser':
                        res = 'SystemLogUserEdit';
                        break;
                    case 'deleteUser':
                        res = 'SystemLogUserDel';
                        break;
                    case 'changeUserStatus':
                        res = 'SystemLogUserEditStatus';
                        break;
                    case 'changePassword':
                        res = 'SystemLogUserEditPwd';
                        break;
                    case 'resetPassword':
                        res = 'SystemLogUserEditResetPwd';
                        break;
                    case 'taskCreate':
                        res = 'SystemCreateTask';
                        break;
                    case 'taskStatusChange':
                        res = 'SystemEditTask';
                        break;
                    case 'taskDelete':
                        res = 'SystemDelTask';
                        break;
                    case 'taskUpload':
                        res = 'SystemUploadTask';
                        break;
                    case 'deviceInfoEdit':
                        res = 'SystemModifyDevice';
                        break;
                    case 'taskInfoEdit':
                        res = 'SystemModifyTask';
                        break;
                    case 'countryCreate':
                        res = 'SystemLogCreateCountry';
                        break;
                    case 'countryEdit':
                        res = 'SystemLogEditCountry';
                        break;
                    case 'countryDelete':
                        res = 'SystemLogDelCountry';
                        break;
                    case 'companyCreate':
                        res = 'SystemLogCreateCompany';
                        break;
                    case 'companyEdit':
                        res = 'SystemLogEditCompany';
                        break;
                    case 'companyDelete':
                        res = 'SystemLogDelCompany';
                        break;
                    case 'substationCreate':
                        res = 'SystemLogCreateSubstation';
                        break;
                    case 'substationEdit':
                        res = 'SystemLogEditSubstation';
                        break;
                    case 'substationDelete':
                        res = 'SystemLogDelSubstation';
                        break;
                    case 'bayCreate':
                        res = 'SystemLogCreateBay';
                        break;
                    case 'bayEdit':
                        res = 'SystemLogEditBay';
                        break;
                    case 'bayDelete':
                        res = 'SystemLogDelBay';
                        break;
                    case 'deviceCreate':
                        res = 'SystemLogCreateDevice';
                        break;
                    case 'deviceEdit':
                        res = 'SystemLogEditDevice';
                        break;
                    case 'deviceDelete':
                        res = 'SystemLogDelDevice';
                        break;
                    case 'testPointCreate':
                        res = 'SystemLogCreatePoint';
                        break;
                    case 'testPointEdit':
                        res = 'SystemLogEditPoint';
                        break;
                    case 'testPointDelete':
                        res = 'SystemLogDelPoint';
                        break;
                    case 'Login':
                        res = 'SystemLogLoginInfo';
                        break;

                    default:
                        res = 'Unknown';
                        break;
                }
            }
            break;
        case 'mech':
            {
                switch (key) {
                    case 'switchState':
                        // res = 'MPSwitchStatus';
                        res = 'OperateType';
                        break;
                    case 'aCloseTime':
                        // res = 'ACloseTime';
                        res = 'PhaseA_CloseTime';
                        break;
                    case 'aCloseCoilChargeTime':
                        // res = 'ACloseCoilChargeTime';
                        res = 'PhaseA_Closing_CoilChargeTime';
                        break;
                    case 'aCloseCoilCutoutTime':
                        // res = 'ACloseCoilCutoutTime';
                        res = 'PhaseA_Closing_CoilCutoutTime';
                        break;
                    case 'aCloseMaxCurrent':
                        // res = 'ACloseMaxCurrent';
                        res = 'PhaseA_Closing_MaxCurrent';
                        break;
                    case 'aCloseHitTime':
                        // res = 'ACloseHitTime';
                        res = 'PhaseA_Closing_HitTime';
                        break;
                    case 'aCloseSubswitchCloseTime':
                        // res = 'ACloseSubswitchCloseTime';
                        res = 'PhaseA_Closing_SubswitchCloseTime';
                        break;
                    case 'bCloseTime':
                        // res = 'BCloseTime';
                        res = 'PhaseB_CloseTime';
                        break;
                    case 'bCloseCoilChargeTime':
                        // res = 'BCloseCoilChargeTime';
                        res = 'PhaseB_Closing_CoilChargeTime';
                        break;
                    case 'bCloseCoilCutoutTime':
                        // res = 'BCloseCoilCutoutTime';
                        res = 'PhaseB_Closing_CoilCutoutTime';
                        break;
                    case 'bCloseMaxCurrent':
                        // res = 'BCloseMaxCurrent';
                        res = 'PhaseB_Closing_MaxCurrent';
                        break;
                    case 'bCloseHitTime':
                        // res = 'BCloseHitTime';
                        res = 'PhaseB_Closing_HitTime';
                        break;
                    case 'bCloseSubswitchCloseTime':
                        // res = 'BCloseSubswitchCloseTime';
                        res = 'PhaseB_Closing_SubswitchCloseTime';
                        break;
                    case 'cCloseTime':
                        // res = 'CCloseTime';
                        res = 'PhaseC_CloseTime';
                        break;
                    case 'cCloseCoilChargeTime':
                        // res = 'CCloseCoilChargeTime';
                        res = 'PhaseC_Closing_CoilChargeTime';
                        break;
                    case 'cCloseCoilCutoutTime':
                        // res = 'CCloseCoilCutoutTime';
                        res = 'PhaseC_Closing_CoilCutoutTime';
                        break;
                    case 'cCloseMaxCurrent':
                        // res = 'CCloseMaxCurrent';
                        res = 'PhaseC_Closing_MaxCurrent';
                        break;
                    case 'cCloseHitTime':
                        // res = 'CCloseHitTime';
                        res = 'PhaseC_Closing_HitTime';
                        break;
                    case 'cCloseSubswitchCloseTime':
                        // res = 'CCloseSubswitchCloseTime';
                        res = 'PhaseC_Closing_SubswitchCloseTime';
                        break;
                    case 'closeSync':
                        res = 'CloseSync';
                        break;
                    case 'closeTime':
                        res = 'CloseTime';
                        break;
                    case 'aOpenTime':
                        // res = 'AOpenTime';
                        res = 'PhaseA_OpenTime';
                        break;
                    case 'aOpenCoilChargeTime':
                        // res = 'AOpenCoilChargeTime';
                        res = 'PhaseA_Opening_CoilChargeTime';
                        break;
                    case 'aOpenCoilCutoutTime':
                        // res = 'AOpenCoilCutoutTime';
                        res = 'PhaseA_Opening_CoilCutoutTime';
                        break;
                    case 'aOpenMaxCurrent':
                        // res = 'AOpenMaxCurrent';
                        res = 'PhaseA_Opening_MaxCurrent';
                        break;
                    case 'aOpenHitTime':
                        // res = 'AOpenHitTime';
                        res = 'PhaseA_Opening_HitTime';
                        break;
                    case 'aOpenSubswitchCloseTime':
                        // res = 'AOpenSubswitchCloseTime';
                        res = 'PhaseA_Opening_SubswitchCloseTime';
                        break;
                    case 'bOpenTime':
                        // res = 'BOpenTime';
                        res = 'PhaseB_OpenTime';
                        break;
                    case 'bOpenCoilChargeTime':
                        // res = 'BOpenCoilChargeTime';
                        res = 'PhaseB_Opening_CoilChargeTime';
                        break;
                    case 'bOpenCoilCutoutTime':
                        // res = 'BOpenCoilCutoutTime';
                        res = 'PhaseB_Opening_CoilCutoutTime';
                        break;
                    case 'bOpenMaxCurrent':
                        // res = 'BOpenMaxCurrent';
                        res = 'PhaseB_Opening_MaxCurrent';
                        break;
                    case 'bOpenHitTime':
                        // res = 'BOpenHitTime';
                        res = 'PhaseB_Opening_HitTime';
                        break;
                    case 'bOpenSubswitchCloseTime':
                        // res = 'BOpenSubswitchCloseTime';
                        res = 'PhaseB_Opening_SubswitchCloseTime';
                        break;
                    case 'cOpenTime':
                        // res = 'COpenTime';
                        res = 'PhaseC_OpenTime';
                        break;
                    case 'cOpenCoilChargeTime':
                        // res = 'COpenCoilChargeTime';
                        res = 'PhaseC_Opening_CoilChargeTime';
                        break;
                    case 'cOpenCoilCutoutTime':
                        // res = 'COpenCoilCutoutTime';
                        res = 'PhaseC_Opening_CoilCutoutTime';
                        break;
                    case 'cOpenMaxCurrent':
                        // res = 'COpenMaxCurrent';
                        res = 'PhaseC_Opening_MaxCurrent';
                        break;
                    case 'cOpenHitTime':
                        // res = 'COpenHitTime';
                        res = 'PhaseC_Opening_HitTime';
                        break;
                    case 'cOpenSubswitchCloseTime':
                        // res = 'COpenSubswitchCloseTime';
                        res = 'PhaseC_Opening_SubswitchCloseTime';
                        break;
                    case 'openSync':
                        res = 'OpenSync';
                        break;
                    case 'openTime':
                        res = 'OpenTime';
                        break;
                    case 'aTwiceOpenTime':
                        // res = 'ATwiceOpenTime';
                        res = 'PhaseA_Twice_OpenTime';
                        break;
                    case 'aTwiceOpenCoilChargeTime':
                        // res = 'ATwiceOpenCoilChargeTime';
                        res = 'PhaseA_Twice_Opening_CoilChargeTime';
                        break;
                    case 'aTwiceOpenCoilCutoutTime':
                        // res = 'ATwiceOpenCoilCutoutTime';
                        res = 'PhaseA_Twice_Opening_CoilCutoutTime';
                        break;
                    case 'aTwiceOpenMaxCurrent':
                        // res = 'ATwiceOpenMaxCurrent';
                        res = 'PhaseA_Twice_Opening_MaxCurrent';
                        break;
                    case 'aTwiceOpenHitTime':
                        // res = 'ATwiceOpenHitTime';
                        res = 'PhaseA_Twice_Opening_HitTime';
                        break;
                    case 'aTwiceOpenSubswitchCloseTime':
                        // res = 'ATwiceOpenSubswitchCloseTime';
                        res = 'PhaseA_Twice_Opening_SubswitchCloseTime';
                        break;
                    case 'aSwitchNoCurrentTime':
                        // res = 'ASwitchNoCurrentTime';
                        res = 'PhaseA_SwitchNoCurrentTime';
                        break;
                    case 'aSwitchShotTime':
                        // res = 'ASwitchShotTime';
                        res = 'PhaseA_SwitchShotTime';
                        break;
                    case 'bTwiceOpenTime':
                        // res = 'BTwiceOpenTime';
                        res = 'PhaseB_Twice_OpenTime';
                        break;
                    case 'bTwiceOpenCoilChargeTime':
                        // res = 'BTwiceOpenCoilChargeTime';
                        res = 'PhaseB_Twice_Opening_CoilChargeTime';
                        break;
                    case 'bTwiceOpenCoilCutoutTime':
                        // res = 'BTwiceOpenCoilCutoutTime';
                        res = 'PhaseB_Twice_Opening_CoilCutoutTime';
                        break;
                    case 'bTwiceOpenMaxCurrent':
                        // res = 'BTwiceOpenMaxCurrent';
                        res = 'PhaseB_Twice_Opening_MaxCurrent';
                        break;
                    case 'bTwiceOpenHitTime':
                        // res = 'BTwiceOpenHitTime';
                        res = 'PhaseB_Twice_Opening_HitTime';
                        break;
                    case 'bTwiceOpenSubswitchCloseTime':
                        // res = 'BTwiceOpenSubswitchCloseTime';
                        res = 'PhaseB_Twice_Opening_SubswitchCloseTime';
                        break;
                    case 'bSwitchNoCurrentTime':
                        // res = 'BSwitchNoCurrentTime';
                        res = 'PhaseB_SwitchNoCurrentTime';
                        break;
                    case 'bSwitchShotTime':
                        // res = 'BSwitchShotTime';
                        res = 'PhaseB_SwitchShotTime';
                        break;
                    case 'cTwiceOpenTime':
                        // res = 'CTwiceOpenTime';
                        res = 'PhaseC_Twice_OpenTime';
                        break;
                    case 'cTwiceOpenCoilChargeTime':
                        // res = 'CTwiceOpenCoilChargeTime';
                        res = 'PhaseC_Twice_Opening_CoilChargeTime';
                        break;
                    case 'cTwiceOpenCoilCutoutTime':
                        // res = 'CTwiceOpenCoilCutoutTime';
                        res = 'PhaseC_Twice_Opening_CoilCutoutTime';
                        break;
                    case 'cTwiceOpenMaxCurrent':
                        // res = 'CTwiceOpenMaxCurrent';
                        res = 'PhaseC_Twice_Opening_MaxCurrent';
                        break;
                    case 'cTwiceOpenHitTime':
                        // res = 'CTwiceOpenHitTime';
                        res = 'PhaseC_Twice_Opening_HitTime';
                        break;
                    case 'cTwiceOpenSubswitchCloseTime':
                        // res = 'CTwiceOpenSubswitchCloseTime';
                        res = 'PhaseC_Twice_Opening_SubswitchCloseTime';
                        break;
                    case 'cSwitchNoCurrentTime':
                        // res = 'CSwitchNoCurrentTime';
                        res = 'PhaseC_SwitchNoCurrentTime';
                        break;
                    case 'cSwitchShotTime':
                        // res = 'CSwitchShotTime';
                        res = 'PhaseC_SwitchShotTime';
                        break;
                    case 'twiceOpenSync':
                        // res = 'TwiceOpenSync';
                        res = 'Twice_OpenSync';
                        break;
                    case 'twiceOpenTime':
                        // res = 'TwiceOpenTime';
                        res = 'Twice_OpenTime';
                        break;
                    case 'aMotorMaxCurrent':
                        // res = 'AMotorMaxCurrent';
                        res = 'PhaseA_MotorMaxCurrent';
                        break;
                    case 'aMotorStartCurrent':
                        // res = 'AMotorStartCurrent';
                        res = 'PhaseA_MotorStartCurrent';
                        break;
                    case 'aStorageTime':
                        // res = 'AStorageTime';
                        res = 'PhaseA_StorageTime';
                        break;
                    case 'bMotorMaxCurrent':
                        // res = 'BMotorMaxCurrent';
                        res = 'PhaseB_MotorMaxCurrent';
                        break;
                    case 'bMotorStartCurrent':
                        // res = 'BMotorStartCurrent';
                        res = 'PhaseB_MotorStartCurrent';
                        break;
                    case 'bStorageTime':
                        // res = 'BStorageTime';
                        res = 'PhaseB_StorageTime';
                        break;
                    case 'cMotorMaxCurrent':
                        // res = 'CMotorMaxCurrent';
                        res = 'PhaseC_MotorMaxCurrent';
                        break;
                    case 'cMotorStartCurrent':
                        // res = 'CMotorStartCurrent';
                        res = 'PhaseC_MotorStartCurrent';
                        break;
                    case 'cStorageTime':
                        // res = 'CStorageTime';
                        res = 'PhaseC_StorageTime';
                        break;
                    case 'sampleDate':
                        res = 'SampleDate';
                        break;
                    case 'sampleTime':
                        res = 'SampleTime';
                        break;
                    case 'sensorType':
                        res = 'SensorType';
                        break;
                    case 'switchType':
                        res = 'SwitchType';
                        break;
                    case 'switchFunctionType':
                        res = 'SwitchFunctionType';
                        break;
                    case 'mechDataType':
                        res = 'MechDataType';
                        break;
                }
            }
            break;
        default:
            res = 'Unknown';
            break;
    }
    return res;
};

/**
 * DES加密
 * @param {string} message
 * <待加密信息>
 * @param {string} key
 * <密码> base64处理后的
 */
export const encryptByDES = (message, key) => {
    //base64解密
    key = decodeURI(CryptoJS.enc.Base64.parse(key).toString(CryptoJS.enc.Utf8));
    //des加密
    let keyHex = CryptoJS.enc.Utf8.parse(key);
    let ivHex = CryptoJS.enc.Utf8.parse(key);
    let ciphertext = CryptoJS.enc.Utf8.parse(message);
    let res = CryptoJS.DES.encrypt(ciphertext, keyHex, {
        iv: ivHex,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    }).ciphertext;
    return res.toString().toUpperCase();
};
