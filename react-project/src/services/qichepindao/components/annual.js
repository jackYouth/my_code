
import React, { Component } from 'react'
import { List, DatePicker } from 'antd-mobile'
// import getDateArr from './getDate'
import moment from 'moment'

import '../style/editCar.scss'

const Item = List.Item

export default class AnnualCom extends Component {
  static defaultProps = {
  }
  constructor(props) {
    super(props)
    this.state = {
      ...props,
      value: this.props.value ? this.props.value : '请选择年检日期',
    }
    this.handleChangeval = this.handleChangeval.bind(this)
  }

  componentWillMount() {
    // 数据还原
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    // 重置
  }
  handleChangeval(value) {
    const { handleTimevalue, isShow, appdata } = this.props
    const m = `${ value.month() + 1 }`
    const timeVal = `${ value.year() }-${ m > 9 ? m : `0${ m }` }`
    if (isShow) {
      handleTimevalue(timeVal)
    } else {
      handleTimevalue(timeVal, appdata)
    }
    this.setState({
      value: timeVal,
    })
  }
  render() {
    const { isShow = true, value = '请选择年检日期', remainingTime = '', time, visible } = this.state
    const minDate = moment(new Date(), 'YYYY-MM').utcOffset(8)
    const spanStyle = {
      fontSize: '0.22rem',
      color:    '#666',
      display:  'inlineBlock',
    }
    console.log('---test--remainingTime-', remainingTime, time, visible)
    return (
      <DatePicker
        mode='month'
        title='设置年检有效期'
        extra={ isShow ? `${ value }` : ('') }
        minDate={ minDate }
        onChange={ v => this.handleChangeval(v) }
        className='annualClass'
      >
        {
          isShow ? (<Item arrow='horizontal'>年检日期</Item>) : (<Item arrow='empty'><span style={ spanStyle }>年检倒计时</span></Item>)
        }
      </DatePicker>
    )
  }
}
