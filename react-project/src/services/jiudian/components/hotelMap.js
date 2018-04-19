import React, { Component } from 'react'
// import { getStore } from '@boluome/common-lib'
import { Loading } from '@boluome/oto_saas_web_app_component'
import '../style/hotelMap.scss'

class HotelMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataInfo: this.props.data,
    }
    this.mapContainer = ''
  }

  componentDidMount() {
    const closeLoading = Loading()
    const { dataInfo = {} } = this.state
    const { hotelDetail = {} } = dataInfo
    const { latitude, longitude, name } = hotelDetail
    const { Map } = window.AMap
    const point = [longitude, latitude]
    const map = new Map(this.mapContainer, {
      center: point,
      zoom:   18,
    })
    const marker = new window.AMap.Marker({
      position: [longitude, latitude],
    })
    const circle = new window.AMap.Circle({
      center:       [longitude, latitude],
      radius:       100,
      fillOpacity:  0.2,
      strokeWeight: 1,
      fillColor:    '#2e8ffc',
    })
    circle.setMap(map)
    const info = new window.AMap.InfoWindow({
      content: name,
      offset:  new window.AMap.Pixel(0, -28),
    })
    info.open(map, marker.getPosition())
    marker.setMap(map)
    console.log(map, name)
    closeLoading()
  }

  render() {
    console.log('map', this.props)
    return (
      <div className='map-container'>
        <div className='map-box' ref={ node => this.mapContainer = node } />
      </div>
    )
  }
}

export default HotelMap
