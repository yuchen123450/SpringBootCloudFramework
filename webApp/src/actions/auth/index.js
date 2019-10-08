import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_CHECK_TOKEN } from '../types';
import {
    POST_AUTH_CHECK_TOKEN,
    POST_AUTH_GET_TOKEN,
    POST_SYSTEM_USER_GROUP_USERMENU,
} from '../../constants/service';
import { CONFIG } from '../../configs';
import { LOCALSTORAGE } from '../../constants/common';
import { message } from '../../components/message';
import { locale, formatMessage } from '../../pages/locale';
import { storage } from '../../utils/storage';
import { throttle, isEmpty } from '../../utils/common';
import ajax from '../../utils/ajax';
import ws from '../../utils/websocket';

/**
 * 校验认证信息，判断token是否有效
 * @param {string} token
 * <认证信息> 此参数需添加在请求头(Http Header)中
 */
const checkToken = (token = '') => {
    token = token || storage.get(LOCALSTORAGE.token);
    const result = async (dispatch) => {
        let accredit = false;
        let userid = -1;
        //存在authId，向服务端请求数据，判断权限
        if (token) {
            let res = await ajax.token(
                POST_AUTH_CHECK_TOKEN,
                {},
                {
                    token: token,
                }
            );
            if (res) {
                let { code } = res;
                accredit = code === 10000;
                userid = res.result;
            }
        }
        if (accredit) {
            //使用token，服务端会出现推送不到用户情况
            ws.connect(`AuthorityChanged/${userid}`, ({ body }) => {
                if (body) {
                    let result = JSON.parse(body);
                    let title = formatMessage(locale.PermissionReminder);
                    let content = formatMessage(locale[`ErrCode${result.code}`]);
                    message('reload', title, content);
                }
            });
            window.onmousemove = throttle(() => {
                let token = storage.get(LOCALSTORAGE.token);
                if (isEmpty(token) === false) {
                    storage.set(LOCALSTORAGE.token, token, 30);
                } else {
                    let title = formatMessage(locale.PermissionReminder);
                    let content = formatMessage(locale['ErrCode10001']);
                    message('relogin', title, content);
                    window.onmousemove = null;
                }
            }, 1000);
        } else {
            storage.remove(LOCALSTORAGE.token);
        }
        return dispatch({
            type: AUTH_CHECK_TOKEN,
            accredit: accredit,
        });
    };

    return result;
};

/**
 *
 * @param {string} userName
 * <用户名> 用户名长度为2-64个字符，支持中英文、数字、减号或下划线
 * @param {string} password
 * <密码> 此参数需添加在请求头(Http Header)中，其值需要将明文密码进行DES加密
 * @param {boolean} remember
 * <是否记住我> 是否需要将用户名长期保存在localstroge中
 */
const login = (userName = '', password = '', remember = true) => {
    const result = async (dispatch) => {
        let success = false;
        let res = await ajax.token(
            POST_AUTH_GET_TOKEN,
            {
                userName: userName,
                clientType: CONFIG.server.clientType,
            },
            {
                password: password,
            }
        );

        if (res) {
            let { code, result } = res;
            success = code === 10000;
            if (success) {
                if (remember) {
                    storage.set(LOCALSTORAGE.userName, userName);
                } else {
                    storage.remove(LOCALSTORAGE.userName);
                }
                storage.set(LOCALSTORAGE.token, result.token, 30);
                dispatch({
                    type: AUTH_CHECK_TOKEN,
                    accredit: true,
                });
                let getUserMenus = await ajax.post(POST_SYSTEM_USER_GROUP_USERMENU);
                if (getUserMenus && getUserMenus.result) {
                    let have = getUserMenus.result.some((item) => item.key === 'dashboard');
                    storage.set(LOCALSTORAGE.targetPage, have ? '/statistics.html' : '/home.html');
                }
            }
        }
        return dispatch({
            type: AUTH_LOGIN,
            success,
        });
    };
    return result;
};

/**
 * 登出，移除localstroge中的token
 */
const logout = () => {
    const result = async (dispatch) => {
        storage.remove(LOCALSTORAGE.token);
        return dispatch({
            type: AUTH_LOGOUT,
            success: true,
        });
    };
    return result;
};

export default { login, logout, checkToken };
