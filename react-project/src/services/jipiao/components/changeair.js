import React, { Component } from 'react'
import { Icon, Modal } from 'antd-mobile'
import { getStore, setStore } from '@boluome/common-lib'
import { get } from 'business'
import { Mask, SlidePage, Calendar, Loading }    from '@boluome/oto_saas_web_app_component'
import feiji from '../img/feiji.png'
import '../style/air.scss'

const alert = Modal.alert
let timeOut = ''
let reTop = 0
// 航班列表
class Changeair extends Component {
  constructor(props) {
    super(props)
    const { airdata } = props
    this.state = {
      airdata,
      timeSort:  '',
      priceSort: '',
      botShow:   true,
      date:      getStore('changeDate', 'session'),
    }
    this.handleTime = this.handleTime.bind(this)
    this.handleSort = this.handleSort.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  handleTime(date) {
    const datesplit = date.split('-')
    const nextdate = new Date()
    nextdate.setFullYear(datesplit[0], (datesplit[1] * 1) - 1, datesplit[2])
    const datestr = nextdate.toLocaleDateString()
    setStore('changeDate', datestr.replace(/\//g, '-'), 'session')
    this.getAirdata()
  }

  handleSort(timeSort, priceSort, nowSort, airdata) {
    if (nowSort === 'timeSort') {
      priceSort = ''
      if (typeof timeSort === 'boolean') {
        timeSort = !timeSort
      } else {
        timeSort = true
      }
      if (timeSort) {
        for (let i = 0; i < airdata.length; i++) {
          for (let j = 0; j < airdata.length - 1 - i; j++) {
            const pro = parseInt(airdata[j].departureTime.replace(':', ''), 10)
            const next = parseInt(airdata[j + 1].departureTime.replace(':', ''), 10)
            if (pro > next) {
              const temp = airdata[j + 1]
              airdata[j + 1] = airdata[j]
              airdata[j] = temp
            }
          }
        }
      } else {
        for (let i = 0; i < airdata.length; i++) {
          for (let j = 0; j < airdata.length - 1 - i; j++) {
            const pro = parseInt(airdata[j].departureTime.replace(':', ''), 10)
            const next = parseInt(airdata[j + 1].departureTime.replace(':', ''), 10)
            if (pro < next) {
              const temp = airdata[j + 1]
              airdata[j + 1] = airdata[j]
              airdata[j] = temp
            }
          }
        }
      }
    } else if (nowSort === 'priceSort') {
      timeSort = ''
      if (typeof priceSort === 'boolean') {
        priceSort = !priceSort
      } else {
        priceSort = true
      }
      if (priceSort) {
        for (let i = 0; i < airdata.length; i++) {
          for (let j = 0; j < airdata.length - 1 - i; j++) {
            if (airdata[j].barePrice > airdata[j + 1].barePrice) {
              const temp = airdata[j + 1]
              airdata[j + 1] = airdata[j]
              airdata[j] = temp
            }
          }
        }
      } else {
        for (let i = 0; i < airdata.length; i++) {
          for (let j = 0; j < airdata.length - 1 - i; j++) {
            if (airdata[j].barePrice < airdata[j + 1].barePrice) {
              const temp = airdata[j + 1]
              airdata[j + 1] = airdata[j]
              airdata[j] = temp
            }
          }
        }
      }
    }
    this.setState({ timeSort, priceSort, airdata })
  }

  getAirdata() {
    const handleClose = Loading()
    get('/jipiao/v1/change/list', {
      channel:    getStore('channel', 'session'),
      orderNo:    getStore('changeOrderNo', 'session'),
      changeDate: getStore('changeDate', 'session'),
      code:       getStore('changeCode', 'session'),
    })
    .then(({ code, data, message }) => {
      handleClose()
      reTop = 0
      if (code === 0) {
        console.log(data)
        this.setState({ airdata: data, date: getStore('changeDate', 'session'), botShow: true })
      } else {
        console.log(message)
        this.setState({ airdata: [], date: getStore('changeDate', 'session'), botShow: false })
      }
    })
  }

  componentWillMount() {
    this.getAirdata()
    timeOut = setTimeout(() => {
      alert('', '航班信息可能已过期，请重新搜索', [
        {
          text:    '确定',
          onPress: () => {
            const { airdata } = this.props
            this.setState({
              airdata,
              timeSort:  '',
              priceSort: '',
              botShow:   true,
              date:      getStore('changeDate', 'session'),
            })
            this.getAirdata()
          },
        },
      ])
    }, 600000)
  }

  componentWillUnmount() {
    clearTimeout(timeOut)
  }

  handleClose(data) {
    const { timeClose, handleChangeflight, handleContainerClose } = this.props
    handleChangeflight(data)
    timeClose()
    handleContainerClose()
  }

  handleScroll(top, botShow) {
    const num = top - reTop
    if (num > 0 && botShow) {
      this.setState({ botShow: false })
    } else if (num < 0 && !botShow) {
      this.setState({ botShow: true })
    }
    reTop = top
  }

  render() {
    const { botShow, date, airdata, timeSort, priceSort } = this.state
    if (airdata && airdata.length > 0) {
      return (
        <div className='air'>
          <div className='airtop'>
            <Airdate date={ date } handleTime={ this.handleTime } />
          </div>
          <div className='airlistWarp'>
            <div className='airlistw' onScroll={ e => this.handleScroll(e.target.scrollTop, botShow) }>
              {
                airdata.map(e => <Airlist key={ `${ e.departureDate }${ e.departureTime }${ e.flightNum }` } timeClose={ this.handleClose } data={ e } />)
              }
            </div>
            <div className='selectAir' style={ botShow ? {} : { bottom: '-1rem' } }>
              <p style={ typeof timeSort === 'boolean' ? { color: '#ffab00' } : {} } onClick={ () => { this.handleSort(timeSort, priceSort, 'timeSort', airdata) } }>
                <Icon type={ typeof timeSort === 'boolean' ? require('svg/jipiao/timing.svg') : require('svg/jipiao/time.svg') } />
                {
                  typeof timeSort === 'boolean' ? (timeSort ? '时间从早到晚' : '时间从晚都早') : '时间'
                }
              </p>
              <p style={ typeof priceSort === 'boolean' ? { color: '#ffab00' } : {} } onClick={ () => { this.handleSort(timeSort, priceSort, 'priceSort', airdata) } }>
                <Icon type={ typeof priceSort === 'boolean' ? require('svg/jipiao/pricing.svg') : require('svg/jipiao/price.svg') } />
                {
                  typeof priceSort === 'boolean' ? (priceSort ? '票价从低到高' : '票价从高到低') : '票价'
                }
              </p>
            </div>
          </div>
        </div>
      )
    } else if (airdata) {
      return (
        <div className='air'>
          <div className='airtop'>
            <Airdate date={ date } calenderdata={ [] } handleTime={ this.handleTime } />
          </div>
          <div className='airlistWarp'>
            <div className='empShop'>
              <div>
                <img alt='暂无航班信息' src={ feiji } />
                <p>当前日期没有符合条件的航班，建议您选择其他日期或变更改签原因</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div />
    )
  }
}

// 日历取消组件
const Selecttime = props => {
  const { handleContainerClose, handleTime, calenderdata } = props
  return (
    <Calendar pricearr={ calenderdata || [] } onChange={ res => { handleContainerClose(); handleTime(res.date) } } />
  )
}

// 头部信息
const Airdate = ({ date, handleTime }) => {
  const timesplit = date.split('-')
  const preDate = new Date()
  const presplit = preDate.toLocaleDateString().split('/')
  const nextDate = new Date()
  nextDate.setFullYear(presplit[0], (presplit[1] * 1) + 2, 0)
  const nowDate = new Date(date.replace(/-/g, '/'))
  const nowShow = `${ timesplit[1] }月${ timesplit[2] }日  周${ ['日', '一', '二', '三', '四', '五', '六'][nowDate.getDay()] }`
  return (
    <div className='airdate'>
      <div className='pre_date'>
        <Icon type={ require('svg/jipiao/arrowleftd.svg') } />
        <div onClick={ () => { if (preDate.toLocaleDateString() !== nowDate.toLocaleDateString()) { handleTime(`${ timesplit[0] }-${ timesplit[1] }-${ (timesplit[2] * 1) - 1 }`) } } }>
          <p style={ (preDate.toLocaleDateString() === nowDate.toLocaleDateString()) ? { color: '#999999' } : {} }>前一天</p>
        </div>
      </div>
      <div className='now_date' onClick={
         () => {
           return (
             Mask(
               <SlidePage target='right' showClose={ false } >
                 <Selecttime calenderdata={ [] } handleTime={ handleTime } />
               </SlidePage>,
               { mask: false, style: { position: 'absolute' } }
             )
           )
         }
       }
      >{ nowShow }<Icon type={ require('svg/jipiao/arrowdown.svg') } /></div>
      <div className='next_date'>
        <div onClick={ () => { if (nowDate.toLocaleDateString() !== nextDate.toLocaleDateString()) { handleTime(`${ timesplit[0] }-${ timesplit[1] }-${ (timesplit[2] * 1) + 1 }`) } } }>
          <p style={ (nowDate.toLocaleDateString() === nextDate.toLocaleDateString()) ? { color: '#999999' } : {} }>后一天</p>
        </div>
        <Icon type={ require('svg/jipiao/arrowrightd.svg') } />
      </div>
    </div>
  )
}

// 航班列表组件
const Airlist = ({ data, timeClose }) => {
  const { isStop, cabinType, departureTime, arrivalTime, departureAirport, deptAirportCode, arrivalAirport, arrivalAirportCode, carrierName, flightNum, flightTypeFullName, barePrice } = data
  return (
    <div className='airlist' onClick={ () => { timeClose(data) } }>
      <div className='airinfo'>
        <h3><span>{ departureTime }</span><span>{ isStop ? '停' : ''}</span><span>{ arrivalTime }</span></h3>
        <p><span>{ departureAirport }{ deptAirportCode }</span><span>{ arrivalAirport }{ arrivalAirportCode }</span></p>
        <p>{ carrierName }{ flightNum } { flightTypeFullName }</p>
      </div>
      <div className='price'>
        <p className='changepri'>改签费总价</p>
        <p>¥{ barePrice }</p>
        <p className='changepri'>{ cabinType }</p>
      </div>
    </div>
  )
}

export default Changeair
