import { moment, week } from '@boluome/common-lib'

// 默认日期 ---> 2017-09-19 添加了 明后天数据处理
const getDateArr = chooseTime => {
  const D = new Date()
  const year = D.getFullYear()
  const month = D.getMonth() + 1
  let day = D.getDate()
  if (day < 10) {
    day = `0${ day }`
  }
  const today = `${ year }-${ month > 9 ? month : `0${ month }` }-${ day }`
  const todaystr = moment('x')(today)
  // 判断出是否今天，明天，后天
  const todayWeek = num => {
    D.setFullYear(year, ((month * 1) - 1), (day * 1) + num)
    // const tomo = D.toLocaleDateString()
    const tomo = `${ D.getFullYear() }/${ D.getMonth() + 1 }/${ D.getDate() }`
    return moment('x')(tomo)
  }
  // 抽离十一天的日期数组
  const weed = (y, m, d, num) => {
    const arr = []
    for (let i = 0; i < num; i++) {
      D.setFullYear(y, ((m * 1) - 1), (d * 1) + i)
      // const dateObj = D.toLocaleDateString()
      const dateObj = `${ D.getFullYear() }/${ D.getMonth() + 1 }/${ D.getDate() }`
      const time = dateObj.replace(/\//g, '-')
      const ms = `${ dateObj.split('/')[1] > 9 ? dateObj.split('/')[1] : `0${ dateObj.split('/')[1] }` }`
      const ds = dateObj.split('/')[2] > 9 ? dateObj.split('/')[2] : `0${ dateObj.split('/')[2] }`
      const ts = `${ dateObj.split('/')[0] }-${ ms }-${ ds }`
      const dateShow = `${ ms }月${ ds }日`
      let weeds = week()(moment('day')(time))
      const datestr = moment('x')(time)
      if (datestr === todaystr) {
        weeds = '今天'
      } else if (datestr === todayWeek(1)) {
        weeds = '明天'
      } else if (datestr === todayWeek(2)) {
        weeds = '后天'
      }
      const timeObj = {
        date: ts,
        weed: weeds,
        datestr,
        dateShow,
      }
      // arr.unshift(timeObj)
      arr.push(timeObj)
      // console.log(i, timeObj)
    }
    return arr
  }
  // 可算时间起点
  const calculation = (y, m, d, num) => {
    D.setFullYear(y, ((m * 1) - 1), (d * 1) - num)
    // const dateObj = D.toLocaleDateString()
    const dateObj = `${ D.getFullYear() }/${ D.getMonth() + 1 }/${ D.getDate() }`
    const time = dateObj.replace(/\//g, '-')
    // console.log('calculation--', time)
    const yChoose = time.split('-')[0]
    const mChoose = time.split('-')[1]
    const dChoose = time.split('-')[2]
    return weed(yChoose, mChoose, dChoose, 5) // 11
  }
  const { date } = chooseTime
  const yChoose = date.split('-')[0]
  const mChoose = date.split('-')[1]
  const dChoose = date.split('-')[2]
  const proDate = calculation(yChoose, mChoose, dChoose, 2) // 5
  // console.log('test-getDateArr-', date, '------proDate--', proDate)
  // 过滤出有效时间
  const effectTime = timeArr => {
    const arrs = timeArr.filter(item => {
      return item.datestr >= todaystr
    })
    return arrs
  }
  console.log('arrs', effectTime(proDate))

  return effectTime(proDate)
}

export default (
  getDateArr
)
