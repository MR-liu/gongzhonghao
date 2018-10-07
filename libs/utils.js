'use strict'

// let fs = require('fs');
let Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'))

exports.readFileAsync = async (fpath, encoding) => await fs.readFileAsync(fpath, encoding)
exports.writeFileAsync = async (fpath, content) => await fs.writeFileAsync(fpath, content)
