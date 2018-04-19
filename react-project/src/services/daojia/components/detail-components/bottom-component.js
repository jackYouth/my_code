import React from 'react'
import { parseQuery } from '@boluome/common-lib'
import { Mask } from '@boluome/oto_saas_web_app_component'
import { flatten } from 'ramda'

import ImageListMask from '../image-list-mask'

export default class BottomComponent extends React.Component {
  constructor(props) {
    super(props)
    console.log('class_props', props)
  }
  render() {
    const { goodDetails, currentAddress, bottomComponentStyle } = this.props
    const { duration, serviceDetailsData, serviceAreaVOs, updateBefore, wait, deductAfter, deductPercentage, undeductBefore } = goodDetails
    const supportThisCity = parseQuery(location.search).supportThisCity
    let imgs = serviceDetailsData.filter(o => o.imgList.length > 0).map(o => {
      const imgList = o.imgList.map(oo => ({ url: oo.imgUrl, text: oo.imgDesc }))
      return imgList
    })
    imgs = flatten(imgs)
    return (
      <div className='detail-bottom detail-container' style={ bottomComponentStyle }>
        <ul className='service-list'>
          <li>
            <div className='service-title'>
              <p />
              <p>服务区域</p>
            </div>
            <div className='service-content'>{ supportThisCity === 'false' ? `您的地址（${ currentAddress }）暂不支持该服务` : `您的地址（${ currentAddress }）支持该服务` }</div>
          </li>
          <li className='server-feature'>
            <p className='title' onClick={ () => Mask(<SupportArea { ...{ serviceAreaVOs } } />) }>查看支持区域</p>
          </li>
          {
            duration &&
            <li>
              <div className='service-title'>
                <p />
                <p>服务时长</p>
              </div>
              <div className='service-content'>{ `${ duration }分钟` }</div>
            </li>
          }
          {
            serviceDetailsData && serviceDetailsData.length > 0 &&
            serviceDetailsData.map(item => {
              if (item.title === '退款、修改订单注意事项') {
                return (
                  <li key={ item.title }>
                    <div className='service-title'>
                      <p />
                      <p>{ item.title }</p>
                    </div>
                    <h1 className='text'>
                      { `1、如需修改订单，请提前${ updateBefore }天致电客服热线改约，更改时间以反馈的可预约时间为准。` }<br />
                      { `2、若因用户原因导致无法入户服务，工程师将在等待${ wait }分钟后自行离开视同服务。` }<br />
                      { `3、服务预约时间开始前${ deductAfter }小时内取消订单，扣除订单金额的${ deductPercentage }%作为违约金：服务前${ undeductBefore }小时 外取消订单，全额退款。` }
                    </h1>
                  </li>
                )
              }
              return (
                <li key={ item.title }>
                  <div className='service-title'>
                    <p />
                    <p>{ item.title }</p>
                  </div>
                  {
                    item.content &&
                    <div className='service-content'>{ item.content }</div>
                  }
                  {
                    item.imgList && item.imgList.map(ii => (
                      <div key={ ii.imgUrl } className='service-img-container'>
                        <img src={ ii.imgUrl } alt={ ii.imgDesc } onClick={ () => Mask(<ImageListMask { ...{ imgs, currentImgUrl: ii.imgUrl } } />, { maskStyle: { background: '#1f1f1f', opacity: '1' } }) } />
                      </div>
                    ))
                  }
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }
}


const SupportArea = ({ serviceAreaVOs }) => (
  <div className='support-area'>
    <p className='support-area-title'>该服务支持区域</p>
    <table>
      <thead>
        <tr>
          <td>{ serviceAreaVOs[0].city }</td>
          <td>{ serviceAreaVOs[0].countyList.join('、') }</td>
        </tr>
      </thead>
      <tbody>
        {
          serviceAreaVOs && serviceAreaVOs.length > 0 &&
          serviceAreaVOs.map((item, index) => {
            if (index > 0) {
              return (
                <tr key={ item.city }>
                  <td>{ item.city }</td>
                  <td>{ item.countyList.join('、') }</td>
                </tr>
              )
            }
            return false
          })
        }
      </tbody>
    </table>
  </div>
)
