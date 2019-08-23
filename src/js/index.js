console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV !== 'production') {
    require('raw-loader!../pages/index.html');          //在dev模式引入html形成依赖，以在devserver监测成功，raw-loader把html转化为字符串。缺点：不能监听头尾变化
}                                                       //另一种方法是利用gulp的livereload,未实验，详见参考https://github.com/xiechao06/webpack-dev-server-sample

import $$ from '../assets/js/test';
import '../css/index.scss';
import '../assets/css/common.scss';

$(".content").css('background','purple');
console.log($$)
console.log($)
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
console.log(x); // 1
console.log(y); // 2
console.log(z); // { a: 3, b: 4 }
let n = { x, y, ...z };
console.log(n); // { x: 1, y: 2, a: 3, b: 4 }
console.log(typeof (Object.assign(2)));
console.log('11')