/*
  问题：
  1, 暂时没有取消nearbyCarInfo判断附近是否有对应车型，然后决定界面显示的状态

  tips：
  1，该页面会按需显示三种组件：
    a：用于优化页面的判断，没有supportThisCity数据返回时，显示空白页
    b：当supportThisCity为false时，表示不支持当前城市，显示NosupportCity组件
    c：当supportThisCity为true时，显示正常页面
*/

import React from 'react'
import { List, Picker, Icon, Flex, Modal, InputItem } from 'antd-mobile'
import { SlidePage, Mask, AddressSearchGaode, ExchangeActivePopup } from '@boluome/oto_saas_web_app_component'
// import { vconsole } from 'vconsole'

import NosupportCity from '../common-components-self/no-support-city'
import Flight from './flight'
import EstimatePrice from '../common-components-self/estimate-price'
import LeftComponent from '../common-components-self/address-left-component'
import SelectAirport from '../common-components-self/select-airport'
import '../styles/product.scss'

const Plane = props => {
  const {
    supportThisCity, getLocationErr,
    handleSeletedFlightNo, handleClearFlightNo,
    showChannel, currentname, handleTabClick, handleReloadCity, handleChangeCity,
    handleChangeCar, handleChangePassenger, handleChangeDate, startTimes, defaultCurrentDate, isStartTimes2,
    handleChangeStartPointObj, handleChangeEndPointObj,
    estimate,
    handleCreateOrder,
    hasUnpay, hasInStroke, handleChangeUnpay, orderId,
    handleChangeProduct, currentProduct = { code: '' }, products,
    handelRulesClick, isSinglePrice, channel,
    handleSingleBackPromotion, promotionData = { discount: '', promotionBackData: '' }, handleCloseCallback, payFooterShow = true,
    flightNoErrorMessage, flightNoError, handleChangeFlightNoError,
    defaultCityCenterObj = {},
    pickerVisible, handlePickerClick,
  } = props
  if ((!supportThisCity && supportThisCity !== undefined) || getLocationErr) {
    return (
      <div>
        <NosupportCity { ...{ currentname, handleReloadCity, handleChangeCity, getLocationErr } } />
      </div>
    )
  }

  let { defaultPointObj = {} } = props
  const productType = currentProduct.code
  // 设置当前productType对应的起点对象
  if (productType !== 'private-car' && productType !== 13 && productType !== 14) defaultPointObj = defaultCityCenterObj
  const startPointObj = props[`startPointObj${ productType }`] ? props[`startPointObj${ productType }`] : defaultPointObj
  const startPointStr = props[`startPointStr${ productType }`] ? props[`startPointStr${ productType }`] : defaultPointObj.title
  if (!defaultPointObj || !products || supportThisCity === undefined) {
    return (<div />)
  }
  const ListItem = List.Item

  // 设置当前productType对应的终点对象
  let endPointObj = props[`endPointObj${ productType }`]
  const endPointStr = props[`endPointStr${ productType }`]
  // 设置当前productType对应的出发时间, 乘车人
  let currentDate =  props[`currentDate${ productType }`] ? props[`currentDate${ productType }`] : ''
  const currentPassenger = props[`currentPassenger${ productType }`] ? props[`currentPassenger${ productType }`] : '换乘车人'
  // 设置当前productType对应的航班号，航班时间
  const flightNo = props[`flightNo${ productType }`] ? props[`flightNo${ productType }`] : ''
  const flightDate = props[`flightDate${ productType }`] ? props[`flightDate${ productType }`] : ['']

  const hasstartPointStr = Boolean(startPointStr)
  const hasendPointStr = Boolean(endPointStr)
  const canPlace = hasstartPointStr && hasendPointStr && startPointStr !== '附近无可选上车地点' && endPointStr !== '附近无可选上车地点'
  // 设置默认值
  // 默认当前车信息
  // 默认起终点
  if (!endPointObj || !endPointObj.latitude) endPointObj = defaultPointObj
  const [startLatitude, startLongitude, startAddress, endAddress, endLatitude, endLongitude] =
  [startPointObj.latitude, startPointObj.longitude, startPointStr, endPointStr, endPointObj.latitude, endPointObj.longitude]
  // 定义预约时间
  let departureTime = defaultCurrentDate
  if ((currentDate === '' || currentDate.length === 2) && channel === 'didi' && isSinglePrice) currentDate = [startTimes[0].value, startTimes[0].children[0].value, startTimes[0].children[0].children[0].value]
  if (currentDate !== '' && currentDate.length !== 2) departureTime = `${ currentDate[0] } ${ currentDate[1] }:${ currentDate[2] }`
  // 获取附近车型
  const nearbyCarInfo = props[`nearbyCarInfo${ productType }`]
  const currentCarInfo = props[`currentCarInfo${ productType }`]
  let rideType = ''
  if (currentCarInfo) rideType = currentCarInfo.rideType
  // 定义乘车人手机号码
  const contactPhone = currentPassenger === '换乘车人' ? '' : currentPassenger
  let airCode = ''
  // 因为机场选择只会出现一次，所以startPointObj和endPointObj中，只会包含一个code
  if (startPointObj.code) airCode = startPointObj.code
  if (endPointObj.code) airCode = endPointObj.code
  // 定义查询附近运力时的参数
  const estimatePara = {
    startLatitude,
    startLongitude,
    startAddress,
    endLatitude,
    endLongitude,
    endAddress,
    rideType,
    departureTime,
    productType,
    flightNo,
    flightDate: flightDate[0],
    airCode,
  }
  // 定义呼叫专车时的参数
  const origin = { name: startPointStr, latitude: startPointObj.latitude, longitude: startPointObj.longitude, detail: startPointObj.detail }
  const destination = { name: endPointStr, latitude: endPointObj.latitude, longitude: endPointObj.longitude, detail: endPointObj.detail }

  const { discount, coupon, activities } = promotionData
  const couponId = coupon ? coupon.id : ''
  const activityId = activities ? activities.id : ''
  const orderPara = {
    rideType,
    origin,
    destination,
    departureTime,
    contactPhone,
    productType,
    flightNo,
    flightDate: flightDate[0],
    airCode,
    activityId,
    couponId,
  }
  // 下面三个函数，作用是：使用组件，会有一个默认参数，但是我们还需要传入另一个参数，所以使用一个过度函数，去承接这个默认的和想要的参数
  const handleStartAddress = res => {
    // hasendPointStr && endPointStr !== '附近无可选上车地点'  不能用canPlace代替，因为选择锅底之后，对应的startPointStr并没有更新，所以会仍是false，下面同理
    handleChangeStartPointObj(res, hasendPointStr && endPointStr !== '附近无可选上车地点', estimatePara, currentProduct)
  }
  const handleEndAddress = res => {
    handleChangeEndPointObj(res, hasstartPointStr && startPointStr !== '附近无可选上车地点', estimatePara, currentProduct)
  }
  const handleStartTime = res => {
    handleChangeDate(res, canPlace, estimatePara, isStartTimes2)
  }

  const ulS = {
    overflow:     'hidden',
    height:       '100px',
    borderBottom: '1px solid #e5e5e5',
  }
  const liS = {
    float:      'left',
    width:      '50%',
    height:     '100px',
    lineHeight: '100px0',
    fontSize:   '36px',
    listStyle:  'none',
    textAlign:  'center',
  }
  const suppliers = ['didi', 'shenzhou']

  let datePickerExtra = '现在出发'
  if (currentDate.length >= 3 && !isStartTimes2) {
    // datePickerExtra = `${ currentDate[0] } ${ currentDate[1] }:${ currentDate[2] }`
    switch (currentDate[0]) {
      case startTimes[0].value:
        datePickerExtra = `${ startTimes[0].label } ${ currentDate[1] }:${ currentDate[2] }`
        break
      case startTimes[1].value:
        datePickerExtra = `${ startTimes[1].label } ${ currentDate[1] }:${ currentDate[2] }`
        break
      case startTimes[2].value:
        datePickerExtra = `${ startTimes[2].label } ${ currentDate[1] }:${ currentDate[2] }`
        break
      default:
        datePickerExtra = `${ currentDate[0] } ${ currentDate[1] }:${ currentDate[2] }`
        break
    }
  }
  if (isStartTimes2) {
    if (currentDate) {
      datePickerExtra = currentDate[1]
      estimatePara.flightDelayTime = Number(currentDate[1])
      orderPara.flightDelayTime = Number(currentDate[1])
      orderPara.departureTime = ''
    } else {
      datePickerExtra = defaultCurrentDate[1]
      estimatePara.flightDelayTime = Number(defaultCurrentDate[1])
      orderPara.flightDelayTime = Number(defaultCurrentDate[1])
      orderPara.departureTime = ''
    }
  }
  const doThis = true
  return (
    <List className='product plane'>
      <div className='header'>
        {
          Boolean(estimate) && Boolean(estimate.time) &&
          <h1 className='meet-time'>{ `“最快${ estimate.time }分钟接驾”`} </h1>
        }
        {
          showChannel &&
          <ul style={ ulS }>
            {
              suppliers.map(item => (<li style={ liS } onClick={ () => handleTabClick(item) } key={ item }>{ item }</li>))
            }
          </ul>
        }
        {
          products && products.length > 1 &&
          <ul className='my-tab'>
            {
              products.map(item => item.code !== 'zhuanche' && item.code !== 14 && <li className={ item.code === productType ? 'active' : '' } key={ item.code } onClick={ () => handleChangeProduct(item, canPlace, props) }>{ item.name }</li>)
            }
          </ul>
        }
        {
          doThis && currentProduct && productType === 7 && !isSinglePrice &&
          <ListItem
            className='plane-come'
            onClick={ () => {
              Mask(
                <SlidePage showClose={ false }>
                  <Flight { ...{ handleSeletedFlightNo, flightNo, canPlace, estimatePara, currentProduct } } />
                </SlidePage>, { mask: false })
            } }
          >
            <h1 className='icon-container'><Icon type={ require('svg/yongche/plane.svg') } size='xxs' /></h1>
            {
              flightNo && <p className='has-number'><span className='left'>{ flightNo }</span><span className='right' /></p>
            }
            {
              flightNo &&
              <Icon className='clear-flightNo' type='cross-circle-o' size='xs' style={{ color: '#ccc' }} onClick={ e => handleClearFlightNo(e, estimatePara, canPlace, productType) } />
            }
            {
              !flightNo &&
              <p className='no-number'><span>请输入航班号（延误免费等）</span></p>
            }
          </ListItem>
        }
        <ListItem className='start-point' onClick={ () => {
          if (productType !== 7 && productType !== 'jieji') {
            Mask(
              <SlidePage showClose={ false }>
                <AddressSearchGaode noFocus={ 1 } selectedAddress={ startPointObj } onSuccess={ handleStartAddress } LeftComponent={ LeftComponent } myAttribute='start' inputPlaceholder='您在哪儿上车' />
              </SlidePage>
            )
            return
          }
          Mask(
            <SlidePage showClose={ false }>
              <SelectAirport myAttribute='start' handleChangePoint={ handleStartAddress } />
            </SlidePage>
          )
        } }
        >
          <h1 className='icon-container'><span /></h1>
          <p className={ hasstartPointStr ? 'active' : '' }>{ hasstartPointStr ? startPointStr : '请选择您的上车地点' }</p>
        </ListItem>
        <ListItem className='end-point' onClick={ () => {
          if (productType !== 8 && productType !== 'songji') {
            Mask(
              <SlidePage showClose={ false }>
                <AddressSearchGaode noFocus={ 1 } selectedAddress={ endPointObj } onSuccess={ handleEndAddress } LeftComponent={ LeftComponent } myAttribute='end' inputPlaceholder='您要去哪儿' />
              </SlidePage>
            )
            return
          }
          Mask(
            <SlidePage showClose={ false }>
              <SelectAirport myAttribute='end' handleChangePoint={ handleEndAddress } />
            </SlidePage>
          )
        } }
        >
          <h1 className='icon-container'><span /></h1>
          <p className={ hasendPointStr ? 'active' : '' }>{ hasendPointStr ? endPointStr : '您在哪下车' }</p>
        </ListItem>
        <div className='select-time-contact'>
          <div className='select-time-contact-item' onClick={ () => handlePickerClick(!pickerVisible) }>
            <Icon type={ require('svg/yongche/time.svg') } size='xxs' />
            {
              isStartTimes2 ?
                <p>到达后<span>{ `${ datePickerExtra }分钟` }</span>上车</p> :
                datePickerExtra
            }
          </div>
          <div
            className='select-time-contact-item'
            onClick={
              () => Modal.alert('', <InputItem className='passenger-input' defaultValue={ currentPassenger === '换乘车人' ? '' : currentPassenger } placeholder='请输入乘车人手机号' type='number' maxLength={ 11 } />, [
                { text: '取消' },
                { text: '确定', onPress: () => handleChangePassenger(document.querySelector('.passenger-input input').value, productType) },
              ], '', '')
            }
          >
            <Icon type={ require('svg/yongche/passenger.svg') } size='xxs' />
            <span>{ currentPassenger }</span>
          </div>
        </div>
        {
          nearbyCarInfo &&
          <Flex className='car-style'>
            {
              nearbyCarInfo.map(item => {
                const isSelected = item.rideType === rideType
                if (item.rideType === '') {
                  return (
                    <Flex.Item className='car-item' key={ item.name }>
                      <Icon className='car-icon' type={ require('svg/yongche/no-support-car.svg') } size='lg' />
                      <div className='bottom'>
                        <span className='no-support-font'>{ item.name }</span>
                      </div>
                    </Flex.Item>
                  )
                }
                return (
                  <Flex.Item className='car-item' key={ item.name } onClick={ () => handleChangeCar(item, canPlace, estimatePara) }>
                    <Icon className='car-icon' type={ isSelected ? require('svg/yongche/car.svg') : require('svg/yongche/no-select-car.svg') } size='lg' />
                    <span className={ isSelected ? 'active' : '' }>{ item.name }</span>
                  </Flex.Item>
                )
              })
            }
          </Flex >
        }

        {
          estimate &&
          <p className='estimate-price' onClick={ isSinglePrice ? '' : () => Mask(<SlidePage showClose={ false } target='down'><EstimatePrice { ...{ handelRulesClick, estimate } } /></SlidePage>, { mask: false, style: { background: 'rgba(255, 255, 255, .9)' } }) }>
            约 <span>{ estimate.price }</span> 元
          </p>
        }

        {
          isSinglePrice && canPlace && estimate && estimate.price &&
          <SinglePay { ...{ estimatePrice: estimate.price, discount, payFooterShow, handleSingleBackPromotion, handleCloseCallback, channel, handlePay: () => handleCreateOrder(orderPara) } } />
        }
        <div className='s-button'>
          <p className={ canPlace ? 'active' : '' } onClick={ () => {
            if (canPlace) {
              handleCreateOrder(orderPara, isSinglePrice, discount)
            }
          } }
          >
            呼叫专车
          </p>
        </div>
      </div>

      <Modal
        title={ hasInStroke ? <p>您有一个行程中的订单</p> : <p>您有一个订单尚未支付，<br />赶紧去支付吧</p> }
        transparent
        maskClosable={ false }
        visible={ hasUnpay || hasInStroke }
        onClose={ handleChangeUnpay }
        footer={ [{ text: hasInStroke ? '知道了' : '去支付', onPress: () => handleChangeUnpay(orderId) }] }
        style={{ color: '#f00' }}
        className='has-unpay'
      />
      <Modal
        title={ <p>{ flightNoErrorMessage }</p> }
        transparent
        maskClosable={ false }
        visible={ flightNoError }
        onClose={ handleChangeFlightNoError }
        footer={
        [
          {
            text:    '确定',
            onPress: () => {
              handleChangeFlightNoError()
            },
          },
        ] }
        style={{ color: '#f00' }}
        className='has-unpay'
      />
      <Picker
        visible={ pickerVisible }
        data={ startTimes }
        title={ isStartTimes2 ? '若航班延误，我们也会免费等候' : '选择出发时间' }
        cols={ 3 }
        onChange={ handleStartTime }
        onOk={ () => handlePickerClick(false) }
        onDismiss={ () => handlePickerClick(false) }
      >
        <ListItem arrow='horizontal' style={{ display: 'none' }}>
          <Icon type={ require('svg/yongche/time.svg') } size='xxs' />
          <span>出发时间</span>
        </ListItem>
      </Picker>
    </List>
  )
}

export default Plane


const SinglePay = ({ handlePay, discount, estimatePrice, payFooterShow, channel, handleSingleBackPromotion, handleCloseCallback }) => {
  const payPrice = Number(estimatePrice - discount).toFixed(2)
  const priceL = payPrice.split('.')[0]
  const priceR = payPrice.split('.')[1]
  return (
    <div className='single-pay' onTouchMove={ e => e.preventDefault() } style={{ display: payFooterShow && discount ? 'block' : 'none' }}>
      <ExchangeActivePopup orderType='yongche' channel={ channel } amount={ estimatePrice } popupStyle={{ marginTop: '-1.00rem' }} promotionCallback={ handleSingleBackPromotion } handleCloseCallback={ handleCloseCallback } />
      <div className='body'>
        <p className='real-price'>实付：¥<span>{ priceL }</span>{ `.${ priceR }` }</p>
        <p className='disc-price'>{`优惠：¥${ discount }`}</p>
        <p className='pay-button' onClick={ handlePay }>立即支付</p>
      </div>
    </div>
  )
}
