import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { wrap }    from '@boluome/oto_saas_web_app_component'
import { setStore, getStore } from '@boluome/common-lib'
import Moredata         from '../components/moredata'
import { scheduleslistFn } from '../actions/moredata'
import { removeStoreFn, removeStoreAppMore } from '../actions/order'

let reTop = 0

const mapStateToProps = state => {
  const { moredata, app } = state
  // const { scheduleslist, scheduleslistFilter, chooseTime, chooseCity, botShow,
  //   votesORprice, defiliterObj, filiterObj, isDrua, isTime, gethandleFilter,
  //   oRisTime, oRisDrua, iSconditions, nowChecked, nolist, notOnceList,
  // } = moredata
  const { cityHot, LocationAddr } = app
  return {
    ...moredata,
    cityHot,
    LocationAddr,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    // 去选择地址页面
    goCitySelect: mark => {
      browserHistory.push(`/huoche/city?${ mark }`)
    },
    handleCheckedFn: v => {
      console.log(v)
      if (v === true) {
        dispatch({ type: 'NOWCHECHED', nowChecked: false })
      }
    },
    // 当日历选择了日期，逆向改变props
    onChangeTime: (time, gethandleFilter, filiterObj, scheduleslist) => {
      dispatch({ type: 'CALENDAR_TIME', chooseTime: time })
      const chooseCity = getStore('huoche_ChooseCity', 'session')
      dispatch({ type: 'CHOOSE_CITY', chooseCity })
      dispatch(scheduleslistFn(time, chooseCity, filiterObj, gethandleFilter))
      dispatch({ type: 'IS_DRUA_TIME', oRisDrua: false, oRisTime: false })
      console.log(scheduleslist)
    },
    // 监听滚动，底部footer
    handleListScroll: (top, botShow) => {
      // console.log(top, botShow)
      const num = top - reTop
      if (num > 0 && botShow) {
        dispatch({ type: 'BOTTOM_SHOW', botShow: false })
      } else if (num < 0 && !botShow) {
        dispatch({ type: 'BOTTOM_SHOW', botShow: true })
      }
      reTop = top
    },
    // 处理余票或者价格筛选
    handleMoreVotes: votesORprice => {
      if (votesORprice === 'price') {
        dispatch({ type: 'MORE_VOTES_PRICE', votesORprice: 'yupiao' })
      } else {
        dispatch({ type: 'MORE_VOTES_PRICE', votesORprice: 'price' })
      }
    },
    // 处理时长的筛选
    handleDurationFilter: (scheduleslist, isDrua, scheduleslistFilter, gethandleFilter) => {
      let arr = []
      if (gethandleFilter) {
        arr = scheduleslistFilter
      } else {
        arr = scheduleslist
      }
      // const arr = scheduleslist
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
          const pro = arr[j].duration * 1
          const next = arr[j + 1].duration * 1
          if (pro > next) {
            const temp = arr[j + 1]
            arr[j + 1] = arr[j]
            arr[j] = temp
          }
        }
      }
      if (isDrua === false) {
        isDrua = true
        dispatch({ type: 'KJIN_SCHEDULES', scheduleslistFilter: arr })
      } else {
        isDrua = false
        dispatch({ type: 'KJIN_SCHEDULES', scheduleslistFilter: arr.reverse() })
      }
      dispatch({ type: 'IS_DRUA_TIME', isDrua, oRisDrua: true, oRisTime: false })
    },
    // 处理时间早晚的筛选
    handleTimeFilter: (scheduleslist, isTime, scheduleslistFilter, gethandleFilter) => {
      let timeArr = []
      if (gethandleFilter) {
        timeArr = scheduleslistFilter
      } else {
        timeArr = scheduleslist
      }
      // const timeArr = scheduleslist
      for (let i = 0; i < timeArr.length; i++) {
        for (let j = 0; j < timeArr.length - 1 - i; j++) {
          const pro = timeArr[j].startTime.replace(':', '')
          const next = timeArr[j + 1].startTime.replace(':', '')
          if (pro > next) {
            const temp = timeArr[j + 1]
            timeArr[j + 1] = timeArr[j]
            timeArr[j] = temp
          }
        }
      }
      if (isTime === false) {
        isTime = true
        dispatch({ type: 'KJIN_SCHEDULES', scheduleslistFilter: timeArr })
      } else {
        isTime = false
        dispatch({ type: 'KJIN_SCHEDULES', scheduleslistFilter: timeArr.reverse() })
      }
      dispatch({ type: 'IS_DRUA_TIME', isTime, oRisTime: true, oRisDrua: false })
    },
    // 处理多条件筛选的结果渲染
    handleFilterResult: (filiterObj, data, defiliterObj) => {
      console.log('--defiliterObj--', defiliterObj)
      dispatch({ type: 'KJIN_SCHEDULES', scheduleslistFilter: data })
      const arr = ['trainline', 'fromTime', 'toTime', 'fromArr', 'toArr']
      let a = arr.map(o => filiterObj[o].filter(i => i.choose === true))
      a = a.filter(k => k.length > 0)
      if (a.length === 0) {
        dispatch({ type: 'KJIN_FILTEROBJ', filiterObj, iSconditions: false })
      } else {
        dispatch({ type: 'KJIN_FILTEROBJ', filiterObj, iSconditions: true })
      }
      if (data && data.length === 0) {
        dispatch({ type: 'KJIN_SCHEDULES', nolist: false })
      } else {
        dispatch({ type: 'KJIN_SCHEDULES', nolist: true })
      }
      setStore('huoche_filiterObj', filiterObj, 'session')
    },
    // 这里是为了获取到筛选的方法---即可以调用
    filterFn: (fun, obj) => {
      console.log('getfunction', fun, obj)
      dispatch({ type: 'GET_FILTER_FN', gethandleFilter: fun })
      setStore('huoche_filterFunction', fun, 'session')
    },
    goListFn: () => {
      browserHistory.push('/huoche/moredata')
    },
    goDetails: (item, ChangeSign) => {
      setStore('huoche_details', item, 'session')
      if (ChangeSign) {
        browserHistory.push('/huoche/details?ChangeSign')
      } else {
        browserHistory.push('/huoche/details')
      }
    },
    // 到抢票页面
    goGrabticket: (chooseTime, chooseCity) => {
      setStore('huoche_ChooseCity', chooseCity, 'session') // 这个是下个页面的列表页需要的
      setStore('huoche_ChooseTime', chooseTime, 'session')
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
      setStore('huoche_withoutDiscountedPrice', withoutDiscountedPric, 'session') // 抢票需要的手续费
      // 这里是保证新的数据状态
      removeStoreFn()
      removeStoreAppMore()
      browserHistory.push('/huoche/grabticket?goGrab')
    },
    // 变更到站---修改到站地址
    handleChangeStation: (result, city, chooseTime) => {
      console.log('result, result', result.name)
      if (result) {
        const { from } = city
        const chooseCity = {
          from,
          to: result.name,
        }
        dispatch({ type: 'CHOOSE_CITY', chooseCity })
        dispatch(scheduleslistFn(chooseTime, chooseCity))
        setStore('huoche_ChooseCity', chooseCity, 'session')
      }
    },
  }
}

