import React from 'react'
import { Icon } from 'antd-mobile'
import { getStore, setStore } from '@boluome/common-lib'
import { Mask, SlidePage, AddressSearchGaode, CitySearch } from '@boluome/oto_saas_web_app_component'
import '../style/index.scss'
import loctionImg from '../image/location.png'
import banner from '../image/banner0.png'

class LeftComponent extends React.Component {
  static defaultProps = {
    localCity: getStore('localCity', 'session'),
  }
  constructor(props) {
    super(props)
    const { selectedAddress } = props
    const localCity = getStore('localCity', 'session')
    this.state = {
      currentCity: (selectedAddress && selectedAddress.cityName) ? selectedAddress.cityName : localCity,
    }
    this.handleCityData = this.handleCityData.bind(this)
  }
  handleCityData(res) {
    const { handleChangeCurrentCity } = this.props
    this.setState({
      currentCity: res.name,
    })
    handleChangeCurrentCity(res)
  }
  render() {
    const { currentCity } = this.state
    const localCity = this.props.localCity || getStore('currentPosition', 'session').city

    const pStyle = {
      lineHeight:   '.52rem',
      height:       '.52rem',
      fontSize:     '.28rem',
      color:        '#888',
      width:        '100%',
      background:   '#fff',
      paddingLeft:  '.05rem',
      paddingRight: '.05rem',
      textAlign:    'center',
      overflow:     'hidden',
      borderRadius: '.08rem',
      position:     'relative',
    }
    const spanStyle = {
      width:        '1rem',
      textOverflow: 'ellipsis',
      overflow:     'hidden',
      whiteSpace:   'nowrap',
      display:      'inline-block',
      float:        'left',
    }
    const svgStyle = {
      position:        'absolute',
      top:             '50%',
      transform:       'translateY(-50%)',
      WebkitTransform: 'translateY(-50%)',
      right:           '3px',
    }

    return (
      <p style={ pStyle } onClick={ () =>
        Mask(
          <SlidePage target='right' showClose={ false } >
            <CitySearch localCity={ localCity } categoryCode='waimai' showCancel='true' handleCityData={ this.handleCityData } api={ '/basis/v1/waimai/ele/cities' } />
          </SlidePage>
          , { mask: false })
        }
      >
        <span style={ spanStyle }>{ currentCity }</span>
        <Icon style={ svgStyle } type='down' size='xs' />
      </p>
    )
  }
}

const App = props => {
  const currentAddress = getStore('currentAddress', 'session')
  const point = getStore('geopoint', 'session')
  // console.log(props)
  const { entryArr = [], hotels = [], scenicList = [], currentCityId = '', currentCityName = '', handleSuccess, selectedAddress = {} } = props
  const selectedAddressName = selectedAddress.name
  const selectedCity = selectedAddress.city
  return (
    <div className='shanglv-container'>
      <div className='loction-container' onClick={ () => {
        Mask(
          <SlidePage target='right' showClose={ false } >
            <AddressSearchGaode LeftComponent={ LeftComponent } { ...point } selectedAddress='' onSuccess={ v => handleSuccess(v, currentCityId) } noFocus={ 1 } />
          </SlidePage>
          , { mask: false })
      } }
      >
        <span>{ !selectedAddressName ? currentAddress : selectedAddressName }</span><img src={ loctionImg } alt='loc' />
      </div>
      <div className='banner-container'><img src={ banner } alt='banner' /></div>
      <div className='entry-container'>
        {
          entryArr.length > 0 ?
            entryArr.map(({ name, img, url }) => (
              <div className='entry-item' key={ `entry-${ name }` } onClick={ () => window.location.href = url }>
                <img src={ img } alt={ name } />
                <span>{ name }</span>
              </div>
            ))
          : ''
        }
      </div>
      <div className='main-container'>
        <h3 style={{ padding: '.3rem' }}><span />推荐服务</h3>
        <div className='jiudian-banner'>
          <div className='outer-box'>
            <div className='inner-box' onClick={ () => window.location.href = `${ window.location.origin }/jiudian/?customerUserId=${ getStore('customerUserId', 'session') }&customerUserPhone=${ getStore('userPhone', 'session') }` }>
              <h3>行宿{ !selectedCity ? currentCityName : selectedCity }</h3>
              <span>诗韵醉人 尊贵享受</span>
              <div>查看全部</div>
            </div>
          </div>
        </div>
        <div className='jiudian-box'>
          {
            hotels.map(({ name, pic, price, distance, id }) => {
              return (
                <div className='jiudian-item' key={ `hotels-${ name }` } onClick={ () => {
                  setStore('channel', 'ctrip')
                  window.location.href = `${ window.location.origin }/jiudian/details?id=${ id }&orderCityId=${ currentCityId }`
                } }
                >
                  <img src={ pic } alt={ name } />
                  <div className='infor-box'>
                    <h3>{ name }</h3>
                    <span>{ `¥ ${ price }起` }</span>
                    <span className='distance'>{ distance }</span>
                  </div>
                </div>
              )
            })
          }
        </div>
        <div className='menpiao-banner'>
          <div className='outer-box'>
            <div className='inner-box' onClick={ () => window.location.href = `${ window.location.origin }/menpiao/?customerUserId=${ getStore('customerUserId', 'session') }&customerUserPhone=${ getStore('userPhone', 'session') }` }>
              <h3>玩转{ !selectedCity ? currentCityName : selectedCity }</h3>
              <span>出行旅游 轻松自由</span>
              <div>查看全部</div>
            </div>
          </div>
        </div>
        <div className='menpiao-box'>
          {
            scenicList.map(({ name, image, price, disName, id }) => {
              return (
                <div className='menpiao-item' key={ `menpiao-${ name }` } onClick={ () => {
                  setStore('itemId', id, 'session')
                  window.location.href = `${ window.location.origin }/menpiao/details`
                } }
                >
                  <img src={ image } alt={ name } />
                  <div className='infor-box'>
                    <h3>{ name }</h3>
                    <span>{ `¥ ${ price }起` }</span>
                    <span className='distance'>距您约{ disName }</span>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default App
