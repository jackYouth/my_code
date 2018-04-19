import React, { Component } from 'react'
import { Mask } from '@boluome/oto_saas_web_app_component'
import '../style/restaurantLicense.scss'

// 商家资质
class RestaurantLicense extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  showRestPhoto(businessLicenseImage) {
    const handleClose =  Mask(
      <div className='restPhotoShow-box'>
        <img src={ businessLicenseImage } alt='showphoto'
          onLoad={ e => { e.target.style.marginTop = -e.target.height / 2 } }
          onClick={ () => { handleClose() } }
        />
      </div>
      , { mask: true }
    )
  }

  render() {
    const { props } = this.props
    const { restaurantInfo } = props
    const { restaurantLicense } = restaurantInfo
    const { businessLicenseImage, cateringServiceLicenseImage } = restaurantLicense
    return (
      <div className='restaurant-license-container'>
        <div className='photo-container'>
          <h3>商家从业资质</h3>
          <div className='photo-box'>
            <div className='businessLicenseImage'
              onClick={ () => this.showRestPhoto(businessLicenseImage) }
            >
              <img src={ businessLicenseImage } alt='businessLicenseImage' />
            </div>
            <div className='cateringServiceLicenseImage'
              onClick={ () => this.showRestPhoto(cateringServiceLicenseImage) }
            >
              <img src={ cateringServiceLicenseImage } alt='cateringServiceLicenseImage' />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default RestaurantLicense
