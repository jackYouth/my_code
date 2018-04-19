import { get } from '@boluome/common-lib'
import generateHeader from './generate-header'
// import get from './test-get'

export default (
  (url, data, headers, realFetch) => get(url, data, generateHeader(headers), realFetch)
)
