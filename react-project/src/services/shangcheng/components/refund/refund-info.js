import React from 'react'
import { moment } from '@boluome/common-lib'
import { Mask, SlidePage } from '@boluome/oto_saas_web_app_component'
import { List, InputItem, Grid } from 'antd-mobile'

import CountDown from '../common-component/countdown'
import ConsultList from './consult-list'
import ExpressInfo from '../common-component/express-info'

import '../../styles/refund/refund-info.scss'

const RefundInfo = ({
  currentRefundInfo, handleEidtRefund, handleCancelRefund,
  handleExpressChange, currentExpressNumber, expressInfo = {}, placeExpress,
  handleIptBlur,
}) => {
  if (!currentRefundInfo) return <div />
  const {
    amount, reason, explain, id, createdAt, updatedAt,
    status, originId, originOrderType,
    businessConfirmTime,
    consultList,
    displayStatus, rejectReason, enterPrisePhone, isCanApply,
    shopName, shopLogo, images,
    services,
    specifications,
  } = currentRefundInfo
  const { expressName = '', expressCode = '' } = expressInfo
  const expressParas = {
    orderId: id,
    express: {
      orderNum: currentExpressNumber,
      name:     expressName,
      code:     expressCode,
    },
  }
  // status: 6: 退款中, 7: 已退款, 8: 已取消（REFUND_CANCELED_TIMEOUT：机会商品超时，REFUND_CANCELED_USER：用户自行取消），11: 等待退款
  // 26: 退款失败（REFUND_FAIL: 退款失败，REFUND_FAIL_REJECT：退款失败，被拒绝）, 27:退款申请中， 28: 申请已拒绝（申请时拒绝）, 29: 退货中, 30: 商家已同意，等待退货
  return (
    <div className='refund-info-container'>
      {
        (status === 8 || status === 11 || status === 26 || status === 27 || status === 28 || status === 29) &&
        <div className='refund-info'>
          {
            status === 7 &&
            <div className='refund-info-common-container'>
              <div className='refund-info-header'>
                <span>退款成功</span>
                <span>{ moment('YYYY-MM-DD HH:mm:ss')(updatedAt) }</span>
              </div>
              <div className='refund-info-status'>
                <p className='refund-info-common-header'>{ displayStatus.split(' ')[1] }</p>
                <p className='refund-info-amount'><span>退款总金额</span><span>{ `￥ ${ amount }` }</span></p>
              </div>
            </div>
          }
          {
            status === 8 &&
            <div className='refund-info-common-container'>
              <div className='refund-info-header'>
                <span>已取消</span>
                <span>{ moment('YYYY-MM-DD HH:mm:ss')(updatedAt) }</span>
              </div>
              <div className='refund-info-status'>
                <p className='refund-info-common-header'>因您撤销退款申请，退款已关闭，交易将正常进行</p>
              </div>
            </div>
          }
          {
            status === 11 &&
            <div className='refund-info-common-container'>
              <div className='refund-info-header'>
                <span>等待退款</span>
                <span>{ moment('YYYY-MM-DD HH:mm:ss')(updatedAt) }</span>
              </div>
              <div className='refund-info-status'>
                <p className='refund-info-common-header'>{ displayStatus.split(' ')[1] }</p>
                <p className='refund-info-amount'><span>退款总金额</span><span>{ `￥ ${ amount }` }</span></p>
              </div>
            </div>
          }
          {
            status === 26 &&
            <div className='refund-info-common-container'>
              <div className='refund-info-header'>
                <span>{ displayStatus }</span>
                <span>{ moment('YYYY-MM-DD HH:mm:ss')(updatedAt) }</span>
              </div>
              <div className='refund-info-status'>
                <p className='refund-info-reject'>
                  <span>{ rejectReason }</span>
                  <span>如有异议，可联系平台客服<a href={ `tel:${ enterPrisePhone }` }>{ enterPrisePhone }</a></span>
                </p>
                <p className='refund-info-amount'><span>退款总金额</span><span>{ `￥ ${ amount }` }</span></p>
              </div>
            </div>
          }
          {
            status === 27 &&
            <div className='refund-info-common-container'>
              <div className='refund-info-header'>
                <span>请等待商家处理</span>
                <CountDown endTime={ updatedAt + (24 * 60 * 60 * 1000 * 7) } timeHeader='还剩' />
              </div>
              <div className='refund-info-status'>
                <p className='refund-info-common-header'>您已成功发起退款申请，请耐心等待商家处理</p>
                <p className='font-24-ad'>卖家同意或超时未处理，系统将退款给您<br />如果商家拒绝，您可以修改退款申请再次发起，商家会重新处理</p>
                <p className='apply-button'>
                  <span onClick={ () => handleEidtRefund(originId, originOrderType, id) }>修改申请</span>
                  <span onClick={ () => handleCancelRefund(id, originId, originOrderType) }>撤销申请</span>
                </p>
              </div>
            </div>
          }
          {
            status === 28 &&
            <div className='refund-info-common-container'>
              <div className='refund-info-header'>
                <span>申请已拒绝</span>
              </div>
              <div className='refund-info-status'>
                <p className='refund-info-reject'>
                  <span>{ rejectReason }</span>
                  {
                    isCanApply
                      ? <span>您可以修改退款申请再次发起，商家会重新处理</span>
                      : <span>您可以联系平台客服处理<a href={ `tel:${ enterPrisePhone }` }>{ enterPrisePhone }</a></span>
                  }
                </p>
                {
                  isCanApply ?
                    <p className='apply-button'>
                      <span onClick={ () => handleEidtRefund(originId, originOrderType, id) }>修改申请</span>
                      <span onClick={ () => handleCancelRefund(id, originId, originOrderType) }>撤销申请</span>
                    </p> :
                    <p className='apply-button'>
                      <a href={ `tel:${ services[0].phone }` }>平台客服</a>
                    </p>
                }
              </div>
            </div>
          }
          {
            status === 29 &&
            <div className='refund-info-common-container'>
              <div className='refund-info-header'>
                <span>等待商家收货并退款</span>
                <CountDown endTime={ createdAt + (24 * 60 * 60 * 1000 * 7) } timeHeader='还剩' />
              </div>
              <div className='refund-info-status'>
                <p className='refund-info-common-header'>如果商家收到货并验货无误，将操作退款给您</p>
                <List.Item className='express-show' arrow='horizontal' onClick={ () => Mask(<SlidePage showClose={ false } target='express-slide'><ExpressInfo orderId={ id } /></SlidePage>) }>
                  <p>
                    <span>退货物流：申通快递（402237827382738）</span>
                    <span>已签收,签收人是XXXX</span>
                    <span>2017-8-2 13:04:09</span>
                  </p>
                </List.Item>
                <p className='font-24-ad'>如果商家拒绝退款，需要您修改退货申请。<br />如果商家超时未处理，将自动退款给您</p>
              </div>
            </div>
          }

          <List.Item className='refund-info-history' arrow='horizontal' onClick={ () => Mask(<SlidePage showClose={ false }><ConsultList { ...{ consultList, shopName, shopLogo } } /></SlidePage>) }>协商历史</List.Item>
          <div className='refund-info-detail'>
            <p>退款信息</p>
            {
              specifications.map(o => {
                const { icon, commodityName, specificationName, specificationId } = o
                return (
                  <div className='commodity-info' key={ specificationId }>
                    <h5><img src={ icon } alt={ commodityName } /></h5>
                    <h5>
                      <span>{ commodityName }</span>
                      {
                        specificationName &&
                        <span>{ `已选择 ${ specificationName }` }</span>
                      }
                    </h5>
                  </div>
                )
              })
            }
            <p>{ `退款原因：${ reason }` }</p>
            <p>{ `退款金额：￥${ amount }` }</p>
            <p>{ `退款说明：${ explain }` }</p>
            <p>上传凭证：</p>
            <Grid data={ images }
              columnNum={ 4 }
              renderItem={
                dataItem => (
                  <img src={ dataItem } alt='icon' />
                )
              }
            />
            <p>{ `退款编号：${ id }` }</p>
          </div>
        </div>
      }
      {
        status === 30 &&
        <div className='refund-info'>
          <div className='refund-info-header'>
            <span>商家已同意</span>
            <CountDown endTime={ businessConfirmTime + (24 * 60 * 60 * 1000 * 7) } timeHeader='请在' timeAfter='内发货' />
          </div>
          <InputItem
            placeholder='请填写快递单号'
            onChange={ handleExpressChange }
            className='sc-user-tips express'
            onBlur={ () => handleIptBlur(currentExpressNumber) }
          >
            快递单号
          </InputItem>
          <List.Item extra={ expressName }>物流公司</List.Item>
          <div className='place-button' onClick={ () => placeExpress(expressParas) }>提交</div>
        </div>
      }
    </div>
  )
}

export default RefundInfo
