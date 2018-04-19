/*
  参数：
    1，endTime ：传入一个结束时间的时间戳，返回距现在的 天数-时数-分数-秒数
    2，timeHeader： 返回时间前面的文案， 非必传
    3，timeAfter： 返回时间后面的文案， 非必传
    4，delDay： 不需要返回天数， 非必传
    5,justData: 仅使用时间，不夹杂任何数据的组件， 非必传
  返回值：
    xx天xx时xx分xx秒
*/

import React from 'react'

export default class CountDown extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      day:  '',
      hour: '',
      min:  '',
      s:    '',
    }
    this.calculatinTime = this.calculatinTime.bind(this)
  }
  componentWillMount() {
    const { endTime } = this.props
    this.countdown = setInterval(() => this.calculatinTime(endTime), 1000)
  }
  calculatinTime(endTime) {
    // 将一位数字前面自动加0
    const normalTime = dd => (String(dd).length === 1 ? `0${ dd }` : dd)

    const times = parseInt((endTime - (new Date()).getTime()) / 1000, 10)
    const s = normalTime(times % 60)
    const min = normalTime(parseInt(times / 60, 10) % 60)
    const hour = normalTime(parseInt(times / 60 / 60, 10) % 24)
    const day = parseInt(times / 60 / 60 / 24, 10)
    this.setState({ day, hour, min, s })
    // return `${ day }-${ hour }-${ min }-${ s }`
  }
  componentWillUnmount() {
    clearInterval(this.countdown)
  }
  render() {
    const { day, hour, min, s } = this.state
    const { timeHeader = '', timeAfter = '', delDay = false, justData = false } = this.props
    if (!day && !hour && !min && !s) return <span />
    const { className } = this.props

    // 如果倒计时已结束
    if (delDay && hour < 0) {
      return <span className={ className }>已结束</span>
    }

    // 如果是仅使用时间的模式
    if (justData) {
      return (
        <p className={ className }>
          {
            !delDay &&
            <span>{ day }</span>
          }
          <span>{ hour }</span>
          <span>{ min }</span>
          <span>{ s }</span>
        </p>
      )
    }
    return (
      <span className={ className }>{ delDay ? `${ timeHeader }${ hour }时${ min }分${ s }秒${ timeAfter }` : `${ timeHeader }${ day }天${ hour }时${ min }分${ s }秒${ timeAfter }` }</span>
    )
  }
}
