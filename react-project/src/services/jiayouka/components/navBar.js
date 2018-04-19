import React from 'react'
import { Tabs } from 'antd-mobile'
import { getStore } from '@boluome/common-lib'
import { ExchangeActivePopup } from '@boluome/oto_saas_web_app_component'
import MainContainer from '../containers/mainContainer'
import AddNewBtn from './addNewBtn'
import './css/navBar.scss'
import './css/mainContainer.scss'

const TabPane = Tabs.TabPane

const NavBar = props => {
  // console.log('props-=-=-=-==-=-=-=-', props)
  const { handleChange, tabList = [], cardsList = [], oilPrice = [], discountPrice = 0 } = props
  const { currIndex, currId, couponId, actId, getdiscountPrice, SaveOrder } = props
  let sumPrice = 0
  let amount = 0
  let facePrice = 0
  let showInfo = {}

  // console.log('currId', currId)
  if (cardsList.length > 0) {
    if (!currId) {
      showInfo = cardsList[0]
    } else {
      for (let i = 0; i < cardsList.length; i++) {
        if (cardsList[i].id === currId) {
          showInfo = cardsList[i]
          // console.log(showInfo)
        } else {
          // showInfo = cardsList[0]
        }
      }
    }
  }
  // console.log('showInfo-=============------', amount)

  if (oilPrice.length > 0) {
    // console.log('oilPrice', oilPrice)
    if (currIndex && currIndex < oilPrice.length) {
      amount = oilPrice[currIndex].payPrice
      facePrice = oilPrice[currIndex].facePrice
      sumPrice = oilPrice[currIndex].payPrice - discountPrice > 0 ? oilPrice[currIndex].payPrice - discountPrice
                                                                  : 0.01
      // console.log('discountPrice------------',discountPrice);
      // console.log('if-------------------', currIndex)
    } else {
      amount = oilPrice[0].payPrice
      facePrice = oilPrice[0].facePrice
      sumPrice = oilPrice[0].payPrice - discountPrice > 0 ? oilPrice[0].payPrice - discountPrice : 0.01
      // console.log('discountPrice2------------',discountPrice);
      // console.log('else-------------------', currIndex)
    }
  }

  const postData = {}

  if (oilPrice.length > 0) {
    if (currIndex && currIndex < oilPrice.length) {
      postData.productId = oilPrice[currIndex].productId
    } else {
      postData.productId = oilPrice[0].productId
    }
  }

  postData.customerUserId = sessionStorage.customerUserId

  postData.cardId = showInfo.cardId

  postData.categoryId = getStore('categoryId', 'session').toString()

  // 如果例如唯品金融没有用户手机号的情况
  const { noCustomerUserPhone } = window.OTO_SAAS.customer
  if (noCustomerUserPhone) {
    // console.log('noCustomerUserPhone')
    postData.userPhone = showInfo.phone
  } else {
    // console.log('hasCustomerUserPhone')
    postData.userPhone = getStore('userPhone', 'session') || ''
  }

  postData.phone = showInfo.phone

  postData.userName = showInfo.userName

  postData.couponId = getStore('couponId', 'session') ? getStore('couponId', 'session').toString() : couponId

  postData.activityId = actId

  // console.log('postData===========',postData)
  // const thisCategoryId = getStore('categoryId', 'session').toString()

  return (
    <div className='navBar' >
      <Tabs onChange={ key => handleChange(key) } swipeable={ false } defaultActiveKey={ getStore('categoryId', 'session') } >
        {
          tabList.map(({ name, categoryId }) => (
            <TabPane tab={ name } key={ categoryId }>
              {
                cardsList && cardsList.length > 0 ? <MainContainer cardsList={ cardsList } oilPrice={ oilPrice } /> : <AddNewBtn />
              }
            </TabPane>
          ))
        }
      </Tabs>
      {
        cardsList.length > 0 ?
          <div className='bottomBar'>
            <div className='sumPrice'>
              <span style={{ fontSize: '0.28rem' }}>实付：¥</span>
              <span style={{ fontSize: '0.36rem' }}>{ sumPrice.toFixed(2) }</span>
              {
                discountPrice && discountPrice > 0 ? <span style={{ color: '#999', fontSize: '0.28rem', paddingLeft: '0.05rem' }}>{ `优惠¥ ${ discountPrice }` }</span>
                                                      : <span style={{ color: '#999', fontSize: '0.28rem', paddingLeft: '0.15rem', textDecoration: 'line-through' }}>{ facePrice }</span>
              }
              <ExchangeActivePopup orderType='jiayouka' popupStyle={{ height: 'calc(100% - 1.1rem)' }} channel='gaoyang' amount={ typeof amount === 'number' || typeof amount === 'string' ? Number(amount) : 0 } promotionCallback={ e => { console.log('e~~~~~', e); if (e && e.discount >= 0) getdiscountPrice(e) } } />
            </div>
            <button className='saveOrder' onClick={ () => SaveOrder(postData) }>立即充值</button>
          </div>
        : ''
      }
    </div>
  )
}

export default NavBar
