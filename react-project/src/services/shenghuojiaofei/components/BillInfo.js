// showPriceIpt: 是否显示价格输入框，北京是默认显示的


import React from 'react'
import { List, WhiteSpace, Picker, Modal } from 'antd-mobile'

import Order from '../containers/Order'
import ServerHeader from './ServerHeader'
import PriceInput from './price-input'

import '../styles/billInfo.scss'

const Item = List.Item

const Bill = ({ billInfo = { type: '' }, currentOrg, currentServer, queryInfo,
  curDate, dates, handleDatesChange,
  handleCodeCancel, handleCodeConfirm,
  currentBillInfo,
  showQueryHistory,
  showPriceIpt,
}) => {
  if (showPriceIpt && (billInfo.type || billInfo.type === 'bill') && currentServer.categoryId === '1002') {
    const { orgName, typeName } = currentOrg
    const { billNo } = queryInfo
    let price = '0.0'
    if (billInfo.data && billInfo.data.billList && billInfo.data.billList[0].price) price = billInfo.data.billList[0].price
    const billFlag = 'normal'
    const orderInfoTop = [
      { left: '缴费单位', right: orgName },
      { left: typeName, right: billNo },
      { left: '账单金额', right: `${ price }元` },
    ]
    return <PriceInput { ...{ orderInfoTop, currentServer, orderParas: { currentServer, currentOrg, queryInfo, billFlag, currentBillInfo } } } />
  }
  // 账单错误
  if (billInfo.type === 'errorBill') {
    return (
      <div className='no-error'>
        <img alt='未欠费' src={ require('../img/wqf.png') } />
        <p>{ billInfo.tips }</p>
        <span>{ billInfo.subTips }</span>
      </div>
    )
  }
  // 无账单（当月无订单，历史无订单）
  if (billInfo.type === 'noBill' || billInfo.type === 'historyNoBill') {    // code为-1，表示未查询到账单信息
    return <BillItem { ...{ showQueryHistory, currentServer, orderInfoTop: '', handleDatesChange, curImg: require('../img/wqf.png'), curText: billInfo.tips, subTips: billInfo.subTips, currentOrg, queryInfo, curDate, dates, handleCodeCancel, handleCodeConfirm } } />
  }
  // 查询到历史非待支付订单
  if (billInfo.type === 'historyBill') {
    const orderInfo = billInfo.data
    const { price } = orderInfo.billList[0]
    const { orgName, typeName } = currentOrg
    const { billNo } = queryInfo
    const orderInfoTop = [
      { left: '缴费单位', right: orgName },
      { left: typeName, right: billNo },
      { left: '账单金额', right: price },
    ]
    return (<BillItem { ...{ showQueryHistory, currentServer, orderInfoTop, handleDatesChange, currentOrg, queryInfo, curDate, dates } } />)
  }

  // 有待支付账单信息
  if (billInfo.type === 'bill') {    // code为0，表示查询到账单信息
    const { price, barcode, billId, date, status } = billInfo.data.billList[0]
    if (price !== undefined) {   // 加载order组件
      const orderInfo = { price, date, barcode, billId, orgName: currentOrg.orgName }
      const billFlag = 'normal'
      return (<Order { ...{ currentServer, currentOrg, orderInfo, queryInfo, billFlag, currentBillInfo } } />)
    }
    // 加载其它显示信息组件
    let curText = ''
    switch (status) {
      case '1s':
        curText = '暂未查询到欠费'
        break
      case '01':
        curText = '正在销帐中'
        break
      case '03':
        curText = '支付成功'
        break
      default:
        curText = '暂未查询到欠费'
        break
    }
    return (<BillItem { ...{ showQueryHistory, currentServer, orderInfoTop: '', handleDatesChange, curImg: require('../img/wqf.png'), curText, subTips: '', currentOrg, queryInfo, curDate, dates, handleCodeCancel, handleCodeConfirm } } />)
  }
  // 默认
  return <div />
}

class BillItem extends React.Component {
  constructor(props) {
    super(props)
    const { dates } = props
    this.state = {
      curDate: Array(dates[0].label),
    }
    this.handleDateChange = this.handleDateChange.bind(this)
  }
  handleDateChange(curDate) {
    const { handleDatesChange, queryInfo } = this.props
    this.setState({
      curDate,
    })
    const d = curDate[0].replace(/[^0-9]+/g, '')
    queryInfo.date = d
    handleDatesChange(queryInfo)
  }
  render() {
    const { currentServer, curImg, curText, subTips, currentOrg, queryInfo,
      dates,
      handleCodeCancel, handleCodeConfirm,
      orderInfoTop,
      showQueryHistory,
    } = this.props
    const { curDate } = this.state
    const { type } = queryInfo
    const handleCodeClick = () => Modal.alert(<img alt='条形码提示' src={ require('../img/tipsCode.png') } />, '填写户号可以更便捷的缴费与查询账单，是否立即填写？',
      [
        { text: '取消', onPress: () => handleCodeCancel() },
        { text: '确定', onPress: () => handleCodeConfirm(), style: { fontWeight: 'bold' } },
      ]
    )
    //  此处的orderInfoTop是用来区分，是否是历史查询的订单
    return (
      <div className='bill-info'>
        <ServerHeader currentServer={ currentServer } />
        {
          !orderInfoTop &&
          <div>
            <div className='img-container'>
              <h1>{ curDate }</h1>
              <img alt='图片信息' src={ curImg } />
              <p>{ curText }</p>
              <span>{ subTips }</span>
            </div>
            <ul className='list'>
              <li>
                <p className='left'>出账机构</p>
                <p className='right'>{ currentOrg.orgName }</p>
              </li>
              <li>
                <p className='left'>{ currentOrg.typeName }</p>
                <p className='right'>{ queryInfo.billNo }</p>
              </li>
            </ul>
          </div>
        }
        <WhiteSpace size='md' style={{ background: '#f5f5f6' }} />
        {
          orderInfoTop &&
          <div className='orderInfo-top-container'>
            <div className='orderInfo-top'>
              <p className='top'>{ curDate }</p>
              <p className='middle'>{ `${ orderInfoTop[2].right }元` }</p>
            </div>
            <List>
              {
                orderInfoTop.map(item => (
                  <Item key={ item.left } extra={ item.right }>{ item.left }</Item>
                ))
              }
            </List>
            <WhiteSpace size='md' style={{ background: '#f5f5f6' }} />
          </div>
        }
        {
          String(type) === '0' &&
          <Picker data={ dates } value={ curDate } title='往期账单' cols={ 1 } extra={ curDate } onChange={ this.handleDateChange }>
            <List.Item arrow='horizontal'>查询往期账单</List.Item>
          </Picker>
        }
        {
          String(type) === '2' && showQueryHistory &&
          <List.Item arrow='horizontal' onClick={ handleCodeClick }>查询账单</List.Item>
        }
      </div>)
  }
}

export default Bill
