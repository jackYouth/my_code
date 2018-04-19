import React from 'react'
// import { Popup } from 'antd-mobile'
import { moment, week, setStore } from '@boluome/common-lib'
import { Mask, Loading } from '@boluome/oto_saas_web_app_component'
import { get } from 'business'

import '../style/card.scss'
import timeline from '../img/timeline.png'
// import jiantouR from '../img/jiantou_1.png'

// const Item = List.Item
class Cardtime extends React.Component {
  constructor(props) {
    super(props)
    // const newState = merge(state)(props)
    this.state = {
      ...props,
    }
    this.handlePointTime = this.handlePointTime.bind(this)
    this.handleSumTime = this.handleSumTime.bind(this)
    this.handleEndTime = this.handleEndTime.bind(this)
  }
  componentWillMount() {
    const { ticketDetails, chooseTime } = this.state
    this.handleEndTime(chooseTime, ticketDetails)
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps,
    })
    // 这里是为了接收到前一天或者后一天的时候，到达日期改变
    this.handleEndTime(nextProps.chooseTime, nextProps.ticketDetails)
  }
  // 计算结束时间 的日期
  handleEndTime(chooseTime, ticketDetails) {
    const { duration, startTime } = ticketDetails
    const s = startTime.split(':')
    const ss = s[0] * 1 * 60
    const f = s[1] * 1
    const sum = 24 * 60
    const g = (duration * 1) + ss + f
    if (g >= sum) {
      this.handleSumTime(chooseTime, -1)
    } else {
      this.setState({
        endDate: chooseTime,
      })
      setStore('huoche_endDate', chooseTime, 'session')
    }
  }
  // 判断jie shu
  handleSumTime(timeObj, number) {
    const { date } = timeObj
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
    this.setState({
      endDate: chooseTime,
    })
    setStore('huoche_endDate', chooseTime, 'session')
    console.log('----test2---', chooseTime)
  }
  handlePointTime(ticketDetails) {
    const { chooseTime } = this.state
    const { date } = chooseTime
    const handleClose = Loading()
    const { from, to, number } = ticketDetails
    const stopsUrl = '/huoche/v1/stops'
    const sendData = {
      from,
      to,
      date,
      train_number: number,
    }
    get(stopsUrl, sendData).then(reply => {
      const { code, data, message } = reply
      if (code === 0) {
        Mask(<PointTime stopsData={ data } ticketDetails={ ticketDetails } />, { mask: true, style: { position: 'absolute' } })
      } else {
        console.log('数据请求失败', message)
      }
      handleClose()
    })
    // Mask(<PointTime />, { mask: true, style: { position: 'absolute' } })
  }
  render() {
    const { UserComponent, ticketDetails, chooseTime, endDate, defaultClass = { backgroundColor: '#fff' } } = this.state
    const { from = '', to = '', number, startTime, endTime, duration } = ticketDetails
    const { dateShow, weed } = chooseTime
    // console.log(duration, no, ts, saleTime)
    const cloneProps = this.props
    return (
      <div>
        <div className='cardWrap' style={ defaultClass }>
          <div className='cardItem'>
            <span className='title'>{ from }</span>
            <span className='time'>{ startTime }</span>
            <span className='title checi'>{ dateShow }{ weed }</span>
          </div>
          <div className='cardItem'>
            <span className='title checi'>{ number }</span>
            <span onClick={ () => { this.handlePointTime(ticketDetails) } }><img src={ timeline } alt='' /></span>
            <span className='title'>{ `${ Math.floor(duration / 60) }时${ Math.floor(duration % 60) }分` }</span>
          </div>
          <div className='cardItem'>
            <span className='title'>{ to }</span>
            <span className='time'>{ endTime }</span>
            <span className='title checi'>{ endDate.dateShow }{ endDate.weed }</span>
          </div>
        </div>
        { React.cloneElement(UserComponent, { ...cloneProps }) }
      </div>
    )
  }
}

export default Cardtime

const PointTime = ({ stopsData, ticketDetails }) => {
  const { from, to } = ticketDetails
  return (
    <div className='pointTime'>
      <p className='title'>时刻表</p>
      <div className='menu'>
        <span>到站</span>
        <span className='menuSpanMid'>到达</span>
        <span className='menuSpanMid'>发车</span>
        <span className='menuSpanLast'>停留</span>
      </div>
      <div className='list'>
        {
          stopsData.map(item => (
            <div className={ `item ${ from === item.name || to === item.name ? 'itemOrgan' : '' }` } key={ `${ item.name + item.arriveTime }` }>
              <span>{ item.name }</span>
              <span className='menuSpanMid'>{ item.arriveTime }</span>
              <span className='menuSpanMid'>{ item.startTime }</span>
              <span className='menuSpanLast'>{ item.stopTime }</span>
            </div>
          ))
        }
      </div>
    </div>
  )
}
