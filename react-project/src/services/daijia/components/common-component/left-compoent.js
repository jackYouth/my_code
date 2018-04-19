import React from 'react'
import { getStore } from '@boluome/common-lib'
import { Mask, SlidePage, CitySearch } from '@boluome/oto_saas_web_app_component'
import { Icon } from 'antd-mobile'

export default class LeftComponent extends React.Component {
  constructor(props) {
    super(props)
    const { selectedAddress } = props
    const localCity = getStore('currentPosition', 'session') ? getStore('currentPosition', 'session').city : ''
    this.state = {
      currentCity: (selectedAddress && selectedAddress.cityName) ? selectedAddress.cityName : localCity,
      localCity,
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
    const { currentCity, localCity } = this.state
    const pStyle = {
      lineHeight:      '.52rem',
      height:          '.52rem',
      fontSize:        '.28rem',
      color:           '#888',
      width:           '100%',
      background:      '#fff',
      paddingLeft:     '.05rem',
      paddingRight:    '.05rem',
      textAlign:       'center',
      overflow:        'hidden',
      borderRadius:    '.08rem',
      position:        'relative',
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
            <CitySearch localCity={ localCity } categoryCode='daijia' showCancel='true' handleCityData={ this.handleCityData } api={ '/basis/v1/daijia/e/cities' } />
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
