import React from 'react'
import { afterOrdering, login } from 'business'
import { List, WhiteSpace } from 'antd-mobile'
import { moment } from '@boluome/common-lib'
import { OrderDetail, OrderPreferential, Mask, SlidePage, MapShowGaode } from '@boluome/oto_saas_web_app_component'

import '../style/orderDetails.scss'
import '../style/details.scss'   // 这里是为了引入景点详情页的一些样式
import daohang from '../img/daohang.png'
import shijian from '../img/shijian.png'
import xiangqing from '../img/xiangqing.png'

const Item = List.Item
const orderDetails = props => {
  console.log('od---', props)
  const { params } = props
  const orderId = params ? params.id : ''
  return (
    <div className='orderDetailsWrap'>
      <OrderDetail
        content={ <OrderComponent /> }
        login={ login }
        id={ orderId }
        orderType='menpiao'
        goPay={ () => afterOrdering({ id: orderId }) }
      />
    </div>
  )
}

export default orderDetails

// 订单详情页面的主要内容
const OrderComponent = ({ orderDetailInfo }) => {
  console.log('test--orderDetailInfo--', orderDetailInfo)
  const { travellers, createdAt, platformActivity = {}, coupon = {},
    realPayPrice = 0, product = {}, orderPrice = 0, id,
  } = orderDetailInfo
  const { title, price } = platformActivity
  const { ticketCount, travellerType } = travellers && travellers[0] ? travellers[0] : {}
  const { sellPrice = 0 } = product
  const propsObj = {
    topTitle:              travellerType,
    platformActivityPrice: price,
    couponPrice:           coupon.price,
    realPayPrice:          realPayPrice.toFixed(2),
    sumPrice:              `${ sellPrice.toFixed(2) } x ${ ticketCount }`,
    atitle:                title,
    ctitle:                coupon.title,
  }
  return (
    <div className='menpiaoOrderDetails'>
      <WhiteSpace size='lg' />
      {
        orderDetailInfo && orderDetailInfo.map ? (<Detailsinfo orderDetailInfo={ orderDetailInfo } />) : ''
      }
      <WhiteSpace size='lg' />
      {
        realPayPrice && orderPrice ? (<OrderPreferential propsObj={ propsObj } />) : ('')
      }
      {
        travellers ? (<PersonalInfo travellers={ travellers } />) : ''
      }
      <WhiteSpace size='lg' />
      {
        id ? (<div><OrderTimeCom id={ id } createdAt={ createdAt } /><WhiteSpace size='lg' /></div>) : ''
      }
    </div>
  )
}

// 门票详情展示部分
const Detailsinfo = ({ orderDetailInfo }) => {
  // 点击景点详情 ------ showClose={ false }
  const { visitDate, addr, map, scenicName, ways, scenicDetail, rule, name, openTime } = orderDetailInfo
  const { latitude = '', longitude = '' } = map
  const handleDetailsShow = () => {
    Mask(
      <SlidePage target='left'>
        <DetailsMain scenicDetail={ scenicDetail } />
      </SlidePage>
      , { mask: false, style: { position: 'absolute' } }
    )
  }
  // 点击开放时间
  const handleOpenTime = () => {
    Mask(<OpenTimeCom openTime={ openTime } />, { mask: true, style: { position: 'absolute' } })
  }
  // 点击地图导航部分
  const handleMapnavigation = () => {
    Mask(
      <SlidePage target='left'>
        <MapShowGaode longitude={ longitude } latitude={ latitude } addrnameStr={ addr } addrTitlename={ scenicName } />
      </SlidePage>
      , { mask: false, style: { position: 'absolute' } }
    )
  }
  // 点击预订须知
  const handleOrderInfo = () => {
    Mask(
      <OrderInfoCom data={ rule } name={ name } />
      , { mask: true, style: { position: 'absolute' } }
    )
  }
  return (
    <div className='orderDetailsinfo'>
      <List>
        <Item arrow='horizontal' extra={ <span className='orderInfo' onClick={ () => { handleOrderInfo() } }>入园须知、退改签说明</span> }>{ scenicName }</Item>
        <div className='main'>
          <div className='item'><span>入园日期：</span><span>{ visitDate }</span></div>
          <div className='item'><span>入园方式：</span><span>{ ways }</span></div>
          <div className='item' style={{ display: 'none' }}><span>取票码：</span><span className='itemSs'>8912748921738</span></div>
        </div>
        <div className='infoBtn'>
          <div className='oto' onClick={ () => handleDetailsShow() }><span><img src={ xiangqing } alt='' /></span><span>景点详情</span></div>
          <div className='oto cbtn' onClick={ () => handleOpenTime() }><span><img src={ shijian } alt='' /></span><span>开放时间</span></div>
          <div className='oto' onClick={ () => handleMapnavigation() }><span><img src={ daohang } alt='' /></span><span>地图导航</span></div>
        </div>
      </List>
    </div>
  )
}

