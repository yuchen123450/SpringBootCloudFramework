import React from 'react';
import { PATTERN } from '../constants/common';
import { CONFIG } from '../configs';
import { isEmpty } from './common';

/**
 * 走马灯效果
 * @param {string} text
 * <文字内容>
 * @param {number} width
 * <容器宽度>
 */
export const marquee = (text, width) => {
    //创建临时div
    let div = document.createElement('div');
    div.setAttribute('style', 'visibility: hidden; position: absolute;');
    div.appendChild(document.createTextNode(text));
    document.body.appendChild(div);

    let targetEl = null;
    //判断div宽度和容器宽度
    if (div.offsetWidth > width) {
        targetEl = <marquee width='100%'>{text}</marquee>;
    } else {
        targetEl = <span>{text}</span>;
    }
    //清楚临时div
    document.body.removeChild(div);
    div = null;

    return targetEl;
};

/**
 * 下载文件
 *  @param {String} downUrl
 * 文件下载地址
 */
export const downLoadFile = (downUrl) => {
    let pathurl = `${CONFIG.server.url}${CONFIG.server.resource}${downUrl}`; //CONFIG.server.url
    pathurl = pathurl.replace(/\\/g, '/');
    const a = document.createElement('a');
    a.setAttribute('download', '');
    a.setAttribute('href', pathurl);
    a.click();
};

/**
 * 文件下载
 * @param {blob} blob 文件流
 * @param {string} fileName 文件名称
 */
export const downFile = (blob, fileName) => {
    if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, fileName);
    } else {
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(link.href);
    }
    return { success: true };
};

/**
 * 获取当前@media基准html的实际px，即当前1rem的值
 * @return float px 值
 */
export const getCurrentBaseRem = () => {
    let rem;
    let _html = document.getElementsByTagName('html')[0];
    rem = parseFloat(window.getComputedStyle(_html).fontSize.replace('px', ''));
    return rem;
};

//是否全屏
const isInFullScreen = () => {
    if (document.fullScreenElement !== undefined) {
        return !!document.fullScreenElement;
    }
    if (document.mozFullScreen !== undefined) {
        return !!document.mozFullScreen;
    }
    if (document.webkitIsFullScreen !== undefined) {
        return !!document.webkitIsFullScreen;
    }
    if (window['fullScreen'] !== undefined) {
        return !!window.fullScreen;
    }
    if (window.navigator.standalone !== undefined) {
        return !!window.navigator.standalone;
    }
    var heightMargin = 5;
    if (/Apple Computer/.test(navigator.vendor)) {
        heightMargin = 42; // Safari in full screen mode shows the navigation bar,which is 40px
    }
    return (
        screen.width == window.innerWidth &&
        Math.abs(screen.height - window.innerHeight) < heightMargin
    );
};

//全屏显示
export const setFullScreen = (callback) => {
    let isFull = isInFullScreen();
    if (isFull) {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.exitFullscreen) {
            document.getElementById('mainBody').exitFullscreen();
        }
    } else {
        if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.body.webkitRequestFullScreen) {
            document.body.webkitRequestFullScreen();
        } else if (document.body.requestFullscreen) {
            document.body.requestFullscreen();
        } else if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        }
        if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
    }
    if (callback) {
        callback(!isFull);
    }
};

/**
 * 获取页面大小/位置集合
 */
export const getExplorerScreenRectParams = () => ({
    clientWidth: document.body.clientWidth, //网页可见区域宽
    clientHeight: document.body.clientHeight, //网页可见区域高
    offsetWidth: document.body.offsetWidth, //网页可见区域宽(包括边线和滚动条的宽)
    offsetHeight: document.body.offsetHeight, //网页可见区域高(包括边线的宽)
    scrollWidth: document.body.scrollWidth, //网页正文全文宽
    scrollHeight: document.body.scrollHeight, //网页正文全文高
    scrollTopFF: document.body.scrollTop, //网页被卷去的高(ff)
    scrollTopIE: document.documentElement.scrollTop, //网页被卷去的高(ie)
    scrollLeft: document.documentElement.scrollLeft, //网页被卷去的左
    screenTop: window.screenTop, //网页正文部分上
    screenLeft: window.screenLeft, //网页正文部分左
    screenHeight: window.screen.height, //屏幕分辨率的高
    screenWidth: window.screen.width, //屏幕分辨率的宽
    availHeight: window.screen.availHeight, //屏幕可用工作区高度
    availWidth: window.screen.availWidth, //屏幕可用工作区宽度
    colorDepth: window.screen.colorDepth, //屏幕彩色设置位数
    deviceXDPI: window.devicePixelRatio, //屏幕像素尺寸设置
});

