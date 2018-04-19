import React from 'react'
import { Tabs, List } from 'antd-mobile'
import { Evaluation, Mask, SlidePage } from '@boluome/oto_saas_web_app_component'
import Commodity from './commodity'
import RestaurantPhoto from './restaurantPhoto'
import RestaurantLicense from './restaurantLicense'
import ShoppingCar from './shoppingCar'
import '../style/restaurantDetail.scss'

const Item = List.Item
const TabPane = Tabs.TabPane

// 商家tab组件
const Restaurant = ({ data }) => {
  // console.log('restaurant data', data)
  const { restaurantInfo = {}, deliveryInfo = {}, photoList = [] } = data
  const { restaurantName, pic, isPremium, rating, sales = 0, isOnTime, restaurantId, servingTime = [],
          isVipDelivery, deliveryAmount, agentFee = 0, promotionInfo, activities = [], invoice, address,
          supportInsurance, phoneList = [],
        } = restaurantInfo !== 'undefined' ? restaurantInfo : ''
  const { deliveryRule = {} } = deliveryInfo !== 'undefined' ? deliveryInfo : ''
  const { agentFees = [], deliveryAmounts = [] } = deliveryRule.agentFees !== 'undefined' ? deliveryRule : ''
  const reAgentFee = []
  deliveryAmounts.forEach((item, index) => {
    agentFees.forEach((item2, index2) => {
      if (index === index2) {
        reAgentFee.push(`满${ item }付${ item2 }元，`)
      }
    })
  })
  const { customer } = window.OTO_SAAS
  const { bridge, isSpecialPhoneCall = false } = customer
  const { specialPhoneCall } = bridge
  // const topHeight = document.querySelector('.restaurantTopInfo').clientHeight + document.querySelector('.am-tabs-bar').clientHeight
  // console.log('topHeight--------->', topHeight)
  return (
    <div className='restaurant-page-container' style={{ height: '200%', backgroundColor: '#f5f5f6' }}>
      <div className='restaurant-basis-container'>
        <div className='rest-info'>
          <div className='img-container'><img src={ pic } alt={ restaurantId } /></div>
          <div className='rest-info-right'>
            <div className='info-container-lineOne'>
              { isPremium ? <span className='isPremium'>品牌</span> : '' }
              <h3 className='restaurantName'>{ restaurantName }</h3>
            </div>
            <div className='info-container-lineTwo'>
              <Evaluation defaultValue={ rating ? `${ rating.toFixed(2) * 20 }%` : '0%' } />
              <span className='sales'>{ `月售${ sales }单` }</span>
            </div>
            <div className='info-container-lineThree'>
              <span className='deliveryAmount'>¥ { deliveryAmount }元起送</span>
              <span className='vertical' />
              <span className='agentFee'>配送费 ¥ { agentFee }</span>
              <div className='rightBox'>
                { isOnTime ? <span className='isOnTime'>准时达</span> : '' }
                { isVipDelivery ? <span className='isVipDelivery'>蜂鸟专送</span> : '' }
              </div>
            </div>
          </div>
        </div>
        {
          (deliveryAmounts.length > 0 && agentFees.length > 0) || promotionInfo ?
            <div className='rest-tips-container'>
              {
                deliveryAmounts.length > 0 && agentFees.length > 0 ?
                  <div className='delivery-tip'>
                    <span>配送费：</span>
                    {
                      reAgentFee.map(item => {
                        return (
                          <p key={ `reAgentFee${ Math.random() }` }>{ item }</p>
                        )
                      })
                    }
                  </div>
                : ''
              }
              {
                (deliveryAmounts.length > 0 && agentFees.length > 0) && promotionInfo ?
                  <i className='gray1' />
                : ''
              }
              {
                promotionInfo ?
                  <div className='ad-tip'>
                    <span>公告：</span>
                    <p>{ promotionInfo }</p>
                  </div>
                : ''
              }
            </div>
          : ''
        }
      </div>
      {
        activities.length > 0 || invoice || isOnTime || supportInsurance ?
          <div className='activity-service-container'>
            <h3>活动与服务</h3>
            <i className='gray1' />
            <div className='activity-service-box'>
              {
                activities.map(({ description, type }) => {
                  return (
                    <div key={ `activity${ Math.random() }` } className='activityContainer'>
                      <span className='actTag'>{ type === 1 ? '减' : '折' }</span>
                      <span className='actDescription'>{ description }</span>
                    </div>
                  )
                })
              }
              {
                supportInsurance ?
                  <div className='invoice-box'>
                    <span className='invoice'>保</span>
                    <p>已加入“外卖保”计划，食品安全有保障</p>
                  </div>
                : ''
              }
              { invoice ?
                <div className='invoice-box'>
                  <span className='invoice'>票</span>
                  <p>该商家支持开发票，请在下单时填写发票抬头</p>
                </div>
                : ''
              }
              { isOnTime ?
                <div className='isOnTime-box'>
                  <span className='isOnTime'>准</span>
                  <p>准时必达，超时10分钟立享赔付</p>
                </div>
                : ''
              }
            </div>
          </div>
        : ''
      }
      {
        Object.keys(photoList).some(i => { return photoList[i].url.length > 0 }) ?
          <div className='rest-photos-container'>
            <h3>商家实景</h3>
            <div className='rest-photos-box'>
              <RestaurantPhoto datas={ photoList } />
            </div>
          </div>
        : ''
      }
      <div className='rest-prove-container'>
        <Item arrow='horizontal' onClick={ () => {
          Mask(
            <SlidePage target='right' type='root'>
              <RestaurantLicense props={ data } />
            </SlidePage>
            , { mask: false }
          )
        } }
        >
          营业资质
        </Item>
      </div>
      <div className='rest-bottom-info-container'>
        <h3>商家信息</h3>
        <p>{ restaurantName }</p>
        <p>{ `地址：${ address }` }</p>
        <p>{ `营业时间：${ servingTime[0] }` }</p>
      </div>
      {
        phoneList.length > 0 ?
          <div className='phoneList-container'>
            <span>商家电话：</span>
            <p>
              {
                isSpecialPhoneCall ?
                  <span style={{ color: '#3385ff', textDecoration: 'underline' }} onClick={ () => {
                    if (isSpecialPhoneCall && specialPhoneCall && typeof specialPhoneCall === 'function') {
                      specialPhoneCall(phoneList[0])
                    } else {
                      console.log('isSpecialPhoneCall else', isSpecialPhoneCall, specialPhoneCall)
                    }
                  } }
                  >{ phoneList[0] }</span>
                :
                  <a href={ `tel:${ phoneList[0] }` } style={{ color: '#3385ff', textDecoration: 'underline' }}>
                    { phoneList[0] }
                  </a>
              }
            </p>
          </div>
        : ''
      }
    </div>
  )
}

