import React from 'react'
import { Icon } from 'antd-mobile'

import SellPrice from '../../common-component/sell-price'

import '../../../styles/main/commodity-detail/parameters.scss'

export default class Parameters extends React.Component {
  constructor(props) {
    super(props)
    console.log('props', props)
  }
  render() {
    const { commodityDetail, handleSelectParams, currentParamsInfo, onClose, handleChangeNum, currentNum, handleClickCartOrPay, selectCommodity, buttonType } = this.props
    const { banners, parameters, prices, checkNum } = commodityDetail
    let { sellPrice, maxSellPrice } = commodityDetail
    const { paramsList, currentPriceInfo } = currentParamsInfo
    let { newParameters } = currentParamsInfo
    let currentInventory = ''
    if (!newParameters) newParameters = parameters
    if (currentPriceInfo) {
      sellPrice = currentPriceInfo.sellPrice
      maxSellPrice = currentPriceInfo.maxSellPrice
      currentInventory = currentPriceInfo.inventory
    }
    // 如果只有一种规格选项时，要先根据库存给规格打标记
    if (parameters.length === 1) {
      prices.forEach(o => {
        if (!o.inventory) {
          parameters[0].subParameters = parameters[0].subParameters.map(oo => {
            if (oo.parameterId === o.specificationItems[0]) oo.noInvertory = true
            return oo
          })
        }
      })
    }
    return (
      <div className='parameters' onClick={ e => e.stopPropagation() }>
        <div className='parameters-header' onTouchMove={ e => e.preventDefault() }>
          <Icon onClick={ onClose } className='close' type='cross' size='lg' />
          <p className='parameters-header-left'><span style={{ background: `url(${ banners[0] }) no-repeat center center` }} /></p>
          <div className='parameters-header-right'>
            <SellPrice { ...{ sellPrice, maxSellPrice } } />
            {
              currentInventory !== '' &&
              <p className='inventory'>{ `库存${ currentInventory }件` }</p>
            }
            <p className='parameters-text line-2'>{ selectCommodity }</p>
          </div>
        </div>
        <div className='parameters-middle-container' onClick={ e => e.stopPropagation() } ref={ node => this.node = node } onTouchMove={ e => this.node.scrollHeight <= this.node.offsetHeight && e.preventDefault() }>
          <div className='parameters-middle'>
            <ul className='parameters-list-container'>
              {
                newParameters.map(o => (
                  <li key={ o.parameterId }>
                    <h1>{ o.parameterName }</h1>
                    <div className='parameters-list'>
                      {
                        o.subParameters.map(oo => {
                          const disabled = oo.noInvertory
                          const actived = paramsList[o.parameterId] && oo.parameterId === paramsList[o.parameterId].id
                          let cName = ''
                          if (disabled) cName = 'disabled'
                          if (actived) cName = 'active'
                          return (
                            <p
                              onClick={ () => {
                                if (!disabled && !actived) {
                                  // 设置当前选中的一级规格对应的二级规格信息
                                  paramsList[o.parameterId] = { name: oo.parameterName, id: oo.parameterId }
                                  handleSelectParams(o.parameterId, paramsList, prices, parameters, currentNum)
                                }
                              } }
                              className={ cName }
                              key={ oo.parameterId }
                            >
                              { oo.parameterName }
                            </p>
                          )
                        })
                      }
                    </div>
                  </li>
                ))
              }
            </ul>
            <div className='commodity-count'>
              <p>购买数量</p>
              <p>
                <span onClick={ () => currentNum > 1 && handleChangeNum(0, currentNum, currentPriceInfo) }>-</span>
                <span>{ currentNum }</span>
                <span onClick={ () => handleChangeNum(1, currentNum, currentPriceInfo, checkNum) }>+</span>
              </p>
            </div>
          </div>
        </div>
        {
          buttonType ?
            <div className='parameters-footer' onTouchMove={ e => e.preventDefault() }>
              <p style={{ width: '100%', background: '#ff6e19' }} onClick={ () => handleClickCartOrPay(currentParamsInfo, commodityDetail, currentNum, buttonType, true) }>确定</p>
            </div> :
            <div className='parameters-footer' onTouchMove={ e => e.preventDefault() }>
              <p onClick={ () => handleClickCartOrPay(currentParamsInfo, commodityDetail, currentNum, 'cartCommoditys', true) }>加入购物车</p>
              <p onClick={ () => handleClickCartOrPay(currentParamsInfo, commodityDetail, currentNum, 'orderCommoditys', true) }>立即购买</p>
            </div>
        }
      </div>
    )
  }
}
