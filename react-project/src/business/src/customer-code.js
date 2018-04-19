/*
 * 根据域名来获取CustomerCode
 */
import { ifElse, always, test, replace, compose } from 'ramda'

const { hostname } = window.location

export default (
  ifElse(
    test(/^(localhost|192.168)/),
    always('blm'),  // 本地测试用 app code
    ifElse(
      test(/^(139.198)/),
      always('srcb'),
      compose(
        replace(/(.test.otosaas.com|.otosaas.com)/, ''),
        replace(/^stg-|^dev-/, '')
      )
    )
  )(hostname)
)
