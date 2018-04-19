// import { moment, week } from '@boluome/common-lib'

// 默认日期 ---> 2017-09-19 添加了 明后天数据处理
const getDateArr = () => {
  const D = new Date()
  const year = D.getFullYear()
  const month = D.getMonth() + 1
  const years = []
  const num = 10
  for (let i = 0; i < num; i++) {
    const DD = new Date(`${ year + i }`, month, 0)
    const y = `${ DD.getFullYear() }`
    const obj = {
      label: y,
      value: y,
    }
    years.push(obj)
  }
  const months = []
  for (let n = 1; n < 13; n++) {
    const obj = {
      label: n,
      value: n,
    }
    months.push(obj)
  }
  const seasons = [
    years,
    months,
  ]
  return seasons
}

export default (
  getDateArr
)
