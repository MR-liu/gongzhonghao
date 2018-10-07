'use strict'

let getRawBody = require('raw-body')
let sha1 = require('sha1');
let Wechat = require('./wechat')
let util = require('./util')

module.exports = function (opts) {
    let wechat = new Wechat(opts);
    
    return function* (next) {
        let that = this;
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
            let data = yield getRawBody(this.req, {
                length: this.length,
                limit: '1mb',
                encoding: this.charset
            })

            let content = yield util.parseXMLAsync(data)

            console.log('content ================== ', content)

            let message = util.formatMessage(content.xml)

            console.log('message ================== ', message)
            if (message.MsgType === 'text') {
                if (message.Event === 'subscribe') {
                    let now = new Date().getTime();

                    that.status = 200;
                    that.type = 'application/xml';
                    that.body = `<xml> 
                                    <ToUserName>
                                        < ![CDATA[${message.FromUserName}] ]>
                                    </ToUserName>
                                    <FromUserName>
                                        < ![CDATA[${message.ToUserName}] ]>
                                    </FromUserName>
                                    <CreateTime>
                                        ${now}
                                    </CreateTime>
                                    <MsgType>
                                        < ![CDATA[text] ]>
                                    </MsgType>
                                    <Content>
                                        < ![CDATA[你好,这里是测试] ]>
                                    </Content>
                                </xml>`
                    return
                }
            }
        }

        if (sha === signature) {
            console.log('--------------------------- sure ----------------------------')
            this.body = echostr + ''
        } else {
            this.body = 'wrong'
        }
    }
}
