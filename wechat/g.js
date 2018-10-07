'use strict'
var getRawBody = require('raw-body')
let sha1 = require('sha1');
var Wechat = require('./wechat')


module.exports = function (opts) {
    let wechat = new Wechat(opts);
    
    return function* (next) {
        let token = opts.token;
        let signature = this.query.signature;
        let nonce = this.query.nonce;
        let timestamp = this.query.timestamp;
        let echostr = this.query.echostr;

        let str = [token, timestamp, nonce].sort().join('');
        let sha = sha1(str);

        if (this.method === 'GET') {
            if (sha === signature) {
                this.body = echostr + ''
            } else {
                this.body = 'wrong'
            }
        } else if (this.method === 'POST') {
            if (sha !== signature) {
                this.body = 'wrong'

                return false
            }

            // 获取分发的xml数据
            var data = yield getRawBody(this.req, {
                length: this.length,
                limit: '1mb',
                encoding: this.charset
            })

            console.log(data.toString())
        }

        if (sha === signature) {
            console.log('--------------------------- sure ----------------------------')
            this.body = echostr + ''
        } else {
            this.body = 'wrong'
        }
    }
}
