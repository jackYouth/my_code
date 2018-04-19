import React from 'react'
import { browserHistory } from 'react-router'
import { List, Modal } from 'antd-mobile'
import { Mask, SlidePage } from '@boluome/oto_saas_web_app_component'
import { moment, setStore, removeStore } from '@boluome/common-lib'

import RefundCom from './RefundCom'
import ChangeSign from './ChangeSign'

import '../style/PassengerInformWrap.scss'

const Item = List.Item
const alert = Modal.alert
class PassengerInformCom extends React.Component {
  constructor(props) {
    super(props)
    // const newState = merge(state)(props)
    this.state = {
      ...props,
      isClose:       false,
      isChangeClose: false,
      isCanChange:   false,
      changeText:    '距离发车小于1小时，需要您前往全国任意火车站售票窗口办理改签',
      isCloseText:   '距离发车时间小于一小时，需要您前往全国任意火车站退票窗口办理退票',
    }
    this.handledoll = this.handledoll.bind(this)
    this.handleChangeSign = this.handleChangeSign.bind(this)
    this.handleChangeCan = this.handleChangeCan.bind(this)
    console.log('PassengerInformCom---', props)
  }
  componentWillUnmount() {
    // 物极必反
    // const node = document.getElementsByClassName('mask-container')
    // if (node.length > 0) {
    //   node[0].remove()
    // }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps,
    })
  }
  // 判断是否在退票时间内
  handledoll(time, passengers, credentialCode, orderId, people) {
    if (time < 61) {
      const tipText = '距离发车时间小于一小时，需要您前往全国任意火车站退票窗口办理退票'
      Mask(<CanChangeApplyCom tipText={ tipText } />, { mask: true, style: { position: 'absolute' } })
      console.log('time----', time)
    } else {
      this.handleRefund(passengers, credentialCode, orderId, people)
    }
  }
  // 选择退票
  handleRefund(passengers, credentialCode, orderId, people) {
    const { status, trains, type, partnerId, channel } = this.state
    const { departueDateTime = '' } = trains
    const date = moment('x')(departueDateTime)
    let day = new Date()
    day = moment('x')(day)
    const t = (date - day) / 60000
    if (t < 59) {
      const tipText = '距离发车时间小于一小时，需要您前往全国任意火车站退票窗口办理退票'
      Mask(<CanChangeApplyCom tipText={ tipText } />, { mask: true, style: { position: 'absolute' } })
      console.log('我走了这handleRefund')
    } else {
      setStore('huoche_channel', channel, 'session')
      Mask(
        <SlidePage target='right' type='root' showClose={ false }>
          <RefundCom
            passengers={ passengers }
            ChooseCredential={ credentialCode }
            orderId={ orderId }
            status={ status }
            type={ type }
            refundpeople={ people }
            partnerId={ partnerId }
          />
        </SlidePage>
        , { mask: false, style: { position: 'absolute' } }
      )
    }
  }
  // 提示一个小时之内无法在线上退票
  handlecanotRefund() {
    this.setState({
      isClose: false,
    })
  }
  // 提示30分钟前不能改签
  handlecanotChange() {
    this.setState({
      isChangeClose: false,
      isCanChange:   false,
    })
  }
  // 改签时间判断
  handleChangeCan(passengers, credentialCode) {
    const { trains, canChangeApply, channel } = this.state
    if (!canChangeApply) {
      const tipText = '该订单尚有改签订单未处理完成，请在处理完成之后再进行申请'
      Mask(<CanChangeApplyCom tipText={ tipText } />, { mask: true, style: { position: 'absolute' } })
      return
    }
    const { departueDateTime = '' } = trains
    const date = moment('x')(departueDateTime)
    let day = new Date()
    day = moment('x')(day)
    const t = (date - day) / 60000
    if (t < 59) {
      const tipText = '距离发车小于1小时，需要您前往全国任意火车站售票窗口办理改签'
      Mask(<CanChangeApplyCom tipText={ tipText } />, { mask: true, style: { position: 'absolute' } })
    } else {
      setStore('huoche_channel', channel, 'session')
      this.handleChangeSign(passengers, credentialCode)
    }
  }
  // 改签选择框
  handleChangeSign(passengers, credentialCode) {
    console.log(passengers, credentialCode)
    const { trains } = this.state
    alert('温馨提示', '一张火车票只能成功改签一次，请确认是否改签', [
      {
        text:    '考虑一下',
        onPress: () => console.log('cancel'),
      },
      {
        text:    '我意已决',
        onPress: () => {
          const { partnerId } = this.state
          setStore('huoche_ChangeSign_partnerId', partnerId, 'session')
          const { orderId, status } = this.state
          const { trainNumber } = trains
          const propsObj = { passengers, ChooseCredential: credentialCode, trains, orderId, status, trainNumber }
          setStore('huoche_Change_data', propsObj, 'session')
          console.log('trainNumber---', trainNumber, '----propsObj-', propsObj)
          console.log('people--', status, partnerId, ChangeSign)
          // 改签出去重新选车次
          removeStore('huoche_details', 'session')
          browserHistory.push('/huoche/refund')
        },
        style: { fontWeight: 'bold' },
      },
    ])
  }
  render() {
    const { status, passengers, orderId, isClose, trains, isChangeClose, isCanChange, isCloseText, isChangeShow } = this.state
    console.log('PassengerInformCom---', this.state, trains, status, '--orderId-', orderId, isChangeClose, isCanChange, '---isChangeShow--', isChangeShow)
    return (
      <div className='PassengerInformWrap'>
        <List>
          {
            passengers.map(o => (
              <Item key={ `${ o.credentialCode }-${ 100 * Math.random() }` }>
                {
                  o.isChange === false ? (<div className='itemChange' />) : ('')
                }
                <div className='passengerLI'>
                  <div className='item'>
                    <span className='name oto'>{ o.name }</span><span className='people oto'>{ o.passengerType }</span>
                  </div>
                  <div className='item'>
                    <span className='orderId oto'>{ `${ o.credentialCode.slice(0, 4) } ******** ${ o.credentialCode.slice(-3) }` }</span>
                  </div>
                  <div className='item'>
                    <span className='statePass Orange'>{ o.displayStatus }</span>
                  </div>
                </div>
                <div className='passengerRI'>
                  <div className='item'>
                    <span className='zuo oto'>{ o.ticketSeat }</span><span className='price oto'>¥{ o.ticketPrice }</span>
                  </div>
                  <div className='item'>
                    <span className='zuohao Orange'>{ o.seatName }</span>
                  </div>
                  <div className='item'>
                    <span className='fentui hidden'>分享</span>
                    {
                      isChangeShow ? ('') : (o.isChange === false ? (<span className='fentui zhihui'>改签</span>) : (<span className='fentui' onClick={ () => this.handleChangeCan(passengers, o.id) }>改签</span>))
                    }
                    {
                      o.isRefund === false ? (<span className='fentui zhihui'>退票</span>) : (<span className='fentui' onClick={ () => this.handledoll(o.remainingTime, passengers, o.id, orderId, o) }>退票</span>)
                    }
                    <Modal
                      title=''
                      transparent
                      maskClosable='true'
                      visible={ isClose }
                      footer={ [{ text: '知道了', onPress: () => { this.handlecanotRefund() } }] }
                    >
                      { isCloseText }
                    </Modal>

                  </div>
                </div>
              </Item>
            ))
          }
        </List>
      </div>
    )
  }
}

export default PassengerInformCom

const CanChangeApplyCom = ({ tipText, handleContainerClose }) => {
  return (
    <div className='canChangeApplyCom'>
      <div className='tips'>{ tipText }</div>
      <div className='canChangeBtn' onClick={ () => { Mask.closeAll(); location.hash = ''; handleContainerClose() } }>知道了</div>
    </div>
  )
}
