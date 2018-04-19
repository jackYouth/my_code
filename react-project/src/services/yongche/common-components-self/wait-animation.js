/*
  bug：计时只能提供60min
*/

import React from 'react'
import { moment, setStore, getStore } from '@boluome/common-lib'

export default class WaitAnimation extends React.Component {
  constructor(props) {
    super(props)
    const { waitTimerName, noDriverResponse } = props
    this.setTimer = this.setTimer.bind(this)
    this.closeTimes = this.closeTimes.bind(this)
    this.getGapMS = this.getGapMS.bind(this)
    const gapMS = this.getGapMS()
    this.state = { waitTime: `${ gapMS[0] }:${ gapMS[1] }` }
    if (!noDriverResponse) {
      this.setTimer(waitTimerName, gapMS[0], gapMS[1])
    }
  }
  getGapMS() {
    const { createdAt } = this.props
    // const id = location.pathname.split('/')[3]
    // 计算出开始的分和秒
    const currentDate = moment('YYYY-MM-DD HH:mm:ss')(new Date())
    const currentH = currentDate.split(' ')[1].split(':')[0]
    const currentM = currentDate.split(':')[1]
    const currentS = currentDate.split(':')[2]
    // const startTime = getStore(`startTime_${ id }`) ? getStore(`startTime_${ id }`) : moment('YYYY-MM-DD HH:mm:ss')(createdAt)
    const startTime = moment('YYYY-MM-DD HH:mm:ss')(createdAt)
    const startH = startTime.split(' ')[1].split(':')[0]
    const startM = startTime.split(':')[1]
    const startS = startTime.split(':')[2]
    let h = currentH - startH
    let m = currentM - startM
    let s = currentS - startS
    // 当h差值小于0时，说明当前时间已进入下一天，此时需要给h加上24
    if (h < 0) {
      h += 24
    }
    m += 60 * h
    // 当s小于0时，说明分钟已进入下一分钟，此时给s加60， m减 1
    if (s < 0) {
      m--
      s += 60
    }
    // console.log('m', m, currentM, startM, currentS, startS)
    if (m < 10) m = `0${ Math.round(m) }`
    if (s < 10) s = `0${ Math.round(s) }`
    // 刚下单进入倒计时时，有几率出现下单时间在当前时间之前的情况，这时m为-1math.around之后就是nan报错, 因为这种情况只会在一开始时出现，所以默认给00:00
    if (isNaN(m)) {
      m = '00'
      s = '00'
    }
    return [m, s]
  }
  componentWillReceiveProps(nextprops) {
    const { waitTimerName, noDriverResponse } = nextprops
    if (noDriverResponse) {
      this.closeTimes(waitTimerName)
      // 设置一个满圆
      this.createCircle(3.5, '#ffab00')
      return
    }

    const PreWaitTimerName = this.props.waitTimerName
    const preTimer = getStore('preTimer', 'session')
    // 仅当 当前订单计时器不存在 当前订单和上一个订单是同一个订单，且当前订单的状态发生改变时，才去重新新建一个定时器（对应取消订单后在进入时只有一个定时器，页面切换之后，定时器的值会发生变化）
    if (!this[waitTimerName] && this[waitTimerName] !== preTimer && waitTimerName === PreWaitTimerName) {
      console.log('PreWaitTimerName', PreWaitTimerName, waitTimerName)
      // 清除上一个props的定时器
      clearInterval(this[PreWaitTimerName])
      // 开启另一个定时器
      const gapMS = this.getGapMS()
      this.state = { waitTime: `${ gapMS[0] }:${ gapMS[1] }` }
      this.setTimer(waitTimerName, gapMS[0], gapMS[1])
      setStore('preTimer', this[waitTimerName], 'session')
    }
  }
  componentDidMount() {
    if (this.canvas) {
      this.cxt = this.canvas.getContext('2d')
      // 设置一个底色圆
      this.createCircle(3.5, '#e5e5e5')

      const { noDriverResponse } = this.props
      if (noDriverResponse) { // 设置一个满圆
        this.createCircle(3.5, '#ffab00')
        return
      }
      // 设置一个动态圆
      let endDeg = 1.5
      this.circleTimer = setInterval(() => {
        endDeg += 0.01
        if (endDeg.toFixed(2) === '3.51') {
          endDeg = 1.51
          this.cxt.clearRect(0, 0, 1600, 1600)
          // 设置一个底色圆
          this.createCircle(3.5, '#e5e5e5')
        }
        this.createCircle(endDeg, '#ffab00')
      }, 10)
      return true
    }
    return false
  }
  setTimer(waitTimerName, m = 0, s = 0) {  // 设置一个定时器，进行计时
    let waitSec = s
    let waitMin = m
    let waitTime = '00:00'
    this[waitTimerName] = setInterval(() => {
      waitSec++
      if (waitSec === 60) {
        waitMin = Number(waitMin)
        waitMin += 1
        waitSec = 0
      }
      if (waitSec < 10) waitSec = `0${ Math.round(waitSec) }`
      if (waitMin < 10) waitMin = `0${ Math.round(waitMin) }`
      waitTime = `${ waitMin }:${ waitSec }`
      this.setState({ waitTime })
      // if (waitTime === '30:00') this.closeTimes(waitTimerName)
    }, 1000)
  }
  // 只有当请求会的订单状态变成无司机接单时，才关闭定时器
  closeTimes(waitTimerName) {
    clearInterval(this[waitTimerName])
    this[waitTimerName] = null
    clearInterval(this.circleTimer)
    // 清除原有图案，画出一个整圆
    this.cxt.clearRect(0, 0, 1600, 1600)
    this.createCircle(3.5, '#ffab00')
  }
  createCircle(deg, color) {
    this.cxt.beginPath()
    this.cxt.arc(300, 300, 180, Math.PI * 1.5, Math.PI * deg, false)
    this.cxt.lineWidth = 2
    this.cxt.strokeStyle = color
    this.cxt.stroke()
  }
  componentWillUnmount() {
    const { waitTimerName } = this.props
    clearInterval(this[waitTimerName])
    this[waitTimerName] = null
    clearInterval(this.circleTimer)
    console.log(898989898989)
  }
  render() {
    const titleStyle = {
      marginTop: '-245px',
    }
    const { waitTime } = this.state
    const { noDriverResponse } = this.props
    return (
      <div className='wait-animation'>
        <h1 className='wait-title' style={ titleStyle }>{ noDriverResponse ? '未找到车辆，订单已自动取消' : '正在为您寻找车辆' }</h1>
        <canvas id='canvas' width='600' height='600' ref={ node => this.canvas = node } />
        <div className='wait-status'>
          <p className='wait-name'>已等待</p>
          <p className='wait-time'>{ waitTime }</p>
        </div>
      </div>
    )
  }
}
// 旋转的点，但是不容易同步上
// const pStyle = {
//   transformOrigin: '6px 185px',
//   height:          '10px',
//   width:           '10px',
//   marginTop:       '-185px',
//   marginLeft:      '-5px',
// }
// <p className='fill-point' style={ pStyle } />
