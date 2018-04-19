import React from 'react'
import { getStore } from '@boluome/common-lib'
import { Mask, SlidePage, UserCenter, CitySearch, Supplier } from '@boluome/oto_saas_web_app_component'
import { List, Picker } from 'antd-mobile'
import { browserHistory } from 'react-router'
// import vconsole from 'vconsole'
import DateChoose from './dateChoose'
import cleanBtn from '../image/clean.png'
import '../style/index.scss'

const Item = List.Item
const App = props => {
  // console.log('hotel-index-container props', props)
  const localCity = getStore('currentPosition', 'session') ? getStore('currentPosition', 'session').city : ''
  const { myClick, setChannel, currentCityName, cleanChooseConditions, handlePriceFilter, myPosition, handleCityData, priceFilterData = [], chooseCity = {}, chooseConditions = {} } = props
  const currentAddress = getStore('currentAddress', 'session') || currentCityName
  const { name } = chooseCity
  const priceData = [
    [
      {
        label: '不限',
        value: '不限',
      },
      {
        label: '二星以下／经济',
        value: '二星以下／经济',
      },
      {
        label: '三星／舒适型',
        value: '三星／舒适型',
      },
      {
        label: '四星／高档型',
        value: '四星／高档型',
      },
      {
        label: '五星／豪华型',
        value: '五星／豪华型',
      },
    ],
    [
      {
        label: '不限',
        value: '不限',
      },
      {
        label: '¥150以下',
        value: '¥150以下',
      },
      {
        label: '¥150-300',
        value: '¥150-300',
      },
      {
        label: '¥301-450',
        value: '¥301-450',
      },
      {
        label: '¥451-600',
        value: '¥451-600',
      },
      {
        label: '¥601-1000',
        value: '¥601-1000',
      },
      {
        label: '¥1000以上',
        value: '¥1000以上',
      },
    ],
  ]
  return (
    <div className='hotel-index-container'>
      <Supplier categoryCode='jiudian' onChange={ result => setChannel(result) } />
      <div className='infor-container' style={{ marginTop: '.3rem' }}>
        <div className='destination-container'>
          <span>目的地</span>
          <p onClick={ () =>
            Mask(
              <SlidePage target='right' showClose={ false } >
                <CitySearch localCity={ localCity } categoryCode='jiudian' showCancel='true' handleCityData={ handleCityData } api={ `/jiudian/v1/cities?channel=${ getStore('channel') }` } />
              </SlidePage>
              , { mask: false })
            }
          >
            { name ? chooseCity.name : currentAddress }
          </p>
          <span className='my-position' onClick={ () => myPosition() }>当前位置</span>
        </div>
        <DateChoose />
        <div className={ chooseConditions.name ? 'special-color search-container' : 'search-container' } style={{ position: 'relative' }}>
          <Item arrow='horizontal' className='keyWords-search' style={{ height: '0.99rem' }}
            onClick={ () => browserHistory.push('/jiudian/condition') }
          >
            { chooseConditions.name ? chooseConditions.name : '关键字/品牌/酒店/地址' }
          </Item>
          {
            chooseConditions.name ? <img src={ cleanBtn } alt='clean' style={{ position: 'absolute', width: '.4rem', top: '50%', right: '10%', marginTop: '-0.2rem' }} onClick={ () => cleanChooseConditions() } /> : ''
          }
        </div>
        <div style={{ position: 'relative' }} className={ priceFilterData.filter(item => { return item !== '不限' }).length > 0 ? 'special-color' : '' }>
          <Picker mode='time'
            data={ priceData }
            title='星级/价格'
            onChange={ t => handlePriceFilter(t) }
            extra=''
            cols={ 2 }
            cascade={ false }
            value={ priceFilterData }
          >
            <Item arrow='horizontal' className='price-filter' style={{ height: '0.99rem' }}>
              {
                priceFilterData.filter(item => { return item !== '不限' }).length > 0 ? priceFilterData.filter(item => { return item !== '不限' }).join() : '星级/价格'
              }
            </Item>
          </Picker>
          {
            priceFilterData.filter(item => { return item !== '不限' }).length > 0 ? <img src={ cleanBtn } alt='clean' style={{ position: 'absolute', width: '.4rem', top: '50%', right: '10%', marginTop: '-0.2rem' }} onClick={ () => handlePriceFilter([]) } /> : ''
          }
        </div>
      </div>
      <div className='btn-container'>
        <button onClick={ () => browserHistory.push('/jiudian/hotelList') }>查询酒店</button>
      </div>
      <UserCenter categoryCode='jiudian' myClick={ myClick } />
    </div>
  )
}

export default App
