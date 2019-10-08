import { message } from 'antd';

const messageConfigCache = {
    top: 64,
    maxCount: 5,
};
message.config(messageConfigCache);
/**
 * 提示信息,避免内容一样,重复显示
 * @param {信息类型} type
 * @param {信息内容} msg
 * @param {最大队列数量} maxCount
 */
export const toast = (type, msg, maxCount = 5) => {
    let show = true;
    let messageEls = Array.from(document.getElementsByClassName('ant-message'));
    messageEls.forEach((el) => {
        //let text = el.innerText.replace(/[\r\n]/g, '');
        let text = el.textContent;
        if (text && text === msg) {
            show = false;
        }
    });
    if (show) {
        if (maxCount != messageConfigCache.maxCount) {
            messageConfigCache.maxCount = maxCount;
            message.destroy();
            message.config(messageConfigCache);
        }
        switch (type) {
            case 'info':
                message.info(msg);
                break;
            case 'success':
                message.success(msg);
                break;
            case 'error':
                message.error(msg);
                break;
            case 'warn':
                message.warn(msg);
                break;
        }
    }
};
