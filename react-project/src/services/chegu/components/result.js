import React from 'react'
import moment from 'moment';
import { Link , browserHistory } from 'react-router'
import { DatePicker , List , Popup , Button, Icon , Toast} from 'antd-mobile';
import { Mask, SlidePage, CitySearch } from '@boluome/oto_saas_web_app_component'
import { setStore, getStore } from '@boluome/common-lib'
import { Lifecycle } from 'react-router'
import './style/result.scss'

const result = (props) => {

  const { city = {} , date , distance , currentCity = {}, carType, carPrice } = props
  const { evalPrice, price, dealerBuyPrice, dealerPrice, lowPrice, goodPrice, highPrice, title } = carPrice ? carPrice : ''

  return(
    <div>
      <div className='resultTop'>
        <h3>{ title }</h3>
        <ul>
          <li className='city'>
            <div className='containerBox'>
              <span>{ city.name || currentCity.name }</span>
              <span>所在城市</span>
            </div>
          </li>
          <li className='firstDate'>
            <div className='containerBox'>
              <span>{ moment(date).format('YYYY-MM') }</span>
              <span>上牌时间</span>
            </div>
          </li>
          <li className='distance'>
            <div className='containerBox'>
              <span>{ distance }公里 </span>
              <span>行驶里程</span>
            </div>
          </li>
          <li className='emission'>
            <div className='containerBox'>
              <span>国5</span>
              <span>排放标准</span>
            </div>
          </li>
        </ul>
      </div>
      <div className='resultMain'>
        <h3>权威价格数据</h3>
        <div className='sellPriceBox commonStyle'>
          <div className='inforTitle'>
            <h4>估值价（万）</h4>
            <div className='sellPrice commonInfor'>
              <span>{ evalPrice }</span>
              <span>参考价</span>
            </div>
            <div className='priceDetails'>
              <div className='priceDetailsTitle'>
                <span>车况一般</span>
                <span>车况良好</span>
                <span>车况优秀</span>
              </div>
            </div>
            <div className='priceDetailsMain'>
              <span>{ lowPrice }</span>
              <span>{ goodPrice }</span>
              <span>{ highPrice }</span>
            </div>
          </div>

        </div>
        <div className='buyPriceBox commonStyle'>
          <div className='inforTitle'>
            <h4>新车指导价（万）</h4>
            <div className='buyPrice commonInfor'>
              <span>{ price }</span>
              <span>参考价</span>
            </div>
            <div className='priceDetails'>
              <div className='priceDetailsTitle'>
                <span>车商收购价</span>
                <span>车商零售价</span>
              </div>
            </div>
            <div className='priceDetailsMain'>
              <span>{ dealerBuyPrice }</span>
              <span>{ dealerPrice }</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default result
