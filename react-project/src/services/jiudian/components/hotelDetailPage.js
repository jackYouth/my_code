import React, { Component } from 'react'
import { get }  from 'business'
import { getStore }  from '@boluome/common-lib'
import { Loading }    from '@boluome/oto_saas_web_app_component'
import '../style/hotelDetailPage.scss'

class HotelDetailPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...props,
      datas: this.props.location.state,
    }
  }

  fetchData() {
    const { datas = {} } = this.state
    console.log('datas--------->', this.state)
    const { orderCityId, hotelId, chooseCity = {}, currentCityId = getStore('currentCityId') } = datas
    const { id } = chooseCity
    const handleClose = Loading()
    get(`/jiudian/v1/hotel/${ hotelId }/info`, { hotelId, channel: getStore('channel'), cityId: !orderCityId ? !id ? currentCityId : id : orderCityId })
    .then(({ code, data = {}, message }) => {
      if (code === 0) {
        this.setState({ hotelInfo: data })
      } else {
        console.log(message)
      }
      handleClose()
    }).catch(err => {
      handleClose()
      console.log(err)
    })
  }

  componentWillMount() {
    this.fetchData()
  }

  render() {
    const { hotelInfo = {} } = this.state
    const { address, intro, name, tel } = hotelInfo

    return (
      <div className='HotelDetail-container'>
        <h3 className='hotel-name'>{ name }</h3>
        <div className='main-container'>
          <span className='span1'>联系电话</span>
          <span className='span2'>{ tel }</span>
        </div>
        <div className='main-container'>
          <span className='span1'>酒店地址</span>
          <span className='span2'>{ address }</span>
        </div>
        <div className='main-container'>
          <span className='span1'>酒店介绍</span>
          <span className='span2'>{ intro }</span>
        </div>
      </div>
    )
  }
}

export default HotelDetailPage
