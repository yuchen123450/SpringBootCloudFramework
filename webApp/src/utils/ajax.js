import axios from 'axios';
import Qs from 'qs';
import CryptoJS from 'crypto-js';
import { CONFIG } from '../configs';
import { storage } from './storage';
import { LOCALSTORAGE } from '../constants/common';
import { toast } from '../components/toast';
import { message } from '../components/message';
import { locale, formatMessage } from '../pages/locale';

/** 获取http header
 *
 */
const getHeaders = () => {
    let timeStamp = Math.round(new Date().getTime() / 1000);
    let langtype = storage.get(LOCALSTORAGE.langType);
    let token = storage.get(LOCALSTORAGE.token);
    let header = {
        v: CONFIG.server.apiVersion,
        clientType: CONFIG.server.clientType,
        clientSN: 'web',
        clientVersion: CONFIG.website.version,
        lang: langtype,
        timestamp: timeStamp,
        sign: '',
        token: token,
        operationCode: window.operationCode || CONFIG.server.operationCode,
    };
    window.operationCode = CONFIG.server.operationCode;
    return header;
};

/**
 * DES加密
 * @param {string} message
 * <待加密信息>
 * @param {string} key
 * <密码> base64处理后的
 */
const encryptByDES = (message, key) => {
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

/**
 * HTTP 入参加密
 * @param {需要加密的数据} data
 */
const parameterEncryption = (data) => {
    if (CONFIG.server.aes.verification) {
        let key = CONFIG.server.aes.key;
        // console.log('密钥：', key);
        key = CryptoJS.enc.Hex.parse(key);
        let iv = CryptoJS.enc.Hex.parse(CONFIG.server.aes.iv);
        let src = data;
        // console.log('原字符串：', src);
        let enc = CryptoJS.AES.encrypt(src, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        //console.log('加密:',enc.toString());
        let enced = enc.ciphertext.toString();
        // console.log('加密：', enced);
        return enced;
    } else {
        return data;
    }
};

/**
 * 接口返回参数解密
 * @param {服务端接口返回数据} response
 */
const responseDecryption = (response) => {
    if (CONFIG.server.aes.verification) {
        let key = CONFIG.server.aes.key;
        key = CryptoJS.enc.Hex.parse(key);
        let iv = CryptoJS.enc.Hex.parse(CONFIG.server.aes.iv);
        let dec = CryptoJS.AES.decrypt(CryptoJS.format.Hex.parse(response.data), key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        let data = CryptoJS.enc.Utf8.stringify(dec);
        data = JSON.parse(data);
        // console.log('解密:', data);
        return data;
    } else {
        return response;
    }
};

/**
 * 处理服务端返回信息
 * @param {object} data
 * <数据详情> 服务端返回的数据
 */
const httpException = (data) => {
    let exception = '';
    let { code, msg, result } = data;
    try {
        //ErrCode统一格式并入国际化文件 ErrCodexxxxxxxx  liyaoxu-2018/12/30
        exception = formatMessage(locale[`ErrCode${code}`], data);
        if (exception == undefined || exception == '') {
            exception = formatMessage(locale[msg], result);
        }
    } catch (d) {
        exception = JSON.stringify(data);
    } finally {
        switch (code) {
            case 401:
            case 10001:
                message('relogin', formatMessage(locale.PermissionReminder), exception);
                break;
            case 403:
            case 10010:
            case 10011:
                message('none', formatMessage(locale.PermissionReminder), exception);
                break;
            default:
                toast('error', exception);
                break;
        }
    }
};

/**
 * 用于登陆和校验Token
 * @param {string} url
 * <服务地址>
 * @param {object} params
 * <请求参数>
 * @param {object} header
 * <request.header参数>
 */
const token = async (url, params = {}, header = {}) => {
    if (params.userName) {
        params.userName = encryptByDES(params.userName, CONFIG.server.key);
    }
    const result = await axios
        .create({
            timeout: CONFIG.server.timeout,
            headers: {
                authorization: header.password
                    ? encryptByDES(header.password, CONFIG.server.key)
                    : '',
                token: header.token ? header.token : '',
            },
        })
        .post(url, params)
        .then(function(response) {
            if (response.status >= 200 && response.status < 300) {
                let { code, result } = response.data;
                response.data.result = result === null ? {} : result;
                if (code === 10000) {
                    return response.data;
                } else {
                    httpException(response.data);
                    return null;
                }
            } else {
                httpException({
                    code: response.status,
                    msg: response.statusText,
                    result: {},
                });
                return null;
            }
        })
        .catch(function({ response }) {
            if (response.status === 500) {
                let { result } = response.data;
                console.log(response.config);
                response.data.result = result === null ? {} : result;
                httpException(response.data);
            } else {
                httpException({
                    code: response.status,
                    msg: response.data,
                    result: {},
                });
            }
            return null;
        });
    return result;
};

/**
 * GET请求
 * @param {string} url
 * <服务地址>
 * @param {object} params
 * <请求参数>
 */
const get = async (
    url,
    params = {},
    type = CONFIG.server.contentType.json,
    responseType = 'json'
) => {
    const data = params; // auth ? Sign.getSign(params) : Sign.getSignWithNoAuthId(params);
    if (CONFIG.isDev) {
        console.log('request:', url, '\n---------\nparams:', JSON.stringify(data));
    }
    const header = getHeaders();
    const result = await axios
        .create({
            timeout: CONFIG.server.timeout,
            headers: {
                'Content-Type': type,
                ...header,
            },
        })
        .get(url, { responseType: responseType, params: data })
        .then(function(response) {
            if (response && response.status) {
                if (response.status >= 200 && response.status < 300) {
                    let { code, result } = response.data;
                    if (response.data && !code && !result) {
                        return response;
                    }
                    response.data.result = result === null ? {} : result;
                    if (code === 10000) {
                        return result;
                    } else {
                        httpException(response.data);
                        return null;
                    }
                } else {
                    httpException({
                        code: response.status,
                        msg: response.statusText,
                        result: {},
                    });
                    return null;
                }
            }
        })
        .catch(function({ response }) {
            if (response.status === 500) {
                let { result } = response.data;
                console.log(response.config);
                response.data.result = result === null ? {} : result;
                httpException(response.data);
            } else {
                httpException({
                    code: response.status,
                    msg: response.data,
                    result: {},
                });
            }
            return null;
        });
    return result;
};

/**
 * POST请求
 * @param {string} url
 * <服务地址>
 * @param {object} params
 * <请求参数>
 */
const post = async (url, params = {}, type = CONFIG.server.contentType.json) => {
    let data = params; // auth ? Sign.getSign(params) : Sign.getSignWithNoAuthId(params);
    if (CONFIG.isDev) {
        console.log('request:', url, '\n---------\nparams:', JSON.stringify(data));
    }
    const header = getHeaders();
    switch (type) {
        case CONFIG.server.contentType.form:
            data = Qs.stringify(data);
            break;
        case CONFIG.server.contentType.data:
            let formData = new FormData();
            for (let key in data) {
                formData.append(key, data[key]);
            }
            data = formData;
            break;
        default:
            data = JSON.stringify(data);
            break;
    }
    let enced = parameterEncryption(data);
    const result = await axios
        .create({
            timeout: CONFIG.server.timeout,
            headers: {
                'Content-Type': type,
                ...header,
            },
        })
        .post(url, enced)
        .then(function(response) {
            if (response && response.status) {
                let responseData = responseDecryption(response);
                if (response.status >= 200 && response.status < 300) {
                    if (type === CONFIG.server.contentType.file) {
                        let { fileresult } = response.headers;
                        let resultData = JSON.parse(fileresult);
                        if (resultData.code === 10000) {
                            resultData.result.data = response.data;
                            return resultData;
                        } else {
                            httpException(resultData);
                            return {};
                        }
                    } else {
                        let { code, result } = !CONFIG.server.aes.verification
                            ? responseData.data
                            : responseData;
                        !CONFIG.server.aes.verification
                            ? responseData.data.result
                            : (responseData.result = result === null ? {} : result);
                        if (code === 10000) {
                            return !CONFIG.server.aes.verification
                                ? responseData.data
                                : responseData;
                        } else {
                            httpException(response.data);
                            return {};
                        }
                    }
                } else {
                    httpException({
                        code: response.status,
                        msg: response.statusText,
                        result: {},
                    });
                    return {};
                }
            }
        })
        .catch(function({ response }) {
            if (response) {
                if (response.status === 500) {
                    let { result } = response.data;
                    console.log(response.config);
                    response.data.result = result === null ? {} : result;
                    httpException(response.data);
                } else {
                    httpException({
                        code: response.status,
                        msg: response.data,
                        result: {},
                    });
                }
            }
            return {};
        });
    return result;
};
export default { token, get, post, getHeaders };
