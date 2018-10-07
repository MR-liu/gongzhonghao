'use strict'

// let fs = require('fs');
let Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'))

exports.readFileAsync = async (fpath, encoding) => await fs.readFileAsync(fpath, encoding)
exports.writeFileAsync = async (fpath, content) => await fs.writeFileAsync(fpath, content)

// exports.readFileAsync = function (fpath, encoding) {
//     return new Promise(function (resolve, reject) {
//         fs.readFile(fpath, encoding, function (err, content) {
//             if (err) reject(err)
//             else resolve(content)
//         })
//     })
// }

// exports.writeFileAsync = function (fpath, content) {
//     return new Promise(function (resolve, reject) {
//         fs.writeFile(fpath, content, function (err, content) {
//             if (err) reject(err)
//             else resolve()
//         })
//     })
// }