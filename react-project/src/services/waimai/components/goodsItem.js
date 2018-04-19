import React, { Component } from 'react'
import { Mask } from '@boluome/oto_saas_web_app_component'
import AddOrMinusToShoppingCar from '../containers/addOrMinusToShoppingCar'
import '../style/restaurantDetail.scss'
import '../style/commodity.scss'

class GoodsItem extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {}

  componentWillReceiveProps() {}

  componentWillUnmount() {}

  render() {
    const { data, menuCategoryName, activity = {}, foodName, monthSales, satisfyRate, pic, description, attributes = [], specfoods = [], attrs = [], specifications = {} } = this.props

    const iconName = attributes[0] ? attributes[0].iconName : ''
    const iconColor = attributes[0] ? attributes[0].iconColor : ''
    const reg = /w\/150\/h\/150/g
    const bigPic = pic.replace(reg, 'w/300/h/300')

    return (
      <div className='food-box'>
        {
          iconName ? <div className='food-logo-box' style={{ backgroundColor: iconColor }}><span className='food-logo'>{ iconName }</span></div> : ''
        }
        <img src={ pic } alt={ foodName } onClick={ () => Mask(
          <div className='productLayer'>
            <img src={ bigPic } alt={ foodName } />
            <div className='layer-inforBox'>
              <p>{ foodName }</p>
              <div className='layer-bottom-box'>
                <span className='month-sales'>{ `月售${ monthSales }份` }</span>
                {
                  satisfyRate > 0 ? <span className='satisfy-rate'>{ `好评率${ satisfyRate }%` }</span> : ''
                }
                <span className='layer-price'>{ `¥${ specfoods[0].price }` }</span>
              </div>
            </div>
          </div>
          , { mask: true }
        ) }
        />
        <div className='food-info' onClick={ () => Mask(
          <div className='productLayer'>
            <img src={ bigPic } alt={ foodName } />
            <div className='layer-inforBox'>
              <p>{ foodName }</p>
              <div className='layer-bottom-box'>
                <span className='month-sales'>{ `月售${ monthSales }份` }</span>
                {
                  satisfyRate > 0 ? <span className='satisfy-rate'>{ `好评率${ satisfyRate }%` }</span> : ''
                }
                <span className='layer-price'>{ `¥${ specfoods[0].price }` }</span>
              </div>
            </div>
          </div>
          , { mask: true }
        ) }
        >
          <p className='food-name'>{ foodName }</p>
          {
            description !== 'undefined' ? <span className='description'>{ description }</span> : ''
          }
          <span className='month-sales'>{ `月售${ monthSales }份` }</span>
          {
            satisfyRate > 0 ? <span className='satisfy-rate'>{ `好评率${ satisfyRate }%` }</span> : ''
          }
          {
            specfoods.length > 1 ? <span className='many-kinds'>多规格</span> : ''
          }
          {
            activity.imageText ?
              <div style={{ marginTop: '0.16rem' }}>
                <span style={{ border: `1px solid #${ activity.imageTextColor }`, color: `#${ activity.imageTextColor }`, fontSize: '0.18rem', padding: '0 0.05rem' }}>
                  { activity.imageText }
                </span>
              </div>
            : ''
          }
          <div className='food-price'>
            <span>¥ </span>
            <span>{ specfoods[0].price }</span>
            {
              specfoods[0].originalPrice ?
                <span style={{ color: '#adadad', fontSize: '0.18rem', textDecoration: 'line-through', marginLeft: '0.1rem' }}>{ `¥ ${ specfoods[0].originalPrice }` }</span>
              : ''
            }
          </div>
        </div>
        <div className='add-minus-container'>
          {
            specfoods.every(({ stock }) => { return stock <= 0 }) ? <span className='sold-out'>已售完</span> : <AddOrMinusToShoppingCar data={ data } specfoods={ specfoods } attrs={ attrs } specifications={ specifications } activity={ activity } menuCategoryName={ menuCategoryName } />
          }
        </div>
      </div>
    )
  }
}

export default GoodsItem
