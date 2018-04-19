import React from 'react'
import { Icon } from 'antd-mobile'

import '../../styles/specification.scss'

export default class Specification extends React.Component {
  constructor(props) {
    super(props)
    const { currentSpec = '' } = props
    // let currentIndex = ''
    // if (currentSpec) {
    //   specificationsList.forEach((item, index) => {
    //     if (item.specificationsId === currentSpec.specificationsId) {
    //       currentIndex = index
    //       return
    //     }
    //   })
    // }
    this.state = {
      currentSpec,
    }
  }
  handleGoodClick(currentSpec) {
    const { handleSpecClick } = this.props
    handleSpecClick(currentSpec)
    this.setState({ currentSpec })
  }
  render() {
    const { currentSpec } = this.state
    const { specificationsList, serviceThumbnailImg, handleBtnClick, goodDetails, statusDescription, handleCloseClick, unitName } = this.props
    let { sellPrice, maxSellPrice } = this.props
    let commodityName = '请选择商品规格'
    let originalPrice = ''
    if (currentSpec) {
      sellPrice = currentSpec.sellPrice
      maxSellPrice = currentSpec.maxSellPrice
      commodityName = currentSpec.commodityName
      originalPrice = currentSpec.originalPrice
    }
    let priceText = `价格：¥${ sellPrice }/${ unitName }`
    if (maxSellPrice) priceText = `价格：¥${ sellPrice } ~ ¥${ maxSellPrice }/${ unitName }`
    if (currentSpec) priceText = `价格：¥${ currentSpec.sellPrice }/${ unitName }`
    return (
      <div className='specification'>
        <Icon className='close-icon' type='cross' size='md' onClick={ handleCloseClick } />
        <div className='header'>
          <div className='specification-left'>
            <img src={ serviceThumbnailImg } alt='商品图片' />
          </div>
          <ul className='specification-right'>
            <li className='price'>
              { priceText }
              {
                sellPrice !== originalPrice && currentSpec &&
                <del>{ ` ¥${ originalPrice }` }</del>
              }
            </li>
            <li className='selected-info'>{ commodityName }</li>
          </ul>
        </div>
        <ul className='specification-list'>
          <h1>请选择需购买的规格</h1>
          {
            specificationsList.map((item, index) => {
              const isSelect = currentSpec && (currentSpec.specificationsId === item.specificationsId)
              return (
                <li
                  style={ index % 2 === 1 ? { float: 'right' } : {} }
                  onClick={ () => { if (!isSelect) this.handleGoodClick(item) } }
                  key={ item.specificationsId }
                  className={ isSelect ? 'active' : '' }
                >
                  { item.commodityName }
                </li>
              )
            })
          }
        </ul>
        <p className={ !statusDescription && currentSpec ? 'button active' : 'button' } onClick={ () => { if (!statusDescription && currentSpec) handleBtnClick({ goodDetails, currentSpec }) } }>立即购买</p>
      </div>
    )
  }
}