const mapFunToComponent  = (dispatch, state) => ({
  componentWillMount: () => {
    // 判断是改签还是正常下单
    const search = location.search
    console.log('search--', search)
    dispatch({ type: 'CHANGE_URL', ChangeSign: search })
    const chooseTime = getStore('huoche_ChooseTime', 'session')
    if (!state.scheduleslistFilter || state.chooseTime !== chooseTime) { // 这里是处理物理返回键再次加载数据
      console.log('测试回退键问题', state, getStore('huoche_ChooseTime', 'session'))
      const chooseCity = getStore('huoche_ChooseCity', 'session')
      const filiterObj = getStore('huoche_filiterObj', 'session')
      // const gethandleFilter = getStore('huoche_filterFunction', 'session')
      dispatch({ type: 'CALENDAR_TIME', chooseTime })
      if (filiterObj) {
        dispatch({ type: 'KJIN_FILTEROBJ', filiterObj })
      }
      if (search && chooseCity) {
        const { from, to } = chooseCity
        document.title = `${ from }-${ to }(改签)`
      }
      dispatch({ type: 'CHOOSE_CITY', chooseCity })
      dispatch(scheduleslistFn(chooseTime, chooseCity))
    }
  },
  componentDidMount: () => {
    const nowChecked = getStore('huoche_SpeedRail', 'session')
    if (nowChecked) {
      dispatch({ type: 'NOWCHECHED', nowChecked })
    }
  },
  componentWillUnmount: () => {
    const node = document.getElementsByClassName('mask-container')
    if (node.length > 0) {
      node[0].remove()
    }
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Moredata)
)
