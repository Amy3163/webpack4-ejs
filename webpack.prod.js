const merge = require('webpack-merge');
const base = require('./webpack.base');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCss = require('optimize-css-assets-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = merge(base, {
    mode: 'production',
    devtool: "source-map",
    plugins: [
        new CleanWebpackPlugin(),                   //清除文件夹
        new MiniCssExtractPlugin({                   //分离css
            filename: 'css/[name].[hash:8].css',
            chunkFilename: 'css/[name].[hash:8].css'
        }),
        new OptimizeCss({                               //压缩css
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                discardComments: {
                    removeAll: true
                }
            },
            canPrint: true
        }),
        new UglifyJSPlugin({                        //压缩js，4已经废用 自动压缩
            sourceMap: true
        }),
        new webpack.DefinePlugin({                                  //设置process.env.NODE_ENV变量，4已经使用mode来判断模式
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
    ]
})
