const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const glob = require('glob');
const {resolve} = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
    entry: glob.sync('./src/js/*.js').reduce((pre,filepath) => {
        const tempList = filepath.split('src/')[1].split(/js\//);
        const filename = `${tempList[0]}${tempList[1].replace(/\.js/g, '')}`;
        return Object.assign(pre, {[filename]: filepath});
    },{}),
    resolve: {
        alias: {
            '@': resolve(__dirname, './src/pages')
        }
    },
    plugins: [
        new webpack.ProvidePlugin({                 //配置shim预置依赖
            $: 'jquery'
        }),
        // ...glob.sync('src/pages/*.ejs').map((filepath, i) => {
        ...glob.sync('src/pages/*.html').map((filepath, i) => {
            // const tempList = filepath.split('src/')[1].split(/pages\//);
            const tempList = filepath.split('src/')[1].split(/pages\//);
            const fileName = tempList[1].split('.')[0].split(/[\/|\/\/|\\|\\\\]/g).pop();
            const fileChunk = `${tempList[0]}${fileName}`;
            return new HtmlWebpackPlugin({
                filename: `${fileChunk}.html`,
                // template: `ejs-loader!${filepath}`,
                template: filepath,
                inject: true,
                chunks: [fileChunk,'manifest'],
                hash:true,
                cache: false,
                title: fileChunk
                // minify:{
                //     collapseWhitespace: true,        //是否删除空白
                //     removeComments: true             //是否移除注释
                // }
            })
        }),
        new CopyWebpackPlugin([{                        //复制图片
            from: './src/images/*',
            to: 'images/[name].[ext]'
       }])
    ],
    module: {
        rules: [
            {
                test: /\.html$/,
                use: ['ejs-loader']
            },
            // {
            //     test: /\.html$/,
            //     use: [{
            //         loader: 'html-loader',
            //         options: {
            //             attrs: ['img:src', 'img:data-src', 'audio:src'],
            //             minimize: false
            //             // interpolate: true,
            //             // minimize: false
            //         }
            //     }]
            // },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [['@babel/plugin-transform-runtime',{             //避免重复引入,禁用了 babel 自动对每个文件的 runtime 注入，而是引入 babel-plugin-transform-runtime 并且使所有辅助代码从这里引用
                            "absoluteRuntime": false,
                            "corejs": 3,                                            //配置进行ES6=>ES5转化
                            "helpers": true,
                            "regenerator": true,
                            "useESModules": false
                          }]]
                    }
                }
            },
            {
                test: /\.(c|sc)ss$/,
                include: [
                    resolve("src"),
                ],
                use: [
                    // process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
                    // MiniCssExtractPlugin.loader
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options:{
                            publicPath: '../'                           //为了使背景图片路径不在css/文件下
                        }
                    },
                    'css-loader',
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: [require('autoprefixer')],          //postcss-loader，autoprefixer添加浏览器前缀，兼容不同版本浏览器
                            sourceMap: true
                        }
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                loader: 'url-loader',
                options:{
                    limit:100,   //表示低于50000字节（50K）的图片会以 base64编码
                    outputPath:"./images",
                    name: '[name].[ext]'
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                loader: 'url-loader',
                options:{
                    limit:20000,
                    outputPath:"./fonts",
                    name: '[name].[hash:5].[ext]'
                }
            },
            {
                test: require.resolve('jquery'),        //配置jq全局按需加载使用
                use: "imports-loader?this=>window"
            }
        ]
    },
    optimization: {
        runtimeChunk: {
            name: 'manifest'
        },
        splitChunks: {
            cacheGroups: {
                vendors: {                      //分离出来的插件
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                    name: 'vendors',
                    filename: 'assets/vendors.[contenthash:8].js',
                    priority: 2,
                    reuseExistingChunk: true
                },
                common: {                       //分离出来的公用
                    test: /[\\/]assets[\\/]/,
                    chunks: 'all',
                    name: 'common',
                    filename: 'assets/common.[contenthash:8].js',
                    minSize: 0,
                    minChunks: 2,
                    priority: 1,
                    reuseExistingChunk: true
                }
            }
        },
        //每当新增或者删减导致module的顺序改变时，受影响的chunk的hash值也会改变。解决办法就是使用唯一的hash值替代自增的id
        moduleIds: 'hashed'
    },
    output: {
        filename: 'js/[name].[chunkhash].js',
        // filename: '[name].bundle.js',
        chunkFilename: 'js/j[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist')
    }
}