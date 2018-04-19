import React from 'react'
import { removeStore, moment, getStore, setStore } from '@boluome/common-lib'
import { List, Icon, Picker } from 'antd-mobile'

import '../styles/flight.scss'

export default class Flight extends React.Component {
  constructor(props) {
    super(props)
    const { flightNo, estimatePara } = props
    console.log('estimatePara', estimatePara)
    let flightHistorys = getStore('flightHistorys') ? getStore('flightHistorys') : []
    flightHistorys = flightHistorys.slice(0, 2)
    const currentDate = estimatePara.flightDate
    this.state = {
      currentDate,
      flightNo,
      flightHistorys,
    }
    this.handleChangeDate = this.handleChangeDate.bind(this)
    this.handleHistoryClick = this.handleHistoryClick.bind(this)
    this.handleIptChange = this.handleIptChange.bind(this)
    this.handleClearHistorys = this.handleClearHistorys.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
  }

  handleChangeDate(currentDate) {
    this.setState({ currentDate })
  }

  handleChangePoint(currentDate) {
    this.setState({ currentDate })
  }

  handleHistoryClick(flightNo) {
    this.setState({ flightNo })
  }

  handleIptChange(e) {
    const flightNo = e.target.value.trim()
    this.setState({ flightNo })
  }

  handleClearHistorys() {
    this.setState({ flightHistorys: [] })
    removeStore('flightHistorys')
  }

  handleConfirm(flightNo, flightDate) {
    const { handleContainerClose, handleSeletedFlightNo, canPlace, estimatePara, currentProduct } = this.props
    let { flightHistorys } = this.state
    console.log('flightHistorys111', flightHistorys)
    flightHistorys = flightHistorys.filter(res => res !== flightNo)
    console.log('flightHistorys222', flightHistorys)
    if (flightNo) flightHistorys.unshift(flightNo)
    setStore('flightHistorys', flightHistorys)
    this.setState({ flightHistorys })
    handleSeletedFlightNo(flightNo, flightDate, canPlace, estimatePara, currentProduct)
    handleContainerClose()
  }
  handleTimeClick(pickerVisible) {
    this.setState({ pickerVisible })
  }

  render() {
    const { flightNo, currentDate, multipleFlight = false, flightHistorys, pickerVisible } = this.state
    const { dates } = this.props
    const ListItem = List.Item
    const canPlace = flightNo !== '' && currentDate
    console.log('flightHistorys', flightHistorys, currentDate)
    return (
      <div className='flight'>
        <h1 className='flight-title'>请您输入航班号和起飞时间</h1>
        <List>
          <ListItem className='plane-come'>
            <span className='left'>航班号：</span>
            <input placeholder='请输入航班号，如MU1898' value={ flightNo } onChange={ this.handleIptChange } />
          </ListItem>
          <ListItem className='flight-time' onClick={ () => this.handleTimeClick(!pickerVisible) }>
            <p>
              起飞时间：
              {
                currentDate ?
                  <span className='selected'>{ currentDate }</span> :
                  <span>请选择航班起飞时间(当地时间)</span>
              }
            </p>
          </ListItem>
        </List>

        <Picker
          visible={ pickerVisible }
          data={ dates }
          title='当地起飞时间'
          value={ currentDate }
          cols={ 1 }
          onChange={ this.handleChangeDate }
          onOk={ () => this.handleTimeClick(false) }
          onDismiss={ () => this.handleTimeClick(false) }
        />
        {
          Array.isArray(flightHistorys) && flightHistorys.length > 0 &&
          <div className='flight-historys'>
            <h1>历史记录</h1>
            <ul>
              {
                flightHistorys.map(item => <li key={ item } onClick={ () => this.handleHistoryClick(item) }>{ item }</li>)
              }
            </ul>
            <div className='clear-historys' onClick={ this.handleClearHistorys }>
              <Icon type={ require('svg/yongche/del.svg') } size='xxs' />
              <span>清除历史记录</span>
            </div>
          </div>
        }
        {
          multipleFlight &&
          <Picker
            data={ dates }
            title='请选择起终点'
            value={ currentDate }
            cols={ 1 }
            onChange={ canPlace ? this.handleChangeDate : '' }
          >
            <div className='s-button bottom'>
              <p className={ canPlace ? 'active' : '' }>确定</p>
            </div>
          </Picker>
        }
        {
          !multipleFlight &&
          <div className='s-button bottom' onClick={ canPlace ? () => this.handleConfirm(flightNo, currentDate) : '' }>
            <p className={ canPlace ? 'active' : '' }>确定</p>
          </div>
        }
      </div>
    )
  }
}

let dates = [
  { name: '昨天', date: `${ moment('YYYY-MM-DD')(new Date((new Date()).getTime() - (1000 * 60 * 60 * 24))) }` },
  { name: '今天', date: `${ moment('YYYY-MM-DD')(new Date()) }` },
  { name: '明天', date: `${ moment('YYYY-MM-DD')(new Date((new Date()).getTime() + (1000 * 60 * 60 * 24))) }` },
  { name: '后天', date: `${ moment('YYYY-MM-DD')(new Date((new Date()).getTime() + (1000 * 60 * 60 * 24 * 2))) }` },
]
dates = dates.map(item => ({ label: `${ item.name } ${ item.date }`, value: `${ item.date }` }))

Flight.defaultProps = {
  dates,
  flightNo: 'uu',
}
