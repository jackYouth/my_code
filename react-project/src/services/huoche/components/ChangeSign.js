import React from 'react'
import { browserHistory } from 'react-router'
import { List, Icon, WhiteSpace, Toast } from 'antd-mobile'
import { Mask } from '@boluome/oto_saas_web_app_component'
import { setStore, getStore } from '@boluome/common-lib'
import Cardtime from './cardtime'

import '../style/PassengerInformWrap.scss'
import noChooseIcon from '../img/noChoose.svg'
import successIcon from '../img/success.svg'
import logo from '../img/logo.svg'

const Item = List.Item
const Brief = Item.Brief
class ChangeSign extends React.Component {
  constructor(props) {
    super(props)
    const propsObj = getStore('huoche_Change_data', 'session')
    const details = getStore('huoche_details', 'session') ? getStore('huoche_details', 'session') : ''
    const chooseTime = getStore('huoche_ChooseTime', 'session')
    const seats = getStore('huoche_seats', 'session')
    const { passengers, ChooseCredential } = propsObj
    const passengersChoose = getStore('huoche_passengersChoose', 'session') ? getStore('huoche_passengersChoose', 'session') : passengers.filter(i => { return i.id === ChooseCredential })
    const ChooseCredentialarr = getStore('huoche_ChooseCredentialarr', 'session') ? getStore('huoche_ChooseCredentialarr', 'session') : [ChooseCredential]
    this.state = {
      ...propsObj,
      ChooseCredentialarr,
      passengersChoose,
      details,
      chooseTime,
      seats,
      onepeople: passengersChoose,
    }
    console.log('ChangeSign---', this.props.ChooseCredential, passengersChoose, chooseTime)
    this.handleRefundInfo = this.handleRefundInfo.bind(this)
    this.handlePassengersChoose = this.handlePassengersChoose.bind(this)
  }
  componentWillUnmount() {
    // Popup.hide()
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps,
    })
  }
  // 选择改签乘客
  handleRefundChecked(code, arr) {
    const passengersChoose = []
    const filter = arr.filter(item => { return item === code })
    if (filter.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === code) {
          arr.splice(i, 1)
        }
      }
    } else {
      arr.push(code)
    }
    if (arr.length > 0) {
      this.handlePassengersChoose(arr, passengersChoose)
    } else {
      this.setState({
        passengersChoose,
      })
    }
    setStore('huoche_ChooseCredentialarr', arr, 'session')
    this.setState({
      ChooseCredentialarr: arr,
    })
  }
  // 当有选择了改签人员时
  handlePassengersChoose(arr, passengersChoose) {
    const { passengers } = this.state
    for (let i = 0; i < passengers.length; i++) {
      for (let o = 0; o < arr.length; o++) {
        if (passengers[i].id === arr[o]) {
          passengersChoose.push(passengers[i])
        }
      }
    }
    this.setState({
      passengersChoose,
    })
    setStore('huoche_passengersChoose', passengersChoose, 'session')
  }
  // 提交改签申请
  handleRefundInfo(passengersChoose) {
    // const { passengers, ChooseCredentialarr, orderId } = this.state
    setStore('huoche_passengersChoose', passengersChoose, 'session')
    browserHistory.push('/huoche/order?ChangeSign')
    Mask.closeAll()
    location.hash = ''
  }
  // 点击改签的时候----到列车列表页面
  handleGoList(from, to) {
    const chooseCity = {
      from,
      to,
    }
    // const chooseTime = ''
    setStore('huoche_ChooseCity', chooseCity, 'session')
    setStore('huoche_haschecked', true, 'session')
    // setStore('huoche_ChooseTime', chooseTime, 'session')
    browserHistory.push('/huoche/moredata?ChangeSign')
    Mask.closeAll()
    location.hash = ''
  }
  render() {
    const { passengers, ChooseCredentialarr, trains, chooseTime, passengersChoose, details, trainNumber, seats, onepeople } = this.state
    const endersarr = passengers
    let isShow = true
    const channel = getStore('huoche_channel', 'session')
    const {
      arriveCity = '上海',
      departureCity = '北京',
      seatName,
    } = trains
    if (seatName.indexOf('软卧') >= 0 || seatName.indexOf('硬卧') >= 0 || seatName.indexOf('卧') >= 0 || channel === 'tongcheng') {
      isShow = false
    }
    const defaultClass = {
      backgroundColor: '#fffbf2',
    }
    return (
      <div className='refundWrap'>
        <WhiteSpace />
        <Item>选择改签乘客</Item>
        <div className='refundListWrap'>
          <List className='refundList'>
            {
              isShow ? (
                <div>{
                  endersarr.map(o => (
                    <div key={ `${ o.credentialCode }-${ 100 * Math.random() }` }>
                      {
                        o.isChange === true ? (
                          <Item key={ o.id } thumb={ <Icon onClick={ () => this.handleRefundChecked(o.id, ChooseCredentialarr) } type={ ChooseCredentialarr.filter(i => { return i === o.id }).length > 0 ? successIcon : noChooseIcon } /> }>
                            <CanChange o={ o } />
                          </Item>
                        ) : ('')
                      }
                    </div>
                  ))
                }</div>
              ) : (
                <div>{
                  onepeople.map(o => (
                    <div key={ `${ o.credentialCode }-${ 100 * Math.random() }` }>
                      {
                        o.isChange === true ? (
                          <Item key={ o.id } thumb={ <Icon onClick={ () => this.handleRefundChecked(o.id, ChooseCredentialarr) } type={ ChooseCredentialarr.filter(i => { return i === o.id }).length > 0 ? successIcon : noChooseIcon } /> }>
                            <CanChange o={ o } />
                          </Item>
                        ) : ('')
                      }
                    </div>
                  ))
                }</div>
              )
            }
            <WhiteSpace size='lg' />
            <Item arrow='horizontal' onClick={ () => this.handleGoList(departureCity, arriveCity) }><span className='titleSpan'><Icon type={ logo } /></span><span className='titleSpan'>请选择改签的车次与坐席</span></Item>
            {
              details ? (<Cardtime UserComponent={ <ChoosePeople passengersChoose={ passengersChoose } seats={ seats } /> } ticketDetails={ details } chooseTime={ chooseTime } defaultClass={ defaultClass } />) : ('')
            }
            {
              details ? (<WhiteSpace size='lg' />) : ('')
            }
            <Item extra={ `(${ trainNumber }/${ seatName })` }>原始车票</Item>
            <WhiteSpace />
          </List>
        </div>
        {
          ChooseCredentialarr && ChooseCredentialarr.length > 0 ? (<ChangeBtn details={ details } handleRefundInfo={ this.handleRefundInfo } passengersChoose={ passengersChoose } />) : (<div className='refundFooter refundFooterNouse'>提交退票申请</div>)
        }
      </div>
    )
  }
}

