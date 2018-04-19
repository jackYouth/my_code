import React from 'react'
import { browserHistory } from 'react-router'
// import { Toast } from 'antd-mobile'
import { getStore, setStore } from '@boluome/common-lib'
import { Tourist, SlidePage } from '@boluome/oto_saas_web_app_component'
import '../style/moreDate.scss'

// const alert = Modal.alert
class AddTouristUse extends React.Component {
  static defaultProps = {
    localCity: getStore('localCity', 'session'),
  }
  constructor(props) {
    super(props)
    const minimum = getStore('Orderminimum', 'session')
    if (minimum) {
      this.state = {
        minimum,
      }
    } else {
      this.state = {
        minimum: 1,
      }
    }
    this.handleCityData = this.handleCityData.bind(this)
  }
  handleBackgoorder(contact) {
    // console.log('handleBackgoorder---', contact)
    const { minimum } = this.state
    const goodsCardata = getStore('goodsCardata', 'session')
    if (contact) {
      contact.count = minimum
      setStore('userSelfPhone', contact.userPhone, 'session')
      if (goodsCardata.length > 0) {
        // const s = goodsCardata.filter(p => p.id === contact.id)
        // if (s && s.length > 0) {
        //   Toast.info('选过了')
        // } else {
        goodsCardata.length = 0
        goodsCardata.push(contact)
        // window.location.href = '/menpiao/order'
        window.history.back()
        // }
      } else {
        goodsCardata.push(contact)
        // window.location.href = '/menpiao/order'
        window.history.back()
      }
      setStore('goodsCardata', goodsCardata, 'session')
    } else {
      setStore('goodsCardata', [], 'session')
    }
    // setStore('goodsCardata', goodsCardata, 'session')
    // browserHistory.push('/menpiao/order')
    // window.location.href = '/menpiao/order'
  }
  handleCityData(res) {
    console.log('res-cityData', res)
    browserHistory.push('/menpiao')
  }
  componentWillUnmount() {
    SlidePage.closeAll()
  }
  render() {
    return (
      <div className='addtouristWrap'>
        <Tourist handleChange={ contact => this.handleBackgoorder(contact) } />
      </div>
    )
  }
}

export default AddTouristUse
