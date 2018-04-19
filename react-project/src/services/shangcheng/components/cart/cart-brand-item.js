import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { setStore } from '@boluome/common-lib'
import { Icon, Modal } from 'antd-mobile'

import CartCommodityItem from '../common-component/cart-commodity-item'
import PayFooter from '../common-component/pay-footer'

import '../../styles/cart/cart-brand-item.scss'

export default class CartBrandItem extends Component {
  constructor(props) {
    super(props)
    const { data } = props
    const { commodityList } = data
    // 将是否选中商品默认设为false
    commodityList.map(o => {
      o.isSelectCommodity = false
      return o
    })
    // canEdit: 能否进行编辑
    this.state = {
      isSelectBrand:   false,
      orderCommoditys: { totalNum: 0, totalPrice: 0, commodityList },
      canEdit:         false,
      data,
    }
    this.handleCommoditySelect = this.handleCommoditySelect.bind(this)
    this.handlePayClick = this.handlePayClick.bind(this)
    this.setOrderCommoditys = this.setOrderCommoditys.bind(this)
    this.handleDelCommdity = this.handleDelCommdity.bind(this)
    this.changeCartNum = this.changeCartNum.bind(this)
    this.handleClearInvalid = this.handleClearInvalid.bind(this)
  }
  setOrderCommoditys(commodityList, isSelectBrand) {
    let totalPrice = 0
    let totalNum = 0
    commodityList.forEach(o => {
      if (o.isSelectCommodity) {
        totalNum += o.buyNum
        totalPrice += o.buyNum * o.currentPriceInfo.sellPrice
      }
    })
    totalPrice = totalPrice.toFixed(2)
    const orderCommoditys = {
      commodityList,
      totalPrice,
      totalNum,
    }
    this.setState({ orderCommoditys, isSelectBrand })
  }
  handleBrandSelect(isSelectBrand) {
    const { orderCommoditys } = this.state
    const { commodityList } = orderCommoditys
    if (isSelectBrand) {
      commodityList.map(o => o.isSelectCommodity = o.currentPriceInfo.canService)
    } else {
      commodityList.map(o => o.isSelectCommodity = false)
    }
    this.setOrderCommoditys(commodityList, isSelectBrand)
  }
  handleCommoditySelect(index, res) {
    const { orderCommoditys } = this.state
    const { commodityList } = orderCommoditys
    commodityList[index].isSelectCommodity = res
    let isSelectBrand = true
    commodityList.forEach(o => {
      if (!o.isSelectCommodity) isSelectBrand = false
    })
    this.setOrderCommoditys(commodityList, isSelectBrand)
  }
  handlePayClick() {
    const { orderCommoditys } = this.state
    let { commodityList } = orderCommoditys
    commodityList = commodityList.filter(o => o.isSelectCommodity)
    if (commodityList && commodityList.length === 0) return
    const brandId = commodityList[0].brandId
    const brandName = commodityList[0].brandName
    const brandImg = commodityList[0].bigLogoImg
    orderCommoditys.brandId = brandId
    orderCommoditys.brandName = brandName
    orderCommoditys.brandImg = brandImg
    orderCommoditys.commodityList = commodityList
    setStore('orderCommoditys', orderCommoditys)
    browserHistory.push('/shangcheng/order')
  }
  handleEditClick(canEdit) {
    this.setState({ canEdit: !canEdit })
  }
  handleDelCommdity(index, commodityNum) {
    const { handleChangeCommdity, brandIndex, cartCommoditys } = this.props
    const { orderCommoditys } = this.state
    const commodityList = orderCommoditys.commodityList
    commodityList.splice(index, 1)
    this.setState({ orderCommoditys })
    cartCommoditys.brandList[brandIndex].commodityList = commodityList
    cartCommoditys.totalNum -= commodityNum
    handleChangeCommdity(cartCommoditys)
  }
  changeCartNum(index, changeNum) {
    const { handleChangeCommdity, brandIndex, cartCommoditys } = this.props
    const { orderCommoditys } = this.state
    const commodityList = orderCommoditys.commodityList
    commodityList[index].buyNum += changeNum
    this.setState({ orderCommoditys })
    cartCommoditys.brandList[brandIndex].commodityList = commodityList
    cartCommoditys.totalNum += changeNum
    handleChangeCommdity(cartCommoditys)
    // 改变总价
    this.setOrderCommoditys(commodityList)
  }
  handleClearInvalid() {
    const { handleChangeCommdity, brandIndex, cartCommoditys } = this.props
    const { orderCommoditys } = this.state
    let { commodityList } = orderCommoditys
    let changeNum = 0
    // 将当前商品列表中中所有canService为false的字段过滤掉
    commodityList = commodityList.filter(o => {
      if (o.currentPriceInfo.canService) return true
      changeNum += o.buyNum
      return false
    })
    this.setState({ orderCommoditys })
    if (commodityList.length === 0) {
      cartCommoditys.brandList.splice(brandIndex, 1)
    } else {
      cartCommoditys.brandList[brandIndex].commodityList = commodityList
    }
    cartCommoditys.totalNum -= changeNum
    handleChangeCommdity(cartCommoditys)
  }
  handleAlert() {
    Modal.alert('', '确认清空失效商品吗？', [
      { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
      { text: '确定', onPress: this.handleClearInvalid },
    ])
  }

  render() {
    // isOrderPage：表示是不是订单页饮用的商家页标签
    const { data, isOrderPage = false } = this.props
    const { brandName, brandImg } = data
    const { orderCommoditys, isSelectBrand, canEdit } = this.state
    const { totalNum, totalPrice, commodityList } = orderCommoditys
    // showClear：是否显示清除按钮
    let showClear = false
    commodityList.forEach(o => {
      if (!o.currentPriceInfo.canService) {
        showClear = true
      }
    })
    console.log('totalPrice', totalPrice, commodityList)
    return (
      <li className='cart-brand-item'>
        <p className='cart-brand-item-title' style={ isOrderPage ? { paddingLeft: '.3rem' } : {} }>
          {
            !isOrderPage && isSelectBrand &&
            <Icon className='brand-select-icon' onClick={ () => this.handleBrandSelect(false) } type={ require('svg/shangcheng/selected.svg') } size='md' />
          }
          {
            !isOrderPage && !isSelectBrand &&
            <span onClick={ () => this.handleBrandSelect(true) } className='not-select-icon' />
          }
          {
            isOrderPage &&
            <img style={{ marginTop: '.21rem', float: 'left', width: '.34rem', height: '.34rem', marginRight: '.2rem' }} src={ brandImg } alt={ brandName } />
          }
          <span className='brand-name'>{ brandName }</span>
          {
            !isOrderPage &&
            <span className='brand-edit' onClick={ () => this.handleEditClick(canEdit) }>{ canEdit ? '完成' : '编辑' }</span>
          }
        </p>
        <ul className='cart-commodity-list'>
          {
            commodityList.map((o, i) => (
              <CartCommodityItem changeCartNum={ this.changeCartNum } isOrderPage={ isOrderPage } handleDelCommdity={ this.handleDelCommdity } canEdit={ canEdit } key={ o.currentPriceInfo.specificationId } data={ o } index={ i } handleCommoditySelect={ this.handleCommoditySelect } />
            ))
          }
        </ul>
        {
          showClear &&
          <p className='clear-commodies' onClick={ () => this.handleAlert() }>
            <Icon type={ require('svg/shangcheng/del_ad.svg') } size='md' />
            <span>清除失效商品</span>
          </p>
        }
        {
          !isOrderPage &&
          <PayFooter price={ totalPrice } num={ totalNum } handlePayClick={ this.handlePayClick } />
        }
      </li>
    )
  }
}
