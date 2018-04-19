import React from 'react'
import { getStore } from '@boluome/common-lib'
import { Listview, Empty, Mask, SlidePage } from '@boluome/oto_saas_web_app_component'
import { browserHistory } from 'react-router'
import { Picker } from 'antd-mobile'
import DateChoose from './dateChoose'
import ListItem from './ListItem'
import Weizhi from './weizhi'
import Shaixuan from './shaixuan'
import Paixu from './paixu'
import '../style/hotelList.scss'
import noBusiness from '../image/notFound.png'
import closeMask from './closeMask'

const TopComponent = ({ data }) => {
  const dateInfo = getStore('dateInfo')
  const { cleanChooseConditions, chooseConditions = {} } = data
  const { name } = chooseConditions
  const { startDate, endDate } = dateInfo
  // console.log('TopComponent data', data)
  return (
    <div className='index-page-topComponent-container'>
      <div className='topComponent-show-box'>
        <div className='date-box'
          onClick={ () =>
            Mask(
              <div className='choose-date-layer'>
                <DateChoose />
                <div className='btn-box'>
                  <button onClick={ () => closeMask() } >完成</button>
                </div>
              </div>
            , { maskStyle: { top: '1rem' } })
          }
        >
          <span>{ `住 ${ (startDate).substring(5) }` }</span>
          <span>{ `离 ${ (endDate).substring(5) }` }</span>
        </div>
        <div className='search-box' onClick={ () => browserHistory.push('/jiudian/condition') }>{ !name ? '关键词/位置/品牌/酒店名' : name }</div>
        {
          name ?
            <span className='cleanKeyWords' onClick={ () => cleanChooseConditions() } />
          : ''
        }
      </div>
    </div>
  )
}

const HotelList = props => {
  // console.log('hotelList props', props)
  const { DistrictId = [], Facilities = [], ThemeIds = [], BrandId = [], Zone = [], Sort, handlePriceFilter, handleWeizhi, handleShaixuan, handlePaixuChange, handleFetchMore, offset = 0, fetchData, priceFilterData = [] } = props
  const channel = getStore('channel')
  const { isFromDetail, restList = [], handleScrollTop } = props
  const chooseCity = getStore('chooseCity', 'session') || {}
  const currentCityId = getStore('currentCityId') || ''
  const { id } = chooseCity
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
  const postData = {
    channel,
    cityId: !id ? currentCityId : id,
  }
  const weizhiPostData = {
    channel,
    cityId: !id ? currentCityId : id,
  }
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <div className='listview-container'>
        <Listview
          offset={ offset }
          fetchData={ fetchData }
          onFetch={ handleFetchMore }
          listItem={ <ListItem data={ props } handleScrollTop={ handleScrollTop } /> }
          noOneComponent={ <Empty message='暂无数据' imgUrl={ noBusiness } style={{ top: '1rem' }} /> }
          topComponent={ <TopComponent data={ props } /> }
          dataList={ isFromDetail ? restList : [] }
        />
      </div>
      <div className='list-bottom-container'>
        <span className={ BrandId.length > 0 || ThemeIds.length > 0 || Facilities.length > 0 ? 'choosen-shaixuan shaixuan-box' : 'shaixuan-box' } onClick={ () =>
          Mask(
            <SlidePage target='right' showClose={ false } style={{ backgroundColor: '#f3f3f4' }}>
              <Shaixuan data={ props } api='/jiudian/v1/filterConditions' postData={ postData } shaiuxuanChange={ e => handleShaixuan(e) } />
            </SlidePage>
          )
        }
        >综合筛选</span>
        <span className={ DistrictId.length > 0 || Zone.length > 0 ? 'choosen-weizhi weizhi-box' : 'weizhi-box' } onClick={ () =>
          Mask(
            <SlidePage target='right' showClose={ false } style={{ backgroundColor: '#f3f3f4' }}>
              <Weizhi data={ props } api={ `/jiudian/v1/city/${ !id ? currentCityId : id }/zones` } postData={ weizhiPostData } weizhiChange={ e => handleWeizhi(e) } />
            </SlidePage>
          )
        }
        >区域位置</span>
        <div className='jiage-container'>
          <Picker mode='time'
            data={ priceData }
            title='星级/价格'
            onChange={ t => handlePriceFilter(t) }
            extra=''
            cols={ 2 }
            cascade={ false }
            value={ priceFilterData }
          >
            <span className={ priceFilterData.length > 0 ? 'choosen-jiage jiage-box' : 'jiage-box' }>星级/价格</span>
          </Picker>
        </div>
        <span className={ Sort ? 'choosen-paixu paixu-box' : 'paixu-box' } onClick={ () =>
          Mask(
            <SlidePage target='bottom' showClose={ false } style={{ height: '6rem', top: 'calc(100% - 6rem)' }}>
              <Paixu data={ props } handleChange={ e => handlePaixuChange(e) } />
            </SlidePage>
          )
        }
        >排序</span>
      </div>
    </div>
  )
}

export default HotelList
