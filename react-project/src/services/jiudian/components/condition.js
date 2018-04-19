import React from 'react'
import { send }  from 'business'
import { getStore } from '@boluome/common-lib'
import { Search, Empty, Loading } from '@boluome/oto_saas_web_app_component'
import ListItem from './ListItem'
import '../style/condition.scss'
import img from '../image/notFound.png'

const Condition = props => {
  console.log('hotel-condition-container props', props)
  const { currentCityId, channel, DistanceType = 0, chooseCity = {} } = props
  const { startDate, endDate } = getStore('dateInfo')

  const handleSearchHotels = (searchKey, callback) => {
    if (searchKey) {
      const postData = {
        channel,
        ArrivalDate:   startDate,
        DepartureDate: endDate,
        CityId:        chooseCity.id ? chooseCity.id : currentCityId,
        QueryText:     searchKey,
        PageSize:      20,
        DistanceType,
        PageIndex:     1,
        lat:           getStore('geopoint', 'session').latitude,
        lng:           getStore('geopoint', 'session').longitude,
        mapType:       'gaode',
      }
      const handleClose = Loading()
      send('/jiudian/v1/hotels', postData)
      .then(({ code, data = {}, message }) => {
        if (code === 0) {
          const { hotels } = data
          console.log('hotels', hotels)
          callback(null, hotels)
        } else {
          console.log(message)
        }
        handleClose()
      }).catch(err => {
        handleClose()
        console.log('handleHotels', err)
      })
    } else {
      callback('searchKey is undefined')
    }
  }

  return (
    <div className='hotel-condition-container'>
      <Search
        inputPlaceholder={ '关键词／位置／品牌／酒店名' }
        content={ <Content props={ props } /> }
        listItem={ <ListItem /> }
        noResult={ <Empty message='未搜索到相关数据' imgUrl={ img } /> }
        onFeach={ handleSearchHotels }
        handleResult={ result => { console.log('result:', result) } }
        rightComponent={ <Cancel /> }
        delayTime={ 1000 }
      />
    </div>
  )
}

export default Condition

const Content = datas => {
  const { props } = datas
  const { chooseFilterCondition, handleShowContent, showIndex = 0, filterConditions = {}, filterZones = {} } = props
  const { brands = [] } = filterConditions
  const { commericalLocations = [], districts = [] } = filterZones
  // console.log('showIndex', showIndex)
  // console.log('content props', props, brands, commericalLocations, districts)
  return (
    <div className='condition-content-container'>
      {
        brands.length > 0 ?
          <div className='brands-container' style={{ height: showIndex === 1 ? 'auto' : '' }}>
            <h3>品牌</h3>
            {
              brands.length > 8 ?
                <i className={ showIndex && showIndex === 1 ? 'slideUp' : 'slideDown' } onClick={ () => handleShowContent(showIndex === 1 ? 0 : 1) } />
              : ''
            }
            <div className='brands-box'>
              {
                brands.map(item => {
                  return (
                    <span key={ item.id } onClick={ () => chooseFilterCondition(item) }>{ item.name }</span>
                  )
                })
              }
            </div>
          </div>
        : ''
      }
      {
        commericalLocations.length > 0 ?
          <div className='commericalLocations-container' style={{ height: showIndex === 2 ? 'auto' : '' }}>
            <h3>商业区</h3>
            {
              commericalLocations.length > 8 ?
                <i className={ showIndex && showIndex === 2 ? 'slideUp' : 'slideDown' } onClick={ () => handleShowContent(showIndex === 2 ? 0 : 2) } />
              : ''
            }
            <div className='commericalLocations-box'>
              {
                commericalLocations.map(item => {
                  return (
                    <span key={ item.id } onClick={ () => chooseFilterCondition(item) }>{ item.name }</span>
                  )
                })
              }
            </div>
          </div>
        : ''
      }
      {
        districts.length > 0 ?
          <div className='districts-container' style={{ height: showIndex === 3 ? 'auto' : '' }}>
            <h3>行政区</h3>
            {
              districts.length > 8 ?
                <i className={ showIndex && showIndex === 3 ? 'slideUp' : 'slideDown' } onClick={ () => handleShowContent(showIndex === 3 ? 0 : 3) } />
              : ''
            }
            <div className='districts-box'>
              {
                districts.map(item => {
                  return (
                    <span key={ item.id } onClick={ () => chooseFilterCondition(item) }>{ item.name }</span>
                  )
                })
              }
            </div>
          </div>
        : ''
      }
    </div>
  )
}

const Cancel = () => {
  return (
    <span className='cancel' onClick={ () => window.history.go(-1) }>取消</span>
  )
}
