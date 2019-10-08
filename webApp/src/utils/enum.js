import { locale, formatMessage } from '../pages/locale';
import { COLOR } from '../constants/common';
import { isEmpty } from './common';
/**
 * 获取不同监测类型数据单位的枚举对应值
 * （新版本参考：DMP->2.设计->数据平台枚举说明.docx->2.数据单位枚举）
 * @param {枚举值} key
 */
const getUnitEnum = (key) => {
    let unit = '';
    switch (Number(key)) {
        case 0:
            unit = '';
            break;
        case 1:
            unit = 'dB';
            break;
        case 2:
            unit = 'dBm';
            break;
        case 3:
            unit = 'dBmV';
            break;
        case 4:
            unit = 'dBμV';
            break;
        case 5:
            unit = 'V';
            break;
        case 6:
            unit = 'mV';
            break;
        case 7:
            unit = 'μV';
            break;
        case 8:
            unit = '%';
            break;
        case 9:
            unit = 'A';
            break;
        case 10:
            unit = 'mA';
            break;
        case 11:
            unit = 'μA';
            break;
        case 12:
            unit = 'Ω';
            break;
        case 13:
            unit = 'mΩ';
            break;
        case 14:
            unit = 'μΩ';
            break;
        case 15:
            unit = 'm/s²';
            break;
        case 16:
            unit = 'mm';
            break;
        case 17:
            unit = '℃';
            break;
        case 18:
            unit = '℉';
            break;
        case 19:
            unit = 'Pa';
            break;
        case 20:
            unit = 'C';
            break;
        case 21:
            unit = 'mC';
            break;
        case 22:
            unit = 'μC';
            break;
        case 23:
            unit = 'nC';
            break;
        case 24:
            unit = 'pC';
            break;
        case 25:
            unit = 'kV';
            break;
        case 26:
            unit = 'KW';
            break;
        case 27:
            unit = 'kVar';
            break;
        case 28:
            unit = 'ppm';
            break;
        case 29:
            unit = 'cm';
            break;
        case 30:
            unit = 'ms';
            break;
        case 31:
            unit = 'μL/L';
            break;
        default:
            break;
    }
    return unit;
};

export default {
    getUnitEnum,
    
};
