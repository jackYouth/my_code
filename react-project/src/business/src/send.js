import { send, stringifyJSON } from '@boluome/common-lib'
import { type, equals, compose, merge, drop, take } from 'ramda'
import generateHeader from './generate-header'
import customer from './customer'

export default (
  (url, data, method = 'post', headers = {}) => {
    if (compose(equals('Object'), type)(method)) {
      headers = generateHeader(method)
      method = 'post'
    }

    const { isDataCrypto, cryptoPublicKey: key } = customer()
    // let { isDataCrypto, cryptoPublicKey: key } = customer()

//     isDataCrypto = true
//
//     key =
// `-----BEGIN RSA PUBLIC KEY-----
// MIIBCgKCAQEAwQELVTQdWa70RYKawdadP0FXHDtGUjprlwUItj9FWwzu2ZZBWOxa
// T0Z+bFQR5P322EOWnEK4vw0/LRqq+pyDsdVxJgZWtU3kGqFFsCb8l/1R5iWJwLJ2
// 1I2pS1cm6JWo14b4XokwR1e9N/93l+s6ZB9WxCg/DyzwsiFrVomOWCXrMTFqy+u4
// sPMQppH96/NvDiIwfBU5V6goIfqTB4oA+WJCpUjV4699aGkA9spV9PmZZCu5AtVY
// kwc8pmxttC0YyctYsjddQM8VsVdB1+NCK7Jn0yTczplOYiCaS5bLA9Mil3T2jTjD
// JiuBgeEqwQS/B9wdg+A4TkWkSrFuXtfFXQIDAQAB
// -----END RSA PUBLIC KEY-----
// `

    if (isDataCrypto && key) {
      return new Promise((resolve, reject) => {
        require.ensure(['crypto-browserify', 'buffer'], () => {
          const publicEncrypt = require('crypto-browserify').publicEncrypt
          const constants = require('crypto-browserify').constants
          const Buffer = require('buffer').Buffer
          const splitStrByLen = (_len, _str, arr = []) => {
            const split = (l, s) => {
              arr.push(take(l, s))
              if (s.length > l) {
                split(l, drop(l, s))
              }
            }
            split(_len, _str)
            return arr
          }
          headers = merge(headers)({ 'Content-Type': 'text/plain' })
          // console.log('datalength', JSON.stringify(data).length, JSON.stringify(data))
          data = splitStrByLen(200, stringifyJSON(data))
                   .map(s => Buffer.from(s, 'utf8'))
                   .map(buf => publicEncrypt({ key, padding: constants.RSA_PKCS1_PADDING }, buf).toString('base64'))
                   .join(',')

          send(url, data, method, generateHeader(headers))
          .then(reply => resolve(reply))
          .catch(err => reject(err))
        }, 'crypto-browserify')
      })
    }
    return send(url, data, method, generateHeader(headers))
  }
)
