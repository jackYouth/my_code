import React         from 'react'
import { List, Carousel }      from 'antd-mobile'
import { browserHistory, Link } from 'react-router'
import { Mask, SlidePage }      from '@boluome/oto_saas_web_app_component'
// import HotelDetailPage from './hotelDetailPage'
import RatePlansLayer from './ratePlansLayer'
import DateChoose    from './dateChoose'
import HotelMap      from './hotelMap'
import noRoom        from '../image/notFound.png'
import loc           from '../image/loc.png'
import bed           from '../image/bed.png'
import rightArr      from '../image/rightArr.png'
import emptyImg      from '../image/movie_empty_img.png'
import bigEmpty      from '../image/bigEmpty.png'
import closeMask from './closeMask'
import '../style/details.scss'
import '../style/roomInfoLayer.scss'

const Item = List.Item

const RoomInfoLayer = ({ datas, onShowRooms }) => {
  // console.log('RoomInfoLayer', datas)
  const { id, name, images = [], ext = {}, ratePlans = [] } = datas
  const { area, floor, bedType, facilities = [] } = ext
  return (
    <div className='RoomInfoLayer-container'>
      <div className='layer-title-container'>
        <h3>{ name }</h3>
        <span />
        <i className='layer-title-close' onClick={ () => closeMask() } />
      </div>
      <div className='img-container'>
        {
          images.length > 0 ?
            <Carousel autoplay={ false }>
              {
                images.map(i => {
                  return (
                    <div key={ `hotelImg${ Math.random() }` } className='RoomInfoLayer-img-box'>
                      <img src={ i } alt='img' />
                    </div>
                  )
                })
              }
            </Carousel>
          :
            <div key={ `hotelImg${ Math.random() }` } className='RoomInfoLayer-img-box'>
              <img src={ bigEmpty } alt='img' style={{ width: '100%' }} />
            </div>
        }
      </div>
      <div className='main-container smooth-touch'>
        <div className='main-info-container'>
          { area ? <span className='area-box'>{ `建筑面积${ area }` }</span> : '' }
          { floor ? <span className='floor-box'>{ `楼层${ floor }` }</span> : '' }
          { bedType ? <span className='bedType-box'>{ `${ bedType }` }</span> : '' }
        </div>
        {
          facilities.length > 0 ?
            <div className='facilities-container'>
              {
                facilities.map(({ group, data }) => {
                  return (
                    <div className='facilities-box' key={ Math.random() }>
                      <span className='group-box'>{ `${ group }：` }</span>
                      <p>
                        {
                          data.map(i => {
                            return (
                              <span key={ Math.random() }>{ `${ i }，` }</span>
                            )
                          })
                        }
                      </p>
                    </div>
                  )
                })
              }
            </div>
          : ''
        }
      </div>
      <div className='btn-container'>
        <button onClick={ () => { closeMask(); onShowRooms(id) } }>{ `查看全部${ ratePlans.length }个价格` }</button>
      </div>
    </div>
  )
}

