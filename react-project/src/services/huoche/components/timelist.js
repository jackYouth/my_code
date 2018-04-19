import React from 'react'
import { Icon } from 'antd-mobile'
import { Calendar, Mask, SlidePage } from '@boluome/oto_saas_web_app_component'
import { week, moment, setStore } from '@boluome/common-lib'

import '../style/timelist.scss'
import jiantouL from '../img/jiantou.png'
import jiantouR from '../img/jiantou_1.png'
import xialaIcon from '../img/xiala.svg'

// const Item = List.Item
class Timelist extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      close: false,
      ...props,
    }
    this.handleCalendarDate = this.handleCalendarDate.bind(this)
    this.handleGoChooseTime = this.handleGoChooseTime.bind(this)
    this.handleTremDate = this.handleTremDate.bind(this)
    this.handleProNextTime = this.handleProNextTime.bind(this)
  }
  componentWillMount() {
    this.handleTremDate()
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps,
    })
  }
  componentWillUnmount() {
    const node = document.getElementsByClassName('mask-container')
    if (node.length > 0) {
      node[0].remove()
    }
  }
  // 处理前一天，后一天的时间段限制
  handleTremDate() {
    const D = new Date()
    const year = D.getFullYear()
    const month = D.getMonth() + 1
    const day = D.getDate()
    D.setFullYear(year, month - 1, day + 60)
    // const dateObj = D.toLocaleDateString()
    const dateObj = `${ D.getFullYear() }/${ D.getMonth() + 1 }/${ D.getDate() }`
    const date = `${ year }-${ month }-${ day }`
    const datestr = moment('x')(date)
    const nextDatestr = dateObj.replace(/\//g, '-')
    this.setState({
      todayDatestr: datestr,
      nextDatestr:  moment('x')(nextDatestr),
    })
  }
  // 处理日历返回的日期
  handleCalendarDate(res) {
    // console.log('hhh--', res)
    const { onChangeTime } = this.props
    Mask.closeAll()
    location.hash = ''
    const { date, datestr } = res
    const time = `${ date.split('-')[1] }月${ date.split('-')[2] }日`
    const weed = week()(moment('day')(date))
    // const dateKJIN = `${ date.split('-')[0] }-${ date.split('-')[1] > 9 ? date.split('-')[1] : `0${ date.split('-')[1] }` }-${ date.split('-')[2] }`
    const chooseTime = {
      dateShow: time,
      datestr,
      weed,
      date,
    }
    setStore('huoche_ChooseTime', chooseTime, 'session')
    // 反向改变props里面的时间日期
    onChangeTime(chooseTime)
    this.setState({
      chooseTime,
    })
  }
  // 处理前一天，后一天的日期
  handleProNextTime(timeObj, number) {
    const { date } = timeObj
    const { onChangeTime, gethandleFilter, filiterObj, scheduleslist } = this.props
    const datesplit = date.split('-')
    const nextdate = new Date()
    nextdate.setFullYear(datesplit[0], (datesplit[1] * 1) - 1, (datesplit[2] * 1) - number)
    // const dateObj = nextdate.toLocaleDateString()
    const dateObj = `${ nextdate.getFullYear() }/${ nextdate.getMonth() + 1 }/${ nextdate.getDate() }`
    const time = dateObj.replace(/\//g, '-')
    const m = `${ dateObj.split('/')[1] > 9 ? dateObj.split('/')[1] : `0${ dateObj.split('/')[1] }` }`
    const d = dateObj.split('/')[2] > 9 ? dateObj.split('/')[2] : `0${ dateObj.split('/')[2] }`
    const t = `${ dateObj.split('/')[0] }-${ m }-${ d }`
    const dateShow = `${ m }月${ d }日`
    const weed = week()(moment('day')(time))
    const datestr = moment('x')(time)
    const chooseTime = {
      date: t,
      weed,
      datestr,
      dateShow,
    }
    setStore('huoche_ChooseTime', chooseTime, 'session')
    onChangeTime(chooseTime, gethandleFilter, filiterObj, scheduleslist)
  }
  // 进行日历里面的日期选择  ---待优化
  handleGoChooseTime() {
    Mask(
      <SlidePage target='left' showClose={ false } >
        <Calendar onChange={ res => this.handleCalendarDate(res) } untilDay={ 60 } vipDay={ 28 } />
      </SlidePage>
    , { mask: false, style: { position: 'absolute' } })
  }
  render() {
    const { chooseTime, todayDatestr, nextDatestr } = this.state
    const { weed, dateShow, datestr } = chooseTime
    return (
      <div className='timeList'>
        {
          todayDatestr >= datestr ? (
            <div className='time_l timeoto'><img src={ jiantouL } alt='' /><span>前一天</span></div>) : (<div className='time_l' onClick={ () => this.handleProNextTime(chooseTime, 1) }><img src={ jiantouL } alt='' /><span>前一天</span></div>)
        }
        <div className='time_c' onClick={ () => { this.handleGoChooseTime() } }>{ dateShow }{ weed }<span className='addIcon'><Icon type={ xialaIcon } /></span></div>
        {
          nextDatestr <= datestr ? (
            <div className='time_r timeoto'><span>后一天</span><img src={ jiantouR } alt='' /></div>) : (<div className='time_r' onClick={ () => this.handleProNextTime(chooseTime, -1) }><span>后一天</span><img src={ jiantouR } alt='' /></div>)
        }
      </div>
    )
  }
}

export default Timelist