/**
 *
 * @param {function} getFieldDecorator
 * @param {String} name
 * input组件标识
 * @param {int} min
 * 限制最小数
 * @param {int} max
 * 限制最大数
 * @param {function} formatMessage
 * @param {*} locale
 * @param {boolean} required
 * 是否需要验证
 * @param {String} initialValue
 * 初始化值
 * @param {String} pattern
 * 正则校验规则名字
 * @param {String} patternTips
 * 不符合正则校验提示信息
 */
export const formItemTips = (
    getFieldDecorator,
    name,
    min = 0,
    max = 64,
    formatMessage,
    locale,
    checkInfo = { required: false, emptyHint: 'InputTip', specialSymbolPattern: 'illegal' },
    initialValue = '',
    pattern = 'illegal',
    patternTips,
    autoPattern = false
) => {
    let input = getFieldDecorator(name, {
        initialValue: initialValue ? initialValue : '',
        rules: [
            {
                required: checkInfo && checkInfo.required ? checkInfo.required : false,
                pattern: PATTERN.empty,
                validator: (rule, value, callback) => {
                    let minValue = min === 0 ? 1 : min;
                    if (value.length === 0) {
                        if (checkInfo && checkInfo.required) {
                            let localeText = checkInfo.emptyHint;
                            callback(formatMessage(locale[localeText]));
                            return;
                        }
                    } else {
                        if (value.length < minValue || value.length > max) {
                            callback(
                                formatMessage(locale.InputLengthTip, {
                                    min: min === 0 ? 1 : min,
                                    max: max,
                                })
                            );
                            return;
                        }
                    }
                    callback();
                },
            },
            !autoPattern
                ? {
                      pattern:
                          pattern === 'illegal'
                              ? PATTERN[
                                    checkInfo && checkInfo.specialSymbolPattern
                                        ? checkInfo.specialSymbolPattern
                                        : pattern
                                ]
                              : PATTERN[pattern],
                      validator: (rule, value, callback) => {
                          if (rule.pattern.test(value)) {
                              let patternContent =
                                  PATTERN[
                                      checkInfo && checkInfo.specialSymbolPattern
                                          ? checkInfo.specialSymbolPattern
                                          : pattern
                                  ];
                              let replaceRules = patternContent
                                  .toString()
                                  .replace(/[\/\[\]\\]/g, ' ')
                                  .replace(/(.{1})/g, '$1 ');
                              let msg = '';
                              if (checkInfo && checkInfo.specialSymbolPattern) {
                                  msg = `${formatMessage(
                                      locale.InputIllegalTip
                                  )}\\\ /${replaceRules}`;
                              } else {
                                  msg =
                                      pattern === 'illegal'
                                          ? `${formatMessage(
                                                locale.InputIllegalTip
                                            )}\\\ /${replaceRules}`
                                          : patternTips;
                              }
                              callback(msg);
                          }
                          callback();
                      },
                  }
                : {
                      pattern: new RegExp(PATTERN[pattern]),
                      message: patternTips,
                  },
        ],
    });
    return input;
};

/**
 * 自动处理前后空格
 * @param {Object} values
 *
 */
export const handleSpace = (values) => {
    for (let key in values) {
        if (typeof values[key] === 'string' && !isEmpty(values[key])) {
            values[key] = values[key].trim();
        }
    }
    return values;
};

/**
 * 上传文件类型过滤
 * @param {String} fileType
 * 文件类型
 */
export const filterUploadTypes = (fileType) => {
    const isWord =
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    const isPdf = fileType === 'application/pdf';
    // const isPpt = fileType === 'application/vnd.ms-powerpoint';
    const isExcel =
        fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const isMP3 = fileType === 'audio/mp3';
    const isMP4 = fileType === 'video/mp4';
    const isImg =
        fileType === 'image/jpeg' ||
        fileType === 'image/png' ||
        fileType === 'image/gif' ||
        fileType === 'image/bmp';
    // const isCsv = fileType === 'application/vnd.ms-excel';
    if (isWord || isPdf || isExcel || isMP3 || isMP4 || isImg) {
        return true;
    } else {
        return false;
    }
};

/**
 * 上传文件大小限制
 */
export const filterUploadSize = (file) => {
    const isLt20M = file.size / 1024 / 1024 < 20;
    return isLt20M;
};
