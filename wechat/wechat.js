'use strict'

var Promise = require('bluebird')
var request = Promise.promisify(require('request'));


let prefix = 'https://api.weixin.qq.com/cgi-bin/'
let api = {
    accessToken: prefix + 'token?grant_type=client_credential'
}

// 处理票据信息
function Wechat(opts) {
    let that = this;
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;

    this.getAccessToken()
        .then(function (data) {
            try {
                data = JSON.parse(data)
            } catch (error) {
                return that.updateAccessToken(data)
            }

            if (that.isValidAccessToken(data)) {
                return Promise.resolve(data)
            } else {
                return that.updateAccessToken(data)
            }
        })
        .then(function (data) {
            that.access_token = data.access_token;
            that.expires_in = data.expires_in;

            return that.saveAccessToken(data);
        })
}

Wechat.prototype.isValidAccessToken = function (data) {
    if (!data || !data.access_token || !data.expires_in) {
        return false;
    }

    let access_token = data.access_token;
    let expires_in = data.expires_in;
    let now = (new Date().getTime())

    if (now < expires_in) {
        return true
    } else {
        return false;
    }
}

Wechat.prototype.updateAccessToken = function () {
    var appID = this.appID
    var appSecret = this.appSecret
    var url = api.accessToken + '&appid=' + appID + '&secret=' + appSecret

    return new Promise(function (resolve, reject) {
        request({
            url: url,
            json: true
        }).then(function (response) {
            var data = response.body
            var now = (new Date().getTime())
            var expires_in = now + (data.expires_in - 20) * 1000

            data.expires_in = expires_in

            resolve(data)
        })
    })
}

module.exports = Wechat