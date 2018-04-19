
import React, { Component } from 'react'
import { List, DatePicker, Modal } from 'antd-mobile'
// import getDateArr from './getDate'
import moment from 'moment'

import '../style/editCar.scss'

const Item = List.Item
const alert = Modal.alert
export default class AnnualComApp extends Component {
  static defaultProps = {
  }
  constructor(props) {
    super(props)
    let visible = true
    if (this.props.time) {
      visible = false
    }
    this.state = {
      ...props,
      value: this.props.value ? this.props.value : '请选择年检日期',
      visible,
    }
    this.handleChangeval = this.handleChangeval.bind(this)
    this.handleAlertFn = this.handleAlertFn.bind(this)
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
  handleAlertFn() {
    alert('须知', '您已经完成了车辆年检?完成年检确认后，可设置下一轮年检提醒', [
      {
        text:    '取消',
        onPress: () => {
          this.setState({
            visible: false,
          })
        },
      },
      {
        text:    '确定',
        onPress: () => {
          console.log('is  will?')
          this.setState({
            visible: true,
          })
        },
        style:   { fontWeight: 'bold', color: '#ffab00' },
      },
    ])
  }
  render() {
    const { isShow = true, value = '请选择年检日期', visible } = this.state
    const minDate = moment(new Date(), 'YYYY-MM').utcOffset(8)
    const spanStyle = {
      fontSize: '0.22rem',
      color:    '#666',
      display:  'inlineBlock',
    }
    return (
      <div>
        <DatePicker
          mode='month'
          title='设置年检有效期'
          extra={ isShow ? `${ value }` : ('') }
          minDate={ minDate }
          visible={ visible }
          onDismiss={ () => this.setState({ visible: false }) }
          onChange={ v => this.handleChangeval(v) }
          className='annualClass'
        >
          {
            isShow ? (<Item arrow='horizontal'>年检日期</Item>) : (<Item onClick={ () => this.handleAlertFn() } arrow='empty'><span style={ spanStyle }>年检倒计时</span></Item>)
          }
        </DatePicker>
      </div>
    )
  }
}
