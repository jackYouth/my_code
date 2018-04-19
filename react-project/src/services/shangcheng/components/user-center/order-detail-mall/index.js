import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { get, send } from '@boluome/common-lib'
import { Loading, Mask, SlidePage }   from '@boluome/oto_saas_web_app_component'
import { List, Modal } from 'antd-mobile'

import DefaultContent from './default-content'

import './index.scss'
import completed from './completed.png'
import canceled from './canceled.png'
import notpay from './notopay.png'

const Item = List.Item
const alert = Modal.alert

const CloseComponent = () => <div style={{ width: '13%', height: '100%', position: 'fixed', left: '0', fontSize: '.28rem', boxSizing: 'border-box', padding: '65% 4% 0', color: '#fff' }}>点击此处关闭</div>

export default class OrderDetailMall extends Component {
  constructor(props) {
    super(props)
    const { id, orderType } = props
    this.state = {
      id,
      orderType,
    }
  }

  // 根据ID加载订单信息
  componentWillMount() {
    this.fetchOrderInfo()
  }

  // 获取订单信息
  fetchOrderInfo() {
    const { id, orderType } = this.state
    const handleClose = Loading()
    get(`/order/v1/${ orderType }/${ id }/info`)
    .then(({ code, data, message }) => {
      if (code === 0) {
        this.setState({ orderDetailInfo: data })
        this.loadOrderStatus(data)
      } else {
        console.log(message)
      }
      handleClose()
    }).catch(err => {
      console.log(err)
      handleClose()
    })
  }

  // 根据status做映射
  loadOrderStatus(orderDetailInfo) {
    const { status } = orderDetailInfo
    let statusText
    let imgUrl
    switch (status) {
      case 1:
        statusText = '已下单'
        break
      case 2:
        statusText = '待支付'
        imgUrl = notpay
        break
      case 3:
        statusText = '已支付'
        break
      case 4:
        statusText = '已完成'
        imgUrl = completed
        break
      case 5:
        statusText = '取消中'
        break
      case 6:
        statusText = '退款中'
        break
      case 7:
        statusText = '已退款'
        break
      case 8:
        statusText = '已取消'
        imgUrl = canceled
        break
      case 9:
        statusText = '处理中'
        imgUrl = canceled
        break
      default:
        statusText = '未知'
    }
    this.setState({ statusText, imgUrl })
  }

  // 展示时间线默认展示，除非props传timelineShow === false
  showTimeLine() {
    const { orderDetailInfo = {} } = this.state
    // const { timeline_new = [] } = orderDetailInfo
    const timelineNew = orderDetailInfo.timeline_new ? orderDetailInfo.timeline_new : []

    return (
      Mask(
        <SlidePage
          target='right'
          type='root'
          closeComponent={ CloseComponent }
          style={{ width: '100%', backgroundColor: 'transparent', boxSizing: 'border-box', paddingLeft: '13%', right: '0', left: 'inherit' }}
        >
          <div className='timeline-container'>
            {
              timelineNew.length > 0 ?
                <div>
                  {
                    timelineNew.map(({ status, time }, index) => {
                      return (
                        <div className={ index === timelineNew.length - 1 ? 'timeline-box timeline-now' : 'timeline-box' } key={ `timeline${ time }` }>
                          <div className='timeline-point'>
                            <span style={{ backgroundColor: index === timelineNew.length - 1 ? '#ffab00' : '' }} />
                          </div>
                          <span>{ status }</span>
                          <span>{ time }</span>
                        </div>
                      )
                    })
                  }
                </div>
                : ''
            }
            <i className='timeline-line' />
          </div>
        </SlidePage>
      )
    )
  }

  // 取消订单
  cancelOrder() {
    const { orderDetailInfo = {} } = this.state
    const { id, channel, orderType, partnerId } = orderDetailInfo
    alert('', '确定取消该订单?', [
      { text: '取消', onPress: () => console.log('cancel') },
      {
        text:    '确定',
        onPress: () => {
          const handleClose = Loading()
          send('/order/v1/cancel', { id, channel, orderType, partnerId }).then(({ code, data, message }) => {
            if (code === 0) {
              console.log(data)
              // 重新获取订单状态
              this.fetchOrderInfo()
            } else {
              console.log(message)
            }
            handleClose()
          }).catch(err => {
            console.log(err)
            handleClose()
          })
        },
      },
    ])
  }

  // 支付
  handlePay() {
    const { goPay } = this.props
    if (goPay) goPay()
  }

  // 退款
  handleRefund(id, status, refundOrderId, orderType) {
    if (status === 3 || status === 4 || status === 9) window.location.href = `${ window.location.origin }/shangcheng/refund/${ orderType }/${ id }`
    else window.location.href = `${ window.location.origin }/shangcheng/refundInfo/refund/${ refundOrderId }`
    // if (status !== 0) window.location.href = `${ window.location.origin }/shangcheng/refundInfo/refund/${ id }`
  }

  // 获取底部退款按钮的显示文案
  getRefundText(status) {
    switch (status) {
      case 3:
      case 4:
      case 9:
        return '退款'
      case 6:
      case 7:
      case 11:
      case 27:
      case 29:
      case 30:
        return '退款详情'
      default:
        return ''
    }
  }