// 取票人信息展示
const PersonalInfo = ({ travellers }) => {
  const { name, idCard, phone } = travellers[0]
  const tel = phone.replace(/\s/g, '')
  console.log(tel)
  return (
    <div className='PersonalInfoWrap'>
      <List>
        <Item>取票信息</Item>
        <Item extra={ name }>取票人</Item>
        <Item extra={ `${ tel.slice(0, 4) } **** ${ tel.slice(-3) }` }>手机号</Item>
        <Item extra={ `${ idCard.slice(0, 4) } ******** ${ idCard.slice(-3) }` }>身份证</Item>
      </List>
    </div>
  )
}

// 订单编号和下单时间
const OrderTimeCom = ({ id, createdAt }) => {
  return (
    <List className='ordertime'>
      <Item extra={ id }>订单编号</Item>
      <Item extra={ moment('YYYY-MM-DD HH:mm:ss')(createdAt) }>下单时间</Item>
    </List>
  )
}
// 景点详情展示
const DetailsMain = ({ scenicDetail }) => {
  if (scenicDetail) {
    const { name, intro, character, playAttractions } = scenicDetail
    return (
      <div className='tabIntro'>
        <div className='introMain'>
          <p style={{ paddingTop: '20px' }}>{ name }</p>
          {
            playAttractions && playAttractions.length === 0 ? (<div dangerouslySetInnerHTML={{ __html: intro }} />) : (<p>{ intro }</p>)
          }
          {
            character ? (character.map((items, index) => (
              <p key={ `${ index + 3 }` }>{ items }</p>
            ))) : ('')
          }
          {
            playAttractions ? (playAttractions.map((item, indexs) => (
              <div key={ `${ indexs + 1 }` }>
                <p>{ item.playName }</p>
                {
                  (item.playImages.length > 0) ? ((item.playImages).map((item2, index) => (
                    <div key={ `${ index + 2 }` }>
                      <img alt='加载中' src={ item2 } />
                      <WhiteSpace size='lg' />
                    </div>
                  ))) : ('')
                }
                <p>{ item.playInfo }</p>
              </div>
            ))) : ('')
          }
        </div>
      </div>
    )
  }
}
// 景区开放时间
const OpenTimeCom = ({ openTime }) => {
  return (
    <div className='openTimeWrap'>
      <div className='openTimeHeader'>开放时间：</div>
      <div className='openTime'>{ openTime }</div>
    </div>
  )
}
// 入园须知，改签须知
const OrderInfoCom = ({ data, name }) => {
  if (data) {
    const { effectiveDesc, importentPoint, addr, getTicketTime } = data
    return (
      <div className='orderinfoWrap'>
        <div className='orderinfoMian'>
          <div className='orderinfoHeader'>
            <span className='infoclose' /><span className='infortitle'>入园须知</span>
          </div>
          <div className='orderinfo'>
            <div className='info'>
              <p className='infotop'>{ name }</p>
              <p>有效时间：{ effectiveDesc }</p>
              <p>景点地址：{ addr }</p>
              <p>入园须知：{ getTicketTime }</p>
              <p>重要须知：{ importentPoint }</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
