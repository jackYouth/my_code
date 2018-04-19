import React from 'react'
import { Icon, List, WhiteSpace } from 'antd-mobile'
import { Mask, SlidePage } from '@boluome/oto_saas_web_app_component'

import '../style/AccidentCom.scss'

import AccidentRistMask from './AccidentRistMask'

import tipsIcon from '../img/tips.svg'
import closeIcon from '../img/close.png'
// import noChooseIcon from '../img/noChoose.svg'
// import successIcon from '../img/success.svg'

const Item = List.Item
const Brief = Item.Brief
class AccidentCom extends React.Component {
  constructor(props) {
    super(props)
    // const newState = merge(state)(props)
    this.state = {
      ...props,
    }
    this.handleAccidentRist = this.handleAccidentRist.bind(this)
  }
  componentWillUnmount() {
    // Popup.hide()
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps,
    })
  }
  handleAccidentRist() {
    const { insuranceDoc } = this.props
    const { insuranceName } = insuranceDoc[0]
    const accidentData = {
      name: insuranceName,
    }
    Mask(
      <SlidePage target='left' showClose={ false } >
        <AccidentRistMask accidentData={ accidentData } />
      </SlidePage>
    , { mask: false, style: { position: 'absolute' } })
  }
  render() {
    const { handleContainerClose, insuranceDoc = [] } = this.props
    console.log('test----insuranceDoc-', insuranceDoc)
    const { venders } = insuranceDoc[0]
    return (
      <div className='AccidentCom'>
        <div className='AccidentComWrap'>
          <List className='AccidentTitle'>
            <Item><span className='quxiao'>取消</span><span className='title'>保险信息</span><span className='queding'>确定</span></Item>
          </List>
          <AccidentRistCom handleAccidentRist={ this.handleAccidentRist } data={ insuranceDoc[0] } />
          <AccidentPeopleCom venders={ venders } />
        </div>
        <img onClick={ () => { handleContainerClose() } } src={ closeIcon } alt='' />
      </div>
    )
  }
}
// <AccidentAfterPay />

export default AccidentCom

// 订单详情页面的火车意外险
const AccidentRistCom = ({ handleAccidentRist, data }) => {
  const { insuranceName, brief } = data
  return (
    <List className='AccidentRistWrap'>
      <WhiteSpace />
      <Item
        className='accidenRist'
        extra={ <Icon onClick={ () => { handleAccidentRist() } } type={ tipsIcon } /> }
      >
        { insuranceName }

        <Brief><span style={{ fontSize: '0.28rem' }}>{ brief }</span></Brief>
      </Item>
      <WhiteSpace />
    </List>
  )
}

// 订单详情页面的被保险人部分
const AccidentPeopleCom = ({ venders }) => {
  // console.log('--test--', venders)
  return (
    <List className='AccidentPeople'>
      {
        venders.map(i => (
          <Item key={ i.credentialCode + i.name } extra={ <span className='tuibao'>{ i.displayStatus }</span> }>
            <div className='title'><span>被保险人</span><span>{ i.name }</span></div>
            <div className='fenlie'><span>保单号</span><span>{ i.credentialCode }</span></div>
            {
              i.status === 15 || i.status === 11 ? (<div className='tips'>退款会在1-5个工作日内退回您的支付宝账户</div>) : ('')
            }
          </Item>
        ))
      }
    </List>
  )
}

// 订单详情页面选择被保人 -----> 未支付时
// const AccidentChoose = () => {
//   return (
//     <List className='AccidentBtn'>
//       <Item>
//         <div className='chooseBtn'><Icon type={ successIcon } /><span>阿沁</span></div>
//         <div className='chooseBtn'><Icon type={ noChooseIcon } /><span>阿沁</span></div>
//       </Item>
//     </List>
//   )
// }

// 订单详情页面查看被保险人 ------> 支付之后
// const AccidentAfterPay = () => {
//   return (
//     <List className='AccidentPayment'>
//       <Item><span className='miniN'>被保险人</span><span className='name'>阿沁</span></Item>
//       <Item><span className='miniN'>被保险人</span><span className='name'>阿沁</span></Item>
//     </List>
//   )
// }
