import React, { Component } from 'react'
import { DragDirection } from '@boluome/oto_saas_web_app_component'
import { Icon, Popup, WhiteSpace } from 'antd-mobile'
import { merge } from 'ramda'

import TopComponent from './detail-components/top-component'
import BottomComponent from './detail-components/bottom-component'
import Specification from './detail-components/specification'

import '../styles/detail.scss'

export default class Detail extends Component {
  constructor(props) {
    super(props)
    this.state = { topContainerStyle: { top: '0px' }, bottomContainerStyle: { top: '100%' } }
    this.handleDragDirctionTop = this.handleDragDirctionTop.bind(this)
    this.handleDragDirctionBottom = this.handleDragDirctionBottom.bind(this)
  }
  componentWillUnmount() {
    Popup.hide()
  }

  handleDragDirctionTop(res) {
    if (res === 'up') {
      this.setState({ showBottomComponent: true, topContainerStyle: { top: '-100%' }, bottomContainerStyle: { top: '0px' } })
    }
  }

  handleDragDirctionBottom(res) {
    if (res === 'down') {
      this.setState({ showBottomComponent: false, topContainerStyle: { top: '0px' }, bottomContainerStyle: { top: '100%' } })
    }
  }

  handleCloseClick() {
    Popup.hide()
  }

  render() {
    const {
      goodDetails,
      handleBusinessNameClick,
      handleMoreCommentClick,
      allTimes,
      handleSpecClick, handleBtnClick, currentSpec,
      currentAddress,
    } = this.props
    if (!goodDetails) return <div />

    let { topContainerStyle, bottomContainerStyle } = this.state
    topContainerStyle = merge(topContainerStyle)({ transition: '.8s', WebkitTransition: '.8s' })
    bottomContainerStyle = merge(bottomContainerStyle)({ transition: '.8s', WebkitTransition: '.8s' })


    const {
      specificationsList,
      servicePhone, brand,
      pineapplePhone, platformName,
      statusDescription,
      serviceThumbnailImg, maxSellPrice, unitName, sellPrice,
    } = goodDetails
    const { brandName } = brand

    // btnDisable 表示当前提交按钮是否 不可用（多规格且未选中）, statusDescription表示当前商家是否是休或满的状态
    const hasSpec = specificationsList && specificationsList.length > 0
    // const btnDisable = statusDescription || (hasSpec && !currentSpec)
    const btnDisable = hasSpec && !currentSpec

    const currentGood = { goodDetails }
    if (currentSpec) currentGood.currentSpec = currentSpec

    return (
      <div className='detail'>
        {
          <DragDirection
            ContentComponent={ TopComponent }
            allProps={{ goodDetails, handleBusinessNameClick, handleMoreCommentClick, allTimes, handleSpecClick, handleBtnClick, currentSpec }}
            handleDragDirction={ this.handleDragDirctionTop }
            containerStyle={ topContainerStyle }
            showBottomTips={ 'true' }
          />
        }
        {
          <DragDirection
            ContentComponent={ BottomComponent }
            allProps={{ goodDetails, currentAddress }}
            handleDragDirction={ this.handleDragDirctionBottom }
            containerStyle={ bottomContainerStyle }
            showTopTips={ 'true' }
          />
        }
        <div className='detail-footer'>
          <p className='place-btn active' onClick={ () => {
            if (btnDisable) {
              Popup.show(<Specification { ...{ currentSpec, specificationsList, serviceThumbnailImg, handleSpecClick, handleBtnClick, goodDetails, statusDescription, handleCloseClick: this.handleCloseClick, maxSellPrice, unitName, sellPrice } } />, { animationType: 'slide-up', maskClosable: true })
            } else {
              handleBtnClick(currentGood)
            }
          }
          }
          >
            立即购买
          </p>
          <p className='contact' onClick={ () => Popup.show(<CustomerService { ...{ brandName, servicePhone, pineapplePhone, platformName } } />, { animationType: 'slide-up', maskClosable: true, maskProps: { onTouchStart: e => e.preventDefault() } }) }><Icon type={ require('svg/daojia/contact.svg') } size='lg' /></p>
        </div>
      </div>
    )
  }
}

const CustomerService = ({ brandName, servicePhone, pineapplePhone, platformName }) => {
  const nodo = false
  return (
    <ul className='contact'>
      {
        nodo &&
        <li className='contact-second'><a href={ `tel:${ pineapplePhone }` }>{ `联系${ platformName }客服` }</a></li>
      }
      <li className='contact-first'><a href={ `tel:${ servicePhone }` }>{ `联系${ brandName }客服（8:00-20:00）` }</a></li>
      <WhiteSpace size='sm' style={{ background: '#f3f3f4' }} />
      <li className='contact-third' onClick={ () => Popup.hide() }>取消</li>
    </ul>
  )
}
