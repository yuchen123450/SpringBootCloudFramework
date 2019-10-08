const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const autoprefixer = require('autoprefixer');
const flexbugsFixes = require('postcss-flexbugs-fixes');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpackConfigBase = require('./webpack.base');
const { currentReleaseVersion, project } = require('../src/configs/index.json');
const projectConfig = project.filter((config) => config.name === currentReleaseVersion)[0];

// 判断是否生成发布包
const release = process.env.NODE_ENV === 'production';

// 指定目录,合并打包
const resolve = (relatedPath) => path.join(__dirname, relatedPath);

// 生产环境会将自动代码压缩
const webpackConfigProd = {
    devtool: release ? false : 'source',
    plugins: [
        new CleanWebpackPlugin({
            root: resolve('../dist'),
            dry: false,
            verbose: true,
        }),
        new webpack.ProgressPlugin(),
        new OptimizeCssAssetsPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[hash:4].css',
            chunkFilename: 'css/[name].[hash:4].css',
        }),
        new FileManagerPlugin({
            onEnd: {
                mkdir: ['./dist', './release'],
                copy: [{ source: './plugins', destination: './plugins' }],
                archive: release
                    ? [
                          {
                              source: './dist',
                              destination: `./release/${projectConfig.name}-${
                                  projectConfig.version
                              }-${new Date().getTime()}.zip`,
                          },
                      ]
                    : [],
            },
        }),
        // 分析代码
        new BundleAnalyzerPlugin({
            analyzerPort: 3030,
            openAnalyzer: release,
        }),
    ],
    module: {
        rules: [
            // 解析less文件
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { sourceMap: false } },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: () => [
                                flexbugsFixes,
                                autoprefixer({
                                    flexbox: 'no-2009',
                                }),
                            ],
                        },
                    },
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
};

module.exports = merge(webpackConfigBase, webpackConfigProd);
