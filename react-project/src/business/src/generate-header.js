import { getStore } from '@boluome/common-lib'
import { isEmpty, merge, isNil, ifElse, or, always, equals, compose, __, clone, test } from 'ramda'

const mergeHeader = (
  (condition, tr = {}, fr = {}, headers) => (
    compose(merge(headers, __), clone)(
      ifElse(
        equals(true),
        always(tr),
        always(fr)
      )(condition)
    )
  )
)
export default (
  (headers = {}, sid = getStore('customerUserId', 'session')) => (
    compose(
      mergeHeader(or(isNil(sid), isEmpty(sid)), { sid: 'no-sid' }, { sid }, __),
      mergeHeader(test(/^(192.168|127.0|localhost)/, location.host), { appCode: 'blm' }, {}, __)
    )(headers)
  )
)
