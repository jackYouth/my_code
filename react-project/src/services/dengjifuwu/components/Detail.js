import React from 'react'
import { List, Carousel, Picker } from 'antd-mobile'
import { browserHistory } from 'react-router'
import '../style/detail.scss'
import loc from '../image/grayLoc.png'
import notice from '../image/notice.png'

const Item = List.Item
const Detail = props => {
  console.log('Detail props-------', props)
  const { thisData = {}, handleChooseTimes, chooseTimes } = props
  console.log('thisData', thisData)
  const { regulations, international, hoursSection, areaName, price, airportTerminal, loungeAddress, facilities, image = [] } = thisData
  const newDeliveryTimes = []
  if (international === '0') {
    for (let i = 1; i < 11; i++) {
      newDeliveryTimes.push({ label: `${ i }次`, value: `${ i }次` })
    }
  } else {
    newDeliveryTimes.push({ label: '1次', value: '1次' })
  }
  return (
    <div className='detail-container'>
      <div className='detail-main-container'>
        <div className='img-box'>
          <Carousel autoplay={ false } selectedIndex={ 0 } style={{ height: '100%' }}>
            {
              image.map(i => {
                return (
                  <img src={ i } alt='img' key={ `restaurantPhotoKey${ Math.random() }` } style={{ height: '100%' }} />
                )
              })
            }
          </Carousel>
        </div>
        <div className='title-info basisSpan'>
          <span className='areaName'>{ areaName }</span>
          <span className='hoursSection'>{ hoursSection }</span>
        </div>
        <div className='price basisSpan'>
          <span>单次购买价格</span>
          <span>{ `¥ ${ price }` }</span>
        </div>
        <Picker mode='time'
          data={ newDeliveryTimes }
          value={ chooseTimes }
          title='选择次数'
          onChange={ t => handleChooseTimes(t) }
          extra='1次'
          cols={ 1 }
        >
          <Item arrow='horizontal' style={{ margin: '0.22rem 0' }}>使用次数</Item>
        </Picker>
        <Item thumb={ loc } style={{ borderBottom: '0.01rem solid #e5e5e5' }}>位置说明</Item>
        <div className='airportTerminal basisSpan'>
          <span>航站楼</span>
          <span>{ airportTerminal }</span>
        </div>
        <div className='loungeAddress'>
          <span>位置</span>
          <span>{ loungeAddress }</span>
        </div>
        <Item thumb={ notice } style={{ borderBottom: '0.01rem solid #e5e5e5' }}>服务须知</Item>
        <div className='facilities'>
          <span>提供设施及服务</span>
          <span>{ facilities }</span>
        </div>
        <div className='regulations'>
          <span>相关规定</span>
          <span>{ regulations }</span>
        </div>
        <div className='times basisSpan'>
          <span>有效期限</span>
          <span>购买成功后三个月</span>
        </div>
      </div>
      <div className='buy-btn' onClick={ () => browserHistory.push('/dengjifuwu/Order') }>立即购买</div>
    </div>
  )
}

export default Detail
