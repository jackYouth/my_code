import React from 'react'
import { getStore, setStore } from '@boluome/common-lib'
import { Mask, SlidePage, CitySearch } from '@boluome/oto_saas_web_app_component'
import { Icon } from 'antd-mobile'

export default class LeftComponent extends React.Component {
  constructor(props) {
    super(props)
    this.localCity = getStore('localCity', 'session')
    this.channel = getStore('channel', 'session')
    const { selectedAddress } = props
    const currentCity = selectedAddress ? selectedAddress.name : this.localCity
    this.state = {
      currentCity,
    }
    this.handleCityData = this.handleCityData.bind(this)
    // 如果没有缓存中没有当前品类的城市列表，那就再请求一次，并将对应城市列表和初始当前城市信息缓存到本地
  }
  handleCityData(res) {
    const productType = getStore('currentProduct', 'session').code
    const { handleChangeCurrentCity, myAttribute } = this.props
    this.setState({
      currentCity: res.name,
    })
    setStore(`${ myAttribute }_selectedCity${ productType }`, res, 'session')
    handleChangeCurrentCity(res)
  }
  render() {
    const { currentCity } = this.state
    const { myAttribute } = this.props
    const productType = getStore('currentProduct', 'session').code
    const api = `/yongche/v1/cities/?channel=${ this.channel }&type=${ myAttribute }&productType=${ productType }&`
    const pStyle = {
      lineHeight:   '.52rem',
      height:       '.52rem',
      fontSize:     '.28rem',
      color:        '#888',
      background:   '#fff',
      paddingLeft:  '.05rem',
      paddingRight: '.05rem',
      textAlign:    'center',
      overflow:     'hidden',
      borderRadius: '.08rem',
      position:     'relative',
      marginTop:    '1px',
      border:       '1px solid #e4e4e5',
    }
    const spanStyle = {
      width:        'calc(100% - .3rem)',
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
            <CitySearch localCity={ this.localCity } categoryCode={ this.channel } showCancel='true' handleCityData={ this.handleCityData } api={ api } />
          </SlidePage>
          , { mask: false, style: { position: 'absolute' } })
        }
      >
        <span style={ spanStyle }>{ currentCity }</span>
        <Icon style={ svgStyle } type='down' size='xs' />
      </p>
    )
  }
}
