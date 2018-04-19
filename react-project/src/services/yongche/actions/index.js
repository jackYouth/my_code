import { send as preSend, get as preGet, getStore } from '@boluome/common-lib'

export const get = (url, data = {}, headers = {}) => {
  if (url.indexOf('basis') < 0 && url.indexOf('rating') < 0) {
    headers.model = getStore('isSinglePrice', 'session') ? 'fixed' : 'realtime'
  }
  return preGet(url, data, headers)
}

export const send = (url, data = {}, headers = {}) => {
  if (url.indexOf('basis') < 0 && url.indexOf('rating') < 0) {
    headers.model = getStore('isSinglePrice', 'session') ? 'fixed' : 'realtime'
  }
  return preSend(url, data, headers)
}
