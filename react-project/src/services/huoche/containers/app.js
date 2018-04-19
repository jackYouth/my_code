import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Toast  } from 'antd-mobile'
import { wrap, Mask, Loading }    from '@boluome/oto_saas_web_app_component'
import { login, getLocationGaode } from 'business'
import { getStore, week, moment, setStore, removeStore } from '@boluome/common-lib'
import App         from '../components/app'
import getDateOne from '../components/getDateOne'
import { removeStoreFn, removeStoreAppMore } from '../actions/order'

const mapStateToProps = state => {
  const { app } = state
  const { nowChecked, history, chooseCity, chooseTime, LocationAddr, cityHot } = app
  return {
    nowChecked,
    history,
    chooseCity,
    chooseTime,
    LocationAddr,
    cityHot,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    // 是否只查看高铁
    handleCheckedFn: v => {
      console.log('handleCheckedFn--', v)
      dispatch({ type: 'NOWCHECHED', nowChecked: v })
      if (v) {
        setStore('huoche_SpeedRail', true, 'session')
      } else {
        setStore('huoche_SpeedRail', false, 'session')
      }
    },
    handleCalendarDate: dates => {
      console.log(getDateOne(dates))
      history.go(-1)
      // Mask.closeAll()
      // location.hash = ''
      const { date, datestr } = dates
      const time = `${ date.split('-')[1] }月${ date.split('-')[2] }日`
      const weed = getDateOne(dates) ? getDateOne(dates) : week()(moment('day')(date))
      const chooseTime = {
        dateShow: time,
        datestr,
        weed,
        date,
      }
      dispatch({ type: 'CALENDAR_TIME', chooseTime })
      setStore('huoche_ChooseTime', chooseTime, 'session')
    },
    // 选择出发地，处理
    handleStartPoint: (reply, chooseCity) => {
      const { name } = reply
      const { to } = chooseCity
      dispatch({ type: 'CHOOSE_CITY', chooseCity: { from: name, to } })
    },
    // 选择目的地，处理
    handleEndPoint: (reply, chooseCity) => {
      const { name } = reply
      const { from } = chooseCity
      dispatch({ type: 'CHOOSE_CITY', chooseCity: { from, to: name } })
    },
    // 出发地和目的地交换
    handleTransform: chooseCity => {
      const { from, to } = chooseCity
      const point = {
        from: to,
        to:   from,
      }
      dispatch({ type: 'CHOOSE_CITY', chooseCity: point })
    },
    // 处理历史记录的清除
    hanndleCleanHistory: () => {
      setStore('huoche_ChooseCity', [])
      dispatch({ type: 'HUOCHE_HISTORICAL', history: [] })
      // 这里是防止清空最近查找，而出发地为空
      const chooseCity = getStore('currentPosition', 'session')
      const city = chooseCity.city.replace(/['省', '市', '县', '区']/, '')
      const startAndend = {
        from: city,
        to:   '北京',
      }
      dispatch({ type: 'CHOOSE_CITY', chooseCity: startAndend })
    },
    // 当点击历史记录的时候，查询历史记录
    handleChooseHist: chooseCity => {
      dispatch({ type: 'CHOOSE_CITY', chooseCity })
    },
    goListFn: (chooseTime, chooseCity, mark) => {
      const arr = getStore('huoche_ChooseCity') || []
      const { from, to } = chooseCity
      if (from === to) {
        Toast.info('出发地和目的地不能一样哦～', 1)
        return
      }
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].from === from && arr[i].to === to) {
          arr.splice(i, 1)
        }
      }
      arr.unshift(chooseCity)
      if (arr.length > 5) {
        arr.splice(5, 1)
      }
      setStore('huoche_ChooseCity', arr) // 这个是历史记录需要的
      setStore('huoche_ChooseCity', chooseCity, 'session') // 这个是下个页面的列表页需要的
      dispatch({ type: 'HUOCHE_INIT' }) // 还原数据
      // 这里是保证新的数据状态
      removeStoreFn()
      removeStore('huoche_details', 'session')
      const channel = getStore('huoche_channel', 'session')
      let withoutDiscountedPric = 5
      const host = location.host
      if (host.indexOf('bsb') < 0 && channel !== 'tongcheng') {
        withoutDiscountedPric = 5
      } else if (host.indexOf('bsb') < 0 && channel === 'tongcheng') {
        withoutDiscountedPric = 3.5
      } else {
        withoutDiscountedPric = 0
      }
      if (mark === 'goGrab') {
        setStore('huoche_ChooseTime', chooseTime, 'session')
        setStore('huoche_withoutDiscountedPrice', withoutDiscountedPric, 'session') // 抢票需要的手续费
        // 这里是保证新的数据状态
        removeStore('TOURISTNUMBER', 'session')
        removeStore('huoche_phone', 'session')
        removeStore('huoche_name', 'session')
        removeStoreAppMore()
        browserHistory.push('/huoche/grabticket?goGrab')
      } else {
        browserHistory.push('/huoche/moredata')
      }
    },
    // 去选择地址页面
    goCitySelect: mark => {
      browserHistory.push(`/huoche/city?${ mark }`)
    },
    // 去订单列表先登录
    myClick: cb => {
      const customerUserId = getStore('customerUserId', 'session')
      // 用户绑定
      if (customerUserId) {
        cb()
      } else {
        login(err => {
          if (err) {
            console.log(err)
            Toast.info('登录失败，请退出重新登录', 2, null, false)
          } else {
            console.log('我是用户绑定')
            cb()
          }
        }, true)
      }
    },
    // 切换供应商
    handleChangeChannel: res => {
      dispatch({ type: 'HUOCHE_CHANNEL', channel: res.brandCode })
      setStore('huoche_channel', res.brandCode, 'session')
      console.log('----test----res-', res)
    },
  }
}

