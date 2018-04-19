import React, { Component } from 'react'
import { getStore, setStore } from '@boluome/common-lib'
import { Evaluation } from '@boluome/oto_saas_web_app_component'
import { browserHistory } from 'react-router'
import LazyLoad from 'react-lazyload'
import '../style/index.scss'

// 将用户选择写入历史记录
const resultInHistory = item => {
  const historyArr = getStore('searchHistory') && getStore('searchHistory').length > 0 ? getStore('searchHistory') : []
  // const { restaurantName, restaurantId } = item
  console.log('item', item)
  let searchKey
  if (document.querySelector('#searchInput')) {
    searchKey = document.querySelector('#searchInput').value
  }
  if (searchKey) {
    historyArr.push(searchKey)
  }
  const newArr = []
  historyArr.map(i => {
    if (newArr.indexOf(i) === -1) {
      newArr.push(i)
    } else {
      newArr.push(i)
      newArr.splice(newArr.indexOf(i), 1)
    }
    return newArr
  })
  // console.log('newArr1', newArr)
  // newArr.reverse()
  // console.log('newArr2', newArr)
  // if (newArr.length > 3) {
  //   newArr.length = 3
  // }
  setStore('searchHistory', newArr)
}

// 单个显示商家组件
class ListItem extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleShowAct(showAct) {
    this.setState({ showAct })
  }

  handleShowNum(restArr) {
    return restArr.reduce((count, curr) => {
      if (curr.foods) {
        count = curr.foods.reduce((a, c) => {
          return a += c.quantity
        }, 0)
      } else {
        count += curr.quantity
      }
      return count
    }, 0)
  }

  render() {
    // console.log('this.props-=-=-=-=-=-=-=-=', this.props)
    let { data = {} } = this.props
    const { handleScrollTop } = this.props
    // console.log('data', data)
    if (data.foods) {
      data = data.restaurant
    }
    const { showAct = 0 } = this.state
    const { restaurantName, pic, isPremium, invoice, rating = 0, sales, isOnTime, restaurantId, supportInsurance,
            isVipDelivery, deliveryAmount, agentFee, displayDistance, deliverySpent, activities,
            isNewRestaurant, isOpen,
          } = data
    const shoppingCar = getStore('shoppingCarArray')
    // const customerUserId = getStore('customerUserId', 'session')
    // 可能按需登录没用用户信息默认给空数组
    let restArr = []
    // if (customerUserId) {
    //   restArr = shoppingCar[customerUserId][restaurantId]
    // } else {
    //   restArr = []
    // }
    if (shoppingCar) {
      restArr = shoppingCar[restaurantId]
    } else {
      restArr = []
    }
    // console.log('rating-=-==--=-=-=-=-=-=', rating ? `${ restaurantName } ${ rating.toFixed(2) * 20 }%` : '0%')
    return (
      <div className='restaurantContainer' style={{ paddingBottom: activities.length > 1 ? '0.2rem' : '0rem' }}>
        {
          shoppingCar && Array.isArray(restArr) && restArr.length > 0
          && Object.keys(shoppingCar).filter(item => { return (item).toString() === (restaurantId).toString() })
          && this.handleShowNum(restArr) ?
            <span className='shoppingCarTips'>{ this.handleShowNum(restArr) }</span>
          : ''
        }
        <div className='rest-info'>
          <div className='img-container' onClick={ () => {
            resultInHistory(data)
            browserHistory.push(`/waimai/restaurantDetail?restaurantId=${ restaurantId }`)
            handleScrollTop()
          } }
          >
            <LazyLoad height={ 130 }>
              <img src={ pic } alt={ restaurantName } />
            </LazyLoad>
            {
              !isOpen ?
                <span className='servingTime'>商家休息中</span>
              : ''
            }
            {
              isNewRestaurant ?
                <span className='isNewRestaurant'>新店</span>
              : ''
            }
          </div>
          <div className='rest-info-right'>
            <div onClick={ () => {
              resultInHistory(data)
              browserHistory.push(`/waimai/restaurantDetail?restaurantId=${ restaurantId }`)
              handleScrollTop()
            } }
            >
              <div className='info-container-lineOne'>
                { isPremium ? <span className='isPremium'>品牌</span> : '' }
                <h3 className='restaurantName'>{ restaurantName }</h3>
                { supportInsurance ? <span className='invoice'>保</span> : '' }
                { invoice ? <span className='invoice'>票</span> : '' }
              </div>
              <div className='info-container-lineTwo'>
                <Evaluation defaultValue={ rating ? `${ rating.toFixed(2) * 20 }%` : '0%' } />
                <span className='rating'>{ rating ? rating.toFixed(1) : 0 }</span>
                <span className='sales'>{ `月售${ sales }单` }</span>
                <div className='rightBox'>
                  { isOnTime ? <span className='isOnTime'>准时达</span> : '' }
                  { isVipDelivery ? <span className='isVipDelivery'>蜂鸟专送</span> : '' }
                </div>
              </div>
              <div className='info-container-lineThree'>
                <span className='deliveryAmount'>¥ { deliveryAmount !== undefined ? deliveryAmount : 0 }元起送</span>
                <span className='vertical' />
                <span className='agentFee'>配送费 ¥ { agentFee }</span>
                <div className='rightBox'>
                  <span className='distance'>{ displayDistance }</span>
                  {
                    deliverySpent ? <span className='vertical' /> : ''
                  }
                  {
                    deliverySpent ? <span className='deliverySpent'>{ deliverySpent }分钟</span> : ''
                  }
                </div>
              </div>
            </div>
            { activities && activities.length > 0 ? <span className='horizontal' /> : '' }
            {
              activities.length > 0 ?
                <div className='rest-activities' style={{ height: showAct ? 'auto' : '.7rem' }}>
                  {
                    activities.map(({ description, type }) => {
                      return (
                        <div key={ `activity${ Math.random() }` } className='activityContainer' style={{ marginTop: activities.length >= 2 ? '10px' : '20px', marginBottom: '0px' }}>
                          <span className='actTag'>{ type === 1 ? '减' : '折' }</span>
                          <span className='actDescription'>{ description }</span>
                        </div>
                      )
                    })
                  }
                  {
                    activities.length > 2 ? <span className={ showAct ? 'hideAct' : 'showAct' } onClick={ () => this.handleShowAct(showAct ? 0 : 1) }>{ `${ activities.length }个活动` }</span> : ''
                  }
                </div> : ''
            }
          </div>
        </div>
      </div>
    )
  }

}

export default ListItem
