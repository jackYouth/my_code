import React from 'react'
import { moment } from '@boluome/common-lib'
import { forceCheck } from 'react-lazyload'
// import { Progress } from 'antd-mobile'

import '../../styles/activity/ttth.scss'

import CountDown from '../common-component/countdown'
import { BuyStep, Price, ActivityCommodityItem } from '../common-component/activity-common'

const Ttth = ({
  ttthData,
  times, activityDay = '', handleChangeActivityDay,
  handletoCommodity,
}) => {
  if (!ttthData) return <div />
  const { banners, activities } = ttthData
  let endTime = 0
  activities.forEach(o => {
    if (endTime < o.endTime) endTime = o.endTime
  })
  if (activityDay === '') activityDay = 0
  // 活动一
  const { commodities } = activities[0]
  const { iconUrl } = commodities[0]
  const { commodityName, commodityDescription, commodityId, sales, total, sellPrice, originalPrice } = commodities[0]
  const spikeOver = activities[0].endTime <= (new Date()).getTime()
  // 活动二
  const brandBuy = activities[1]
  let brandBuyNum = 0
  brandBuy.commodities.forEach(o => brandBuyNum += o.sales)
  // 是否是明日的活动
  const isTomorrow = activityDay === 1

  return (
    <div className='ttth' onScroll={ forceCheck }>
      <div className='banners'>
        <img src={ banners[0] } alt='banners' />
      </div>
      <ul className='list-sort'>
        {
          times.map(o => {
            const { date, title } = o
            let liClassName = ''
            if (activityDay === date) {
              if (date === 1) {
                liClassName = 'green-active'
              } else {
                liClassName = 'active'
              }
            }
            return (
              <li onClick={ () => activityDay !== date && handleChangeActivityDay(date) } className={ liClassName } key={ title }>
                <p>{ title }</p>
                {
                  o.date === 0 &&
                  <CountDown timeHeader='距结束' endTime={ endTime } delDay={ 1 } />
                }
                {
                  o.date === 1 &&
                    <span className='count-down'>{ '00:00开抢' }</span>
                }
              </li>
            )
          })
        }
        <li />
      </ul>
      <section className='spike'>
        <p>
          <span>限时</span>
          <span />
          <span>秒杀</span>
        </p>
        <dl onClick={ () => !spikeOver && !isTomorrow && handletoCommodity(commodityId) }>
          <dt><img src={ iconUrl } alt={ commodityName } /></dt>
          <dd>
            <p className='line-1'>{ commodityName }</p>
            <p className='line-1'>{ commodityDescription }</p>
            <div className='spike-dd-l'>
              {
                isTomorrow ?
                  <p className='green-active-font'>{ `明天${ moment('HH:mm')(activities[0].startTime) }开抢` }</p> :
                  <BuyStep { ...{ sales, total } } />
              }
              <Price spanClassName={ isTomorrow ? 'green-active-font' : '' } { ...{ sellPrice, originalPrice } } />
            </div>
            {
              !isTomorrow &&
              <div className='spike-dd-r'>
                {
                  spikeOver ?
                    <p className='count-down'><span className='disable'>00</span><span className='disable'>00</span><span className='disable'>00</span></p> :
                    <CountDown className='count-down' endTime={ activities[0].endTime } delDay={ 1 } justData={ 1 } />
                }
                <p className={ spikeOver ? 'activity-btn disable' : 'activity-btn' }>秒杀</p>
              </div>
            }
          </dd>
        </dl>
      </section>

      <section className='brand-buy'>
        <ul className='title'>
          <li className={ isTomorrow ? 'green-active-bg' : '' }>品牌抢购</li>
          <li>{ brandBuy.commodities[0].brandName }</li>
          {
            !isTomorrow &&
            <li>{ `已抢${ brandBuyNum }件` }</li>
          }
        </ul>
        <div className='list-commodities'>
          {
            brandBuy.commodities.slice(0, 3).map(o => {
              return (
                <dl key={ o.commodityId } onClick={ () => !isTomorrow && handletoCommodity(o.commodityId) }>
                  <dt><img src={ o.iconUrl } alt={ o.commodityName } /></dt>
                  <dd>
                    <p className='commodity-name line-1'>{ o.commodityName }</p>
                    <Price spanClassName={ isTomorrow ? 'green-active-font' : '' } { ...{ sellPrice: o.sellPrice, originalPrice: o.originalPrice } } />
                  </dd>
                </dl>
              )
            })
          }
        </div>
      </section>
      {
        activities.slice(2).map(o => (
          <section className='activity-3'>
            {
              o.commodities.map(oo => <ActivityCommodityItem data={ oo } key={ oo.commodityId } isTomorrow={ isTomorrow } />)
            }
          </section>
        ))
      }

      <p className='load-complete'>已经全部加载完毕</p>
    </div>
  )
}

export default Ttth