const mapFunToComponent  = dispatch => ({
  componentWillMount: () => {
    // const host = location.host
    // const isAndroid = /(Android)/i.test(navigator.userAgent)
    // if (host && host.indexOf('vipjinrong') >= 0 && isAndroid && !parseQuery(location.search).webview_refresh) {
    //   location.replace(`${ location.href }${ location.search.indexOf('?') >= 0 ? '' : '?' }&webview_refresh=no`)
    // }
    // 用户绑定
    login(err => {
      if (err) {
        console.log(err)
      } else {
        console.log('我是用户绑定')
      }
    })
    // 定位
    getLocationGaode(err => {
      const handleClose = Loading()
      if (err) {
        console.log(err)
        Mask.closeAll()
        location.hash = ''
        dispatch({ type: 'CHOOSE_CITY', nolocation: false })
      } else {
        dispatch({ type: 'CHOOSE_CITY', nolocation: true })
      }
      handleClose()
      Mask.closeAll()
      location.hash = ''
    })
    // 获取历史记录
    const history = getStore('huoche_ChooseCity') || []
    const chooseCitySession = getStore('huoche_ChooseCity', 'session')
    // 显示历史记录
    dispatch({ type: 'HUOCHE_HISTORICAL', history })
    console.log('history---', history)
    if (chooseCitySession) {
      dispatch({ type: 'CHOOSE_CITY', chooseCity: chooseCitySession })
    } else if (history && history.length > 0) {
      const startAndend = {
        from: history[0].from,
        to:   history[0].to,
      }
      dispatch({ type: 'CHOOSE_CITY', chooseCity: startAndend })
    } else {
      const chooseCity = getStore('currentPosition', 'session')
      if (chooseCity) {
        const city = chooseCity.city.replace(/['省', '市', '县', '区']/, '')
        const startAndend = {
          from: city,
          to:   '北京',
        }
        dispatch({ type: 'CHOOSE_CITY', chooseCity: startAndend })
      } else {
        dispatch({ type: 'CHOOSE_CITY', chooseCity: { from: '上海', to: '北京' } })
      }
    }
    // 首页清空数据，时间是现在时间
    const chooseTime = getDateOne()
    dispatch({ type: 'CALENDAR_TIME', chooseTime })
    setStore('huoche_ChooseTime', chooseTime, 'session')
    const nowChecked = getStore('huoche_SpeedRail', 'session')
    if (nowChecked) {
      dispatch({ type: 'NOWCHECHED', nowChecked })
    }
    // 当没有channel的时候
    const channel = getStore('huoche_channel', 'session')
    if (!channel) {
      setStore('huoche_channel', 'tieyou', 'session')
    }
  },
  componentDidMount: () => {
    let LocationAddr = getStore('currentPosition', 'session')
    if (LocationAddr) {
      LocationAddr = LocationAddr.city.replace(/['省', '市', '县', '区']/, '')
      dispatch({ type: 'LOCATION_ADDR', LocationAddr })
    }
  },
  componentWillUnmount: () => {
    // 这里是为了防止列表页的筛选判断 --> 作出措施
    if (getStore('huoche_filiterObj', 'session')) {
      removeStore('huoche_filiterObj', 'session')
    }
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(App)
)
