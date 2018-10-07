'use strict'

let Koa = require('koa');
let path = require('path');
let wechat = require('./wechat/g');
let util = require('./libs/utils'); 
let wechat_file = path.join(__dirname, './config/wechat.txt');

let config = {
    wechat: { 
        appID: 'wx4969e6a4c98caf3f',
        appSecret: '31c498cc34b792a6be6c15b47cdac2e4',
        token: 'LZJwillcometonewworld',
        getAccessToken: function () {
            return util.readFileAsync(wechat_file);
        },
        saveAccessToken: function (data) {
            data = JSON.stringify(data);
            return util.writeFileAsync(wechat_file, data);
        },
    },
}

let app = new Koa();
app.use(wechat(config.wechat))

app.listen(4321);
console.log('doing')