const Detail = props => {
  console.log('Detail props', props)
  const { orderCityId, goOrderPage, handleDateChange, hotelId, showRoomID, showAllRooms, hotelDetail = {}, isLoaded = false, chooseCity = {}, currentCityId } = props
  const { address = '', image, type, recommend = '0%', imageCount = 0, rooms = [] } = hotelDetail
  const hotelName = hotelDetail.name

  return (
    <div className='detailPage-container'>
      <div className='image-box' style={{ backgroundImage: !image ? `url(${ bigEmpty })` : `url(${ image })` }} onClick={ () => browserHistory.push(`/jiudian/imgList?hotelId=${ hotelId }&cityId=${ !orderCityId ? !chooseCity.id ? currentCityId : chooseCity.id : orderCityId }`) }>
        <div className='mask-box' />
        <div className='info-box'>
          <h2>{ hotelName }</h2>
          <span>{ type }</span>
          <i />
          <span>{ `${ recommend }推荐` }</span>
          <span>{ `${ imageCount }张图片` }</span>
        </div>
      </div>
      <div className='hotel-info-container'>
        <Item arrow='horizontal' thumb={ loc } style={{ borderBottom: '0.01rem solid #e5e5e5' }} onClick={ () =>
          Mask(
            <SlidePage target='right' showClose={ false }>
              <HotelMap data={ props } />
            </SlidePage>
          )
        }
        >{ `地址：${ address }` }</Item>
        <Link to={{ pathname: '/jiudian/hotelDetailPage', state: props }}>
          <Item arrow='horizontal' thumb={ bed } style={{ borderBottom: '0.01rem solid #e5e5e5' }}>详情／设施</Item>
        </Link>
      </div>
      <div className='detail-main-container'>
        <DateChoose onDateChange={ date => handleDateChange(date) } />
        {
          rooms.length > 0 ?
            <div className='roomList-box'>
              {
                rooms.map(({ pic, name, id, info, floor, price, ratePlans = [], images = [] }, i) => {
                  return (
                    <div className='room-box' key={ id }>
                      <div className='room-main-box'>
                        <div className='room-img-box' onClick={ () =>
                            Mask(
                              <div>
                                <RoomInfoLayer datas={ rooms[i] } onShowRooms={ val => showAllRooms(val) } />
                              </div>
                            )
                          }
                        >
                          <img src={ !pic ? emptyImg : pic } alt={ name } />
                        </div>
                        <div className='room-info-box' onClick={ () =>
                            Mask(
                              <div>
                                <RoomInfoLayer datas={ rooms[i] } onShowRooms={ val => showAllRooms(val) } />
                              </div>
                            )
                          }
                        >
                          <h3>{ name }</h3>
                          <span>{ info }</span>
                          <span>{ floor }</span>
                        </div>
                        <div className={ showRoomID === id ? 'room-price-box hide-all-rooms' : 'room-price-box show-all-rooms' } onClick={ () => showAllRooms(showRoomID === id ? 0 : id) }>
                          <span>¥</span>
                          <span>{ price }</span>
                          <span>起</span>
                        </div>
                      </div>
                      {
                        ratePlans.length > 0 && showRoomID === id ?
                          <div className='ratePlans-list-box'>
                            {
                              ratePlans.map(item => {
                                return (
                                  <div className='ratePlans-box' key={ Math.random() }>
                                    <div className='ratePlans-info-box' onClick={ () =>
                                        Mask(
                                          <div>
                                            <RatePlansLayer datas={ item } images={ images } confirmId={ v => { goOrderPage(hotelId, id, v, item, images) } } />
                                          </div>
                                        )
                                      }
                                    >
                                      <div className='ratePlans-info-box-line-one'>
                                        <span>{ item.name }</span>
                                        {
                                          item.isAgent ?
                                            <span className='is-agent'>代理</span>
                                          : ''
                                        }
                                        <img src={ rightArr } alt='rightArr' />
                                      </div>
                                      <div className='ratePlans-info-box-line-two'>
                                        <span>{ item.breakfast }</span>
                                        <i />
                                        <span>{ item.bedType }</span>
                                      </div>
                                      <div className='ratePlans-info-box-line-three'>
                                        <span>{ item.cancelPolicy }</span>
                                        {
                                          !item.instantConfirmation ?
                                            <span>立即确认</span>
                                          : ''
                                        }
                                      </div>
                                    </div>
                                    <div className='ratePlans-price-box'>
                                      <span>¥</span>
                                      <span>{ item.price }</span>
                                    </div>
                                    <div className='ratePlans-btn-box' onClick={ () => { goOrderPage(hotelId, id, item.planId, item, images) } }>
                                      <span>预订</span>
                                      <span>
                                        {
                                          item.paymentType === 'Prepay' ? '在线付' : '到店付'
                                        }
                                      </span>
                                    </div>
                                  </div>
                                )
                              })
                            }
                          </div>
                        : ''
                      }
                    </div>
                  )
                })
              }
            </div>
          :
            isLoaded ?
              <div className='noRoom-container'>
                <div className='noRoom-main'>
                  <img src={ noRoom } alt='没房间了.jpg' />
                  <p>房间已全部订完，您可以选择更改</p>
                  <p>住店时间或者换家酒店预订</p>
                </div>
              </div>
            : ''
        }
      </div>
    </div>
  )
}

export default Detail
