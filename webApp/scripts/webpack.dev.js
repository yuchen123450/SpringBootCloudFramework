const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const mockerApi = require('mocker-api');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const notifier = require('node-notifier');
const webpackConfigBase = require('./webpack.base');

// 指定目录,合并打包
const resolve = (relatedPath) => path.join(__dirname, relatedPath);

// 网站url地址
const local = {
	host: '127.0.0.1',
	// host: '192.168.14.217',
	port: 14212,
};

// 接口转发配置
const proxy = {
	// target: 'http://192.168.14.64:13000',
	// target: 'http://192.168.14.15:18080',
	// target: 'http://192.168.14.74:80',
	target: 'http://192.168.14.65:80',
	// target:'http://127.0.0.1:13000',
	// target: 'http://192.168.14.126:13000',
	secure: false,
	changeOrigin: true,
};

// webpack配置
const webpackConfigDev = {
    devtool: 'source-map',
    output: {
        publicPath: `http://${local.host}:${local.port}/`,
    },
    plugins: [
        new webpack.ProgressPlugin(),
        // new FriendlyErrorsPlugin({
        // 	// 运行成功
        // 	compilationSuccessInfo: {
        // 		message: [`你的应用程序在这里运行：http://${local.host}:${local.port}`],
        // 		// notes:['有些附加说明要在成功编辑时显示']
        // 	},
        // 	//  运行错误
        // 	onErrors: function(severity, errors) {
        // 		// 可以收听插件转换和优先级的错误
        // 		// 严重性可以是'错误'或'警告'
        // 		if (severity !== 'error') {
        // 			return;
        // 		}
        // 		const error = errors[0];
        // 		notifier.notify({
        // 			title: 'Webpack error',
        // 			message: `${severity}: ${error.name}`,
        // 			subtitle: error.file || '',
        // 			// icon: ICON
        // 		});
        // 	},
        // 	//是否每次编译之间清除控制台
        // 	//默认为true
        // 	clearConsole: true,
        // }),
    ],
    module: {
        rules: [
            // 解析less文件
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    { loader: 'css-loader', options: { sourceMap: true } },
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: true,
                            javascriptEnabled: true,
                        },
                    },
                ],
            },
        ],
    },
    devServer: {
        host: local.host,
        port: local.port,
        // 自动打开默认浏览器
        // open: true,
        // 通过代理，解决跨域问题
        proxy: {
            '/archive': proxy, // 档案服务
            '/auth': proxy, // 网关服务
            '/filemanager': proxy, // 文件服务
            '/system': proxy, // 系统管理
            '/taskmanager': proxy, // 任务管理服务
            '/resource': proxy, // 资源管理服务
            '/ssd': proxy, // 智能传感器服务
            '/log/list': proxy, // 日志管理,避免和login冲突
            '/parsefile': proxy, // 数据文件解析服务
            '/statistics': proxy, // 综合统计
            '/sample': proxy, // 样本库资源路径
            '/tag': proxy, // 标签服务
            '/robot': proxy, // 机器人服务
            '/rtspvideo': proxy, // H5S服务
        },
        // 启用GZip压缩
        compress: true,
        publicPath: '/',
        // 默认会以根文件夹提供本地服务器，这里指定文件夹
        contentBase: resolve('../dist'),
        historyApiFallback: {
            // Paths with dots should still use the history fallback.
            // See https://github.com/facebookincubator/create-react-app/issues/387.
            disableDotRule: true,
        },
        // 利用webpack-dev-server 的before 方法调用webpack-api-mocker
        before(app) {
            mockerApi(
                app,
                resolve('../mocker/index.js'), // 生成模拟数据
                {
                    // proxy: {
                    // 	'/repos/*': 'https://api.github.com/',
                    // },
                    changeHost: true,
                }
            );
        },
    },
};

module.exports = merge(webpackConfigBase, webpackConfigDev);
