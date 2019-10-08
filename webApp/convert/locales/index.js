const path = require('path');
const fs = require('fs');
const iconv = require('iconv-lite');

// 指定目录,合并打包
const resolve = (relatedPath) => path.join(__dirname, relatedPath);

//语言文件夹路径
const localesPath = '../../src/assets/locales';

/**
 * 获取初始化语言文件的Key
 */
const getLocaleKeys = () => {
    let initLocalePath = resolve(`${localesPath}/index.json`);
    let readContent = fs.readFileSync(initLocalePath, 'utf-8');
    let initLocaleContent = {};
    if (readContent) {
        initLocaleContent = JSON.parse(readContent);
    }
    let localeKeys = [];
    for (let key in initLocaleContent) {
        localeKeys.push(key);
    }
    return localeKeys;
};

const getBaseLocal = () => {
    //文件必须是utf8格式，否则读取有问题
    let baseLocalePath = resolve('./base.csv');
    let readContent = fs.readFileSync(baseLocalePath, 'utf-8');
    let baseLocale = [];
    if (readContent) {
        baseLocale = readContent.split('\r\n');
        baseLocale.shift();
    }
    return baseLocale;
};

/**
 * 合并语言文件内容
 * @param {*} name 文件名称
 * @param {*} localeContent 语言文件内容
 * @param {*} content 最后的内容
 */
const mergeLocale = (name, localeContent = {}, content = []) => {
    let localeKeys = getLocaleKeys();
    let baseLocale = getBaseLocal();
    localeKeys.forEach((key) => {
        let item = content.find((item) => item.key === key);
        if (item) {
            item[name] = localeContent[key];
        } else {
            item = {};
            item['key'] = key;
            item[name] = localeContent[key];
            item['refence'] = '';
            item['refenceContent'] = '';

            let baseItem = baseLocale.find((item) => {
                if (item && item.indexOf(localeContent[key]) > -1) {
                    return item;
                }
            });
            if (baseItem) {
                let baseItemArr = baseItem.split(',');
                item['refence'] += `${baseItemArr[0]}[${baseItemArr[1]}]`;
                item['refenceContent'] += `${baseItemArr[2]} | ${baseItemArr[3]}`;
            }
            content.push(item);
        }
    });
};

/**
 * 将Json格式的语言内容转换成csv字符串
 */
const convertJson2Csv = (jsonContent) => {
    let content = '';
    if (jsonContent.length > 0) {
        //csv表格头
        for (let key in jsonContent[0]) {
            content += `${key},`;
        }
        content = `${content}\n`;

        //csv表格内容
        jsonContent.forEach((item) => {
            for (let key in item) {
                let text = item[key] ? item[key].replace(/,/g, '，') : '';
                content += `${text.toString()},`;
            }
            content = `${content}\n`;
        });
    }
    return iconv.encode(content, 'GB2312');
};

/**
 * 获取语言文件内容
 */
const getLocaleCsv = () => {
    let localeDir = fs.readdirSync(resolve(`${localesPath}`));
    localeDir.forEach((dir) => {
        let dirPath = resolve(`${localesPath}/${dir}`);
        let dirInfo = fs.statSync(dirPath);
        if (dirInfo.isDirectory()) {
            let content = [];
            let localeFiles = fs.readdirSync(dirPath);
            localeFiles.forEach((file) => {
                let filePath = resolve(`${localesPath}/${dir}/${file}`);
                let readContent = fs.readFileSync(filePath, 'utf-8');
                if (readContent) {
                    let { result: localeContent } = JSON.parse(readContent);
                    mergeLocale(file.replace('.json', ''), localeContent, content);
                }
            });
            let localeStr = convertJson2Csv(content);
            fs.writeFileSync(resolve(`/${dir}.csv`), localeStr, 'utf-8');
        }
    });
};

module.exports = getLocaleCsv();
