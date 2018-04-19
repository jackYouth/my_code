import React from 'react'
import { browserHistory } from 'react-router'
import { MapShowGaode } from '@boluome/oto_saas_web_app_component'
import { getStore } from '@boluome/common-lib'
// import '../style/addrBumap.scss'

class AddrBumap extends React.Component {
  static defaultProps = {
    localCity: getStore('localCity', 'session'),
  }
  constructor(props) {
    super(props)
    const geoPoint = getStore('myaddrPoint', 'session')
    const addrnameStr = getStore('goodsNameAddr', 'session')
    const addrTitlename = getStore('addrTitlename', 'session')

    this.state = {
      geoPoint,
      addrnameStr,
      addrTitlename,
    }
  }
  componentDidMount() {
    // alert('componentDidMount')
  }
  handleCityData(res) {
    console.log('res-cityData', res)

    browserHistory.push('/menpiao')
  }
  render() {
    const { geoPoint, addrTitlename, addrnameStr } = this.state

    const { longitude, latitude } = geoPoint
    // 百度地图API功能
    return (
      <MapShowGaode longitude={ longitude } latitude={ latitude } addrnameStr={ addrnameStr } addrTitlename={ addrTitlename } />
    )
  }
}

export default AddrBumap
