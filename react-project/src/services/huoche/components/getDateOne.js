import { moment } from '@boluome/common-lib'

// 默认日期 ---> 2017-09-19 添加了 明后天数据处理
const getDateOne = timedate => {
  const D = new Date()
  const year = D.getFullYear()
  const month = D.getMonth() + 1
  let day = D.getDate()
  if (day < 10) {
    day = `0${ day }`
  }
  const weed = num => {
    D.setFullYear(year, ((month * 1) - 1), (day * 1) + num)
    const tomo = `${ D.getFullYear() }/${ D.getMonth() + 1 }/${ D.getDate() }`
    // const tomo = D.toLocaleDateString()
    return moment('x')(tomo)
  }
  if (timedate) {
    const { datestr } = timedate
    if (datestr === weed(1)) {
      return '明天'
    } else if (datestr === weed(2)) {
      return '后天'
    } else if (datestr === weed(0)) {
      return '今天'
    }
  } else {
    const date = `${ year }-${ month > 9 ? month : `0${ month }` }-${ day }`
    const datestr = moment('x')(date)
    const time = {
      dateShow: `${ month }月${ day }日`,
      weed:     '今天',
      date,
      datestr,
    }
    return time
  }
}
export default (
  getDateOne
)
