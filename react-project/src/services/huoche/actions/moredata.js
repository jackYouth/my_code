import { getStore, setStore } from '@boluome/common-lib' // get
import { Loading } from '@boluome/oto_saas_web_app_component'
import { get } from 'business'

// 获取所有火车站
const getStationsFn = (chooseCity, dispatch) => {
  const handleClose = Loading()
  const stationsUrl = '/huoche/v1/city/stations'
  const channel = getStore('huoche_channel', 'session')
  // 处理上一个页面如果带来了 指查看高铁动车
  const nowChecked = getStore('huoche_SpeedRail', 'session')
  const changeFilter = filiterObj => {
    const { trainline } = filiterObj
    if (nowChecked) {
      for (let i = 0; i < trainline.length; i++) {
        if (trainline[i].name === '高铁（G／C）' || trainline[i].name === '动车（D）') {
          trainline[i].choose = true
        }
      }
      dispatch({ type: 'KJIN_FILTEROBJ', iSconditions: true })
    }
    return filiterObj
  }
  // 筛选做处理数据
  const timeLimit = [
    '0:00-6:00',
    '6:00-12:00',
    '12:00-18:00',
    '18:00-24:00',
  ]
  const train = [
    '高铁（G／C）',
    '动车（D）',
    '普通（Z／K／T）',
    '其他（L／Y等）',
  ]
  const sendData = {
    ...chooseCity,
    channel,
  }
  get(stationsUrl, sendData).then(reply => {
    const { code, data, message } = reply
    if (code === 0) {
      const { departCitys, arriveCitys } = data
      const filiterObj = {
        trainline: train.map(e => ({ name: e, choose: false })),
        fromTime:  timeLimit.map(e => ({ name: e, choose: false })),
        toTime:    timeLimit.map(e => ({ name: e, choose: false })),
        fromArr:   departCitys.map(e => ({ name: e, choose: false })),
        toArr:     arriveCitys.map(e => ({ name: e, choose: false })),
      }
      dispatch({
        type:         'KJIN_STATIONS',
        defiliterObj: JSON.parse(JSON.stringify(filiterObj)),
        filiterObj:   changeFilter(filiterObj),
      })
    } else {
      console.log('getStationsFn---', message)
    }
    handleClose()
  })
}


// 处理从上个页面带过来的只看高铁
const handleSpeedRail = data => {
  console.log('ssss')
  const arr = data.filter(item => item.number.split('')[0] === 'G' || item.number.split('')[0] === 'D')
  return arr
}
// 通过经纬度定位商家，在展示一系列数据请求
export const scheduleslistFn = (chooseTime, chooseCity, filiterObj, gethandleFilter) => dispatch => {
  const handleClose = Loading()
  let isFilter = false
  const schedulesUrl = '/huoche/v1/schedules'
  const channel = getStore('huoche_channel', 'session')
  const search = location.search
  if (search && search.indexOf('ChangeSign') > 0) {
    isFilter = true
  }
  console.log('---change', search, isFilter)
  const { from, to } = chooseCity
  const { date } = chooseTime
  const sendData = {
    from,
    to,
    date,
    channel,
    isFilter,
  }
  get(schedulesUrl, sendData).then(reply => {
    const { code, data, message } = reply
    if (code === 0) {
      setStore('huoche_withoutDiscountedPrice', data.withoutDiscountedPrice, 'session')
      let datas = data.list
      let nolist = true
      let notOnceList = true
      const nowChecked = getStore('huoche_SpeedRail', 'session')
      const filterObj = getStore('huoche_filiterObj', 'session')
      if (nowChecked) {
        datas = handleSpeedRail(data.list)
        if (datas.length === 0) {
          nolist = false
        }
      }
      if (data.list.length === 0) {
        // 这里是第一次请求数据没有的话，不显示筛选栏，---test
        notOnceList = false
        nolist = false
      }
      dispatch({
        type:                'KJIN_SCHEDULES',
        scheduleslist:       data.list, // 这里修改是因为 --->首页的高铁动车 - 2017-09-21
        scheduleslistFilter: datas,
        nolist,
        notOnceList,
      })
      console.log('test--list', data)
      if (!filterObj) {
        getStationsFn(chooseCity, dispatch)
      }
      if (gethandleFilter) {
        console.log('wozoule', filiterObj)
        gethandleFilter(filiterObj, datas)
      }
    } else {
      console.log('数据请求失败', message)
    }
    handleClose()
  })
}
