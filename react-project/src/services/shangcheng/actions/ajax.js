import { get as oldGet, send as oldSend } from '@boluome/common-lib'

export const get = (api, body, headers = {}) => oldGet(api, body, headers)
export const send = (api, body, method, headers = {}) => oldSend(api, body, method, headers)
