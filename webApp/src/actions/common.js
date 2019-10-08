import {
    COMMON_CHANGE_LANGUAGE,
    COMMON_JUDGVE_MOBILE,
    COMMON_DESTROY_TRENDVALUE_LIST,
    COMMON_DESTROY_TRENDSMULTI_TESTPOINTS,
    COMMON_DESTROY_POINTDATADETAILS,
    CONTROL_COMMAND_SUCCESS,
    COMMAND_SUBMIT,
} from './types';
import { GET_LANG_CONTENT, POST_CONTROL_COMMAND } from '../constants/service';
import { storage } from '../utils/storage';
import { LOCALSTORAGE } from '../constants/common';
import ajax from '../utils/ajax';

/**
 * 国际化,切换语言类型
 * @param {string} langType
 * <语言类型>
 */
const changLang = (langType) => {
    const result = async (dispatch) => {
        let res = await ajax.get(`${GET_LANG_CONTENT}/${langType}.json`, {});
        if (res) {
            storage.set(LOCALSTORAGE.langContent, res);
        }
        return dispatch({
            type: COMMON_CHANGE_LANGUAGE,
            langType: langType,
            langContent: res,
        });
    };
    return result;
};

/**
 * 判断页面模式
 * @param {bool} isMobile
 * <是否是手机模式> ture:手机；false：桌面
 */
const judgeMobile = (isMobile) => ({
    type: COMMON_JUDGVE_MOBILE,
    data: isMobile,
});

const clearDataOnClose = (key) => {
    let type;
    switch (key) {
        case 'destoryTrendValueList':
            type = COMMON_DESTROY_TRENDVALUE_LIST;
            break;
        case 'destoryTrendsMultiTestPoints':
            type = COMMON_DESTROY_TRENDSMULTI_TESTPOINTS;
            break;
        case 'destoryPointDataDetail':
            type = COMMON_DESTROY_POINTDATADETAILS;
            break;
        default:
            break;
    }
    return {
        type: type,
        data: '',
    };
};

/**
 * 控制命令下发
 */
const controlCommand = (commond) => {
    const result = async (dispatch) => {
        let res = await ajax.post(POST_CONTROL_COMMAND, {
            cmdlist: commond,
        });
        let { code = 0 } = res;
        return dispatch({
            type: CONTROL_COMMAND_SUCCESS,
            success: code === 10000,
        });
    };
    return result;
};

/**
 * 根据key修改value
 * @param {要更新的内容} key
 * @param {更新的值} value
 */
const upadateValueByKey = (key, value) => {
    let type = '';
    switch (key) {
        case 'command_submit':
            type = COMMAND_SUBMIT;
            break;
        default:
            break;
    }
    return {
        type: type,
        data: value,
    };
};

export default { changLang, judgeMobile, clearDataOnClose, controlCommand, upadateValueByKey };