  // 跳转到评价页面
  handleToEvaluation(id) {
    browserHistory.push(`/shangcheng/evaluate/shop/${ id }`)
  }

  // 打电话功能可能出现特殊打电话的方式
  handleCall(serverPhone, w, mr) {
    const { customer = {} } = window.OTO_SAAS
    const { bridge = {}, isSpecialPhoneCall = false } = customer
    const { specialPhoneCall } = bridge
    return (
      <span style={{ borderWidth: '.01rem', width: w, marginRight: mr }}>
        {
          isSpecialPhoneCall ?
            <span style={{ border: '0' }} onClick={ () => {
              if (isSpecialPhoneCall && specialPhoneCall && typeof specialPhoneCall === 'function') {
                specialPhoneCall(serverPhone)
              } else {
                console.log('isSpecialPhoneCall else', isSpecialPhoneCall, specialPhoneCall)
              }
            } }
            >联系客服</span>
          :
            <a style={{ border: '0' }} href={ `tel:${ serverPhone }` }>联系客服</a>
        }
      </span>
    )
  }

  render() {
    const { statusText, imgUrl, orderDetailInfo } = this.state
    if (!orderDetailInfo) return <div />

    const { content, timelineShow = true, orderType } = this.props
    const { status, services = [], id, refundOrderId, applyCount, multipleRefunds, canAppraise } = orderDetailInfo
    const serverPhone = services.length > 0 ? services[0].phone : ''
    // 是否是整单退
    const refundAllOrder = multipleRefunds === 0

    const refundText = this.getRefundText(status)
    return (
      <div className='orderDetail-container'>
        {
          timelineShow ?
            <div className='order-status'>
              <Item arrow='horizontal' thumb={ imgUrl } onClick={ () => this.showTimeLine() }>
                { statusText }
              </Item>
            </div>
            : ''
        }
        {
          content ?
            <div className='main-container'>
              { React.cloneElement(content, { orderDetailInfo }) }
            </div>
          :
            <DefaultContent { ...{ orderDetailInfo, statusText, imgUrl, orderType, refundAllOrder } } />
        }
        <div className='btn-container'>
          {
            // 全部退款
            refundAllOrder && applyCount !== 2 && (
            status === 2 ?
              <div className='btn-box'>
                <a href={ `tel:${ serverPhone }` } style={{ width: '2.16rem', marginRight: '0.2rem' }}>联系客服</a>
                <span style={{ width: '2.16rem', marginRight: '0.2rem' }} onClick={ () => this.cancelOrder() }>取消订单</span>
                <span style={{ width: '2.16rem', color: '#ffab00', borderColor: '#ffab00' }} onClick={ () => this.handlePay() }>立即支付</span>
              </div>
              : status === 3 ?
                <div className='btn-box'>
                  <span style={{ width: '2.16rem', marginRight: '0.2rem' }} onClick={ () => this.handleRefund(id, status, refundOrderId, orderType) }>{ refundText }</span>
                  <a href={ `tel:${ serverPhone }` } style={{ width: '2.16rem', marginRight: '0.2rem' }}>联系客服</a>
                  <span style={{ width: '2.16rem' }} onClick={ () => this.cancelOrder() }>取消订单</span>
                </div>
                :
                <div className='btn-box'>
                  <span onClick={ () => this.handleRefund(id, status, refundOrderId, orderType) } style={{ width: '3.35rem', marginRight: '0.2rem' }}>{ refundText }</span>
                  <a href={ `tel:${ serverPhone }` } style={{ width: '3.35rem' }}>联系客服</a>
                </div>
            )
          }
          {
            // 部分退款
            (!refundAllOrder || applyCount === 2) && (
            status === 2 ?
              <div className='btn-box'>
                <a href={ `tel:${ serverPhone }` } style={{ width: '2.16rem', marginRight: '0.2rem' }}>联系客服</a>
                <span style={{ width: '2.16rem', marginRight: '0.2rem' }} onClick={ () => this.cancelOrder() }>取消订单</span>
                <span style={{ width: '2.16rem', color: '#ffab00', borderColor: '#ffab00' }} onClick={ () => this.handlePay() }>立即支付</span>
              </div> :
              status === 3 ?
                <div className='btn-box'>
                  <a href={ `tel:${ serverPhone }` } style={{ width: '3.35rem', marginRight: '0.2rem' }}>联系客服</a>
                  <span style={{ width: '3.35rem' }} onClick={ () => this.cancelOrder() }>取消订单</span>
                </div> :
                status === 4 && canAppraise ?
                  <div className='btn-container'>
                    <div className='btn-box'>
                      { this.handleCall(serverPhone, '3.1rem', '.2rem') }
                      <span style={{ borderWidth: '.01rem', width: '3.1rem', color: '#fff', backgroundColor: '#ffab00', borderColor: '#ffab00' }} onClick={ () => this.handleToEvaluation(id) }>评价服务</span>
                    </div>
                  </div> :
                  <div className='btn-box'>
                    <a href={ `tel:${ serverPhone }` } style={{ width: '95%' }}>联系客服</a>
                  </div>
            )
          }
        </div>
      </div>
    )
  }
}
