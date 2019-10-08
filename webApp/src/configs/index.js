import { merge } from '../utils/common';
import { currentReleaseVersion, project } from './index.json';

const projectConfig = project.filter((config) => config.name === currentReleaseVersion)[0];

let projectName = projectConfig.name;
const { config = {} } = projectName === 'default' ? {} : require(`../configs/${projectName}.js`);

const initConfig = {
    name: projectName,
    isDev: process.env.NODE_ENV === 'development',
    website: {
        version: projectConfig.version,
        termsUrl: projectConfig.termsUrl,
        title: 'Default',
        copyright: '//////',
        logo: require('../assets/images/logo.png'),
        rootModeMenuId: 'b65e6895-bbf6-4a8f-87b4-73d3308cc0f2',
    },
    langugae: {
        default: 'zh-CN',
        lacale: [
            {
                key: 'zh-CN',
                value: '简体中文',
            },
            {
                key: 'en-US',
                value: 'English',
            },
        ],
    },
    server: {
        url: window.origin || location.origin,
        key: 'MlQ2OS5jMyU1RQ==', //base64后
        operationCode: '', //默认的按钮控制代码
        timeout: 60000, //超时时间
        apiVersion: 1,
        clientType: 200, //100：移动设备200：网页300：桌面应用400：嵌入式900：第三方
        contentType: {
            data: 'mulitpart/form-data',
            form: 'application/x-www-form-urlencoded',
            json: 'application/json;charset=UTF-8',
            file: 'application/octet-stream',
        },
        aes: {
            verification: false,
            key: '3132333435363738393041424344454631323334353637383930414243444566',
            iv: '30313233343536373839414243444546',
        },
        resource: '/resource\\', //资源文件路径前缀
        pageWhiteArr: ['/', '/login', '/home', '/dashboard'],
        smpleSuffix: '/sample/mongodbfile/',
    },
    websocket: {
		// url:'ws://127.0.0.1:61614/',
		// user: 'admin',
		// password: 'admin',
        lostMessage: 'RefreshServiceLostConnect',
        connectMessage: 'RefreshServiceConnected',
    },
    mapbox: {
        online: {
            accessToken: false,
            style: 'index.js',
        },
        center: [108.757317, 32.484416],
        initZoom: 3,
        minZoom: 3,
        maxZoom: 12,
    },
};

export const CONFIG = merge(config, initConfig);