// 商家详情页
const restaurantDetail = props => {
  // console.log('restaurantDetail props-----------', props)
  const { restaurantInfo, handleShowAct, showAct, handleBigScroll, handleSmallScroll, handleChangeKey, changedKey = '1', cleanup, deliveryInfo = {} } = props
  const { isOpen = true, restaurantName, pic, isPremium, isVipDelivery, deliverySpent = 0, promotionInfo, activities = [] } = typeof restaurantInfo !== 'undefined' ? restaurantInfo : ''
  const { agentFee = 0 } = deliveryInfo

  return (
    <div className='restaurantDetailContainer' onScroll={ e => handleBigScroll(e) }>
      <div className='restaurantTopInfo' style={{ backgroundImage: `url(${ pic })` }}>
        <div className='filterMask' />
        <div className='infoBox'>
          <div className='infoContainer'>
            <img src={ pic } alt={ restaurantName } />
            <div className='info-right-box'>
              { isPremium ? <span className='isPremium'>品牌</span> : '' }
              <span className='restaurantName'>{ restaurantName }</span><br />
              <span className='deliveryInfo'>{ isVipDelivery ? '蜂鸟专送 / ' : '商家配送 ／ ' }</span>
              {
                deliverySpent ? <span className='deliveryTime'>{ ` ${ deliverySpent }分钟送达` }</span> : ''
              }
              <span className='deliveryTime'>{ `配送费：¥${ agentFee }` }</span>
              { promotionInfo ? <span className='promotionInfo'>{ `公告：${ promotionInfo }` }</span> : '' }
            </div>
          </div>
          {
            activities.length > 0 ? <div className='actContainer' style={{ height: showAct ? 'auto' : '0.4rem' }}>
              {
                activities.map(({ description, type }) => {
                  return (
                    <div key={ `activity${ Math.random() }` } className='activityContainer'>
                      <span className='actTag'>{ type === 1 ? '减' : '折' }</span>
                      <span className='actDescription'>{ description }</span>
                    </div>
                  )
                })
              }
              {
                activities.length > 2 ? <span className={ showAct ? 'hideAct' : 'showAct' } onClick={ () => handleShowAct(showAct ? 0 : 1) }>{ `${ activities.length }个活动` }</span> : ''
              }
            </div> : ''
          }
        </div>
      </div>
      <div className='restaurant-main-container mainWrap' onScroll={ e => handleSmallScroll(e) }>
        <Tabs defaultActiveKey='1' swipeable={ false } onChange={ e => handleChangeKey(e) }>
          <TabPane tab='商品' key='1'>
            <div>
              <Commodity data={ props } />
            </div>
          </TabPane>
          <TabPane tab='商家' key='2'>
            <div style={{ overflowY: 'scroll', height: 'calc(100% - 0.86rem)' }}>
              <Restaurant data={ props } />
            </div>
          </TabPane>
        </Tabs>
      </div>
      <div style={{ display: changedKey === '1' ? 'block' : 'none' }}>
        {
          isOpen ?
            <ShoppingCar data={ props } deleteAll={ restaurantId => { cleanup(restaurantId, props.shoppingCarArray) } } />
          :
            <div className='not-open'>商家休息中,暂不接单</div>
        }
      </div>
    </div>
  )
}

export default restaurantDetail