export default ChangeSign

const ChangeBtn = ({ details, passengersChoose, handleRefundInfo }) => {
  return (
    <div>
      { details ? (<div className='refundFooter' onClick={ () => handleRefundInfo(passengersChoose) }>提交改签申请</div>) : (<div className='refundFooter' onClick={ () => Toast.info('请选择改签的车次与坐席!', 2, null, false) }>提交改签申请</div>) }
    </div>
  )
}

const CanChange = ({ o }) => {
  const { name, credentialCode } = o
  return (
    <div key={ credentialCode }><span>乘客</span><span>{ name }</span><span className='numStr'>{ `${ credentialCode.slice(0, 4) } ******** ${ credentialCode.slice(-3) }` }</span></div>
  )
}

const ChoosePeople = ({ passengersChoose, seats }) => {
  const { name, price } = seats
  console.log('--seats--', seats)
  return (
    <div>
      {
        passengersChoose && passengersChoose.map(o => (
          <Item key={ o.credentialCode + o.name } multipleLine align={ top } extra={ <span style={{ marginRight: '0px', color: '#333' }}>{ name } ¥{ price }</span> }>
            <span>{ o.name }</span><span style={{ color: '#999' }}>{ o.ticketType }</span> <Brief><span style={{ color: '#333' }}>{ `${ o.credentialCode.slice(0, 4) } ******** ${ o.credentialCode.slice(-3) }` }</span></Brief>
          </Item>
        ))
      }
    </div>
  )
}
