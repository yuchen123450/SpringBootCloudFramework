const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Copy = require('copy-webpack-plugin');
const { currentReleaseVersion, project } = require('../src/configs/index.json');
const projectConfig = project.filter((config) => config.name === currentReleaseVersion)[0];

// 判断是否开发环境
const devMode = process.env.NODE_ENV !== 'production';

// 指定目录,合并打包
const resolve = (relatedPath) => path.join(__dirname, relatedPath);

// 获取html-webpack-plugin参数的方法
const getHtmlConfig = ({ name, chunks }) =>
    new HtmlWebpackPlugin({
        title: name,
        // 模板文件
        template: resolve(`../public/${name}.html`),
        // 生成文件名
        filename: `${name}.html`,
        inject: true,
        hash: false, // 开启hash  ?[hash]
        chunks,
        favicon: resolve('../public/favicon.ico'),
        minify: {
            removeComments: !devMode, // 移除HTML中的注释
            collapseWhitespace: !devMode, // 删除空白符与换行符
        },
    });

const getPluginsCopyConfig = () => {
    let config = [
        { from: `./src/assets/${projectConfig.locale}`, to: './locales' },
        { from: './plugins', to: './plugins' },
    ];
    projectConfig.termsUrl
        ? config.push({
              from: `./public/${projectConfig.termsUrl}`,
              to: './legal-agreement.html',
          })
        : {};
    return config;
};

const webpackConfigBase = {
    // development|production( 生产环境会将代码压缩 )
    mode: process.env.NODE_ENV,
    entry: {
        index: './src/pages/auth/index.js',
        home: './src/pages/home/index.js',
        statistics: `./src/pages/${projectConfig.statistics}/index.js`,
    },
    output: {
        path: resolve('../dist'),
        // 打包文件中所有通过相对路径引用的资源都会被配置的路径所替换。
        publicPath: '/',
        // 配置文件输出路径
        filename: 'js/[name].[hash:4].js?',
        chunkFilename: 'js/[name].[hash:4].js',
    },
    // 指定库目录，减少webpack寻找时间
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        modules: [resolve('../node_modules'), resolve('../src')],
    },
    externals: {
        echarts: 'echarts',
        pdcharts: 'pdcharts',
        mapboxgl: 'mapboxgl',
        h5WsPlayer: 'h5WsPlayer',
    },
    optimization: {
        splitChunks: {
            chunks: 'all', // 表示显示块的范围，有三个可选值：initial(初始块)、async(按需加载块)、all(全部块)，默认为all;
            cacheGroups: {
                vendor: {
                    name: 'vendor',
                    test: /[\\/]node_modules[\\/]/, // 匹配node_modules目录下的文件
                    priority: -10, // 优先级配置项,更高优先级的缓存组可以优先打包所选择的模块
                },
                common: {
                    name: 'common',
                    minChunks: 2, //被不同entry引用次数(import),1次的话没必要提取
                    minSize: 30000, // 小于30KB的话，它就不会分割成一个单独的文件。
                    maxInitialRequests: 5, //最大的初始化加载次数，默认为 3；
                    priority: -20, // 优先级配置项,
                    reuseExistingChunk: true, // 可设置是否重用该chunk
                },
            },
        },
    },
    plugins: [
        new Copy(getPluginsCopyConfig()),
        getHtmlConfig({
            name: 'index',
            chunks: ['vendor', 'common', 'index'],
        }),
        getHtmlConfig({
            name: 'home',
            chunks: ['vendor', 'common', 'home'],
        }),
        getHtmlConfig({
            name: 'statistics',
            chunks: ['vendor', 'common', 'statistics'],
        }),
    ],
    module: {
        // webpack默认只能打包处理.js后缀的文件，像.jpg .vue等文件无法主动处理，所以需要配置第三方loader
        rules: [
            // 解析js|jsx文件
            {
                test: /\.(js|jsx)$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: { cacheDirectory: true }, // 利用缓存，提高性能，babel is slow
                    },
                ],
                include: [resolve('../src')],
                // 在使用babel-loader时候一定要加上exclude,排除node_modules文件夹
                exclude: /node_modules/,
            },
            // 解析css文件
            {
                test: /\.css$/,
                use: ['style-loader', { loader: 'css-loader', options: { sourceMap: true } }],
            },
            // 解析图片文件
            {
                test: /\.(png|jpe?g|gif)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            // 当图片小于10k,生成一个base64的图片,如果大于这个值，生成一个的图片url
                            limit: 10240,
                            // 指定打包后的图片位置
                            outputPath: 'images/',
                            name: '[name].[hash:4].[ext]',
                        },
                    },
                ],
            },
            // 解析svg图片或字体等
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                    {
                        loader: '@svgr/webpack',
                        options: {
                            babel: false,
                            icon: true,
                        },
                    },
                ],
            },
        ],
    },
};

module.exports = webpackConfigBase;
