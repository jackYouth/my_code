import React from 'react'
import { List, WhiteSpace, Picker, InputItem } from 'antd-mobile'
import { Mask, SlidePage, NewPromotion, AddressSearchGaode, Contact } from '@boluome/oto_saas_web_app_component'
import { getStore } from '@boluome/common-lib'

import TextareaCom from './textarea.js'
import UserTips from './usertips.js'
import Tipsprice from './tipsprice.js'
import Tel from './tel.js'
import '../style/order.scss'
import shouIcon from '../img/shou.png'
import contactIcon from '../img/contact.png'
// import tel from '../img/tel.svg'
// import people from '../img/people.svg'

const Item = List.Item
const Brief = Item.Brief

const Order = props => {
  const {
    serviceDate, orderTimeDate, displayTag, handleChangeTime, handleClick,
    handleChangeAddr, handleChangeContact, contact, shoppingAddr,
    deliverFees, textareaStr, handleProductName, handleUnits, files = [],
    handlePromotion, handletipsPrice, tipsPrice, Promotion, handleSaveBtn,
    handleAddMerchant, handleChangePhone, handleChangeName, focused,
    changeText,
  } = props
  // console.log('order-props---', tipsPrice deliverFees)
  const datas = getStore('paotuiData', 'session')
  const PromotionPrice = Number(tipsPrice + deliverFees)
  const handleUserTip = () => {
    Mask(
      <SlidePage target='right' type='root' >
        <UserTips />
      </SlidePage>
      , { mask: false, style: { position: 'absolute' } }
    )
  }
  const handleShoppingAddr = () => {
    Mask(
      <SlidePage target='right' type='root' showClose={ false } >
        <AddressSearchGaode onSuccess={ handleChangeAddr } />
      </SlidePage>
      , { mask: false, style: { position: 'absolute' } }
    )
  }
  const handleContact = () => {
    // console.log('handleContact----', textareaStr, '-----', displayTag)
    Mask(
      <SlidePage target='right' type='root' showClose={ false } >
        <Contact handleChange={ handleChangeContact } hideDefaultBtn={ 0 } chooseContact={ contact } source='paotui' />
      </SlidePage>
      , { mask: false, style: { position: 'absolute' } }
    )
  }
  const seasons = orderTimeDate.map(({ deliverDate, deliverTime }) => ({ label: deliverDate, value: deliverDate, children: deliverTime.map(key => ({ label: key, value: key })) }))
  return (
    <div className='paotuiOrderWrap'>
      <div className='orderMain'>
        <WhiteSpace size='lg' />
        <TextareaCom textareaStr={ textareaStr } files={ files } focused={ focused } changeText={ changeText } />
        <Item className='tipsWrap' extra={ <span className='tips' onClick={ () => handleUserTip() }>使用说明</span> }>例如：阿莫西林1盒及打火机1个</Item>
        {
          displayTag ? (<GoodsShowCom data={ datas } displayTag={ displayTag } handleProductName={ handleProductName } handleUnits={ handleUnits } />) : ('')
        }
        <WhiteSpace size='lg' />
        <List>
          {
            shoppingAddr ? (<Item
              className='address'
              align='top'
              thumb={ shouIcon }
              multipleLine
              extra={ <span className='deleteAddress' onClick={ () => handleChangeAddr('') } /> }
            >
              <span onClick={ () => handleShoppingAddr() }>{ shoppingAddr.title }</span>
              <Brief>
                <InputItem
                  className='addressInt'
                  type='text'
                  placeholder='详细地址...'
                  onChange={ v => handleAddMerchant(v) }
                />
              </Brief>
            </Item>) : (<Item
              thumb={ shouIcon }
              arrow='horizontal'
              onClick={ () => { handleShoppingAddr() } }
            >购买地址 (选填)</Item>)
          }
        </List>
        <WhiteSpace size='lg' />
        <List>
          {
            contact ? (<Item arrow='horizontal'
              align='top'
              thumb={ contactIcon }
              multipleLine
              extra={ <span className='goContactList' onClick={ () => handleContact() } /> }
            >
              <span onClick={ () => handleContact() }>{ contact.detail }</span>
              <Tel contact={ contact } handleChangePhone={ handleChangePhone } handleChangeName={ handleChangeName } />
            </Item>) : (<Item arrow='horizontal'
              align='top'
              thumb={ contactIcon }
              multipleLine
              onClick={ () => handleContact() }
            >
              请添加收货地址
            </Item>)
          }
        </List>
        <WhiteSpace size='lg' />
        <List className='orderTime' onClick={ () => handleClick(contact) }>
          <Picker
            data={ seasons }
            title='选择日期'
            extra={ serviceDate ? (`${ serviceDate[0] } ${ serviceDate[1] }`) : '请选择上门服务时间' }
            cols={ 2 }
            onChange={ v => handleChangeTime(v) }
          >
            <Item arrow='horizontal' className='timeIcon'><span>送达时间</span></Item>
          </Picker>
        </List>
        <WhiteSpace size='lg' />
        <Item extra={ `${ deliverFees <= 0 ? ('') : (`¥${ deliverFees }`) }` }>配送费</Item>
        <Tipsprice onChange={ handletipsPrice } />
        <WhiteSpace size='lg' />
        <NewPromotion orderType='paotui' amount={ PromotionPrice } count={ 1 } channel='linqu' handleChange={ reply => handlePromotion(reply) } />
        <WhiteSpace size='lg' />
        <div className='tipsText'>注：配送费是您购买小邻哥的时间、选购及运输成本所付出的费用。不包含商品费用，商品费用需根据商家小票另外支付</div>
        <WhiteSpace size='lg' />
      </div>
      <div className='orderFooter'>
        {
          PromotionPrice > 0 ?
          (
            <div className='price'>
              {
                Promotion && Promotion.discount > 0 ? (<span className='sl'>已优惠¥ { Promotion.discount }</span>) : ('')
              }
              <span className={ `sr ${ Promotion && Promotion.discount > 0 ? ('sr_myfirstR') : 'sr_myfirst' }` }>实付：¥<i>{ `${ Promotion && Promotion.discount > 0 ? (PromotionPrice - Promotion.discount).toFixed(2) : PromotionPrice.toFixed(2) }` }</i></span>
            </div>
          ) : ('')
        }
        {
          PromotionPrice > 0 ? (<div className='orderBtn' onClick={ () => handleSaveBtn(tipsPrice, contact, shoppingAddr, serviceDate, Promotion, deliverFees) }>立即下单</div>) :
          (<div className='orderBtn noUseBtn'>立即下单</div>)
        }

      </div>
    </div>
  )
}

export default Order

// const Tel = ({ contact, handleChangePhone, handleChangeName }) => {
//   const { name, phone } = contact
//   return (
//     <div className='tel'>
//       <InputItem
//         className='peopleInt'
//         placeholder='收货人...'
//         defaultValue={ name }
//         onChange={ v => handleChangeName(v, contact) }
//       ><Icon type={ people } /></InputItem>
//       <InputItem
//         className='telInt'
//         type='phone'
//         maxLength={ 11 }
//         placeholder='手机号...'
//         defaultValue={ phone }
//         onChange={ v => handleChangePhone(v, contact) }
//       ><Icon type={ tel } /></InputItem>
//     </div>
//   )
// }
//

const GoodsShowCom = ({ data = [], displayTag, handleUnits, handleProductName }) => {
  // console.log('displayTag,', displayTag)
  const e = data.filter(o => { return o.displayTag === displayTag })[0]
  // const { productNames } = e
  const { units, productNames } = e
  // console.log('111', e)
  return (
    <div className='goods'>
      <div className='title'>下方商品可以直接点击</div>
      <ul className='goodslist'>
        {
          productNames.map(o => (
            <li key={ `${ o.productName }` } onClick={ () => handleProductName(o) }>{ o.productName }</li>
          ))
        }
        {
          units.map(item => (
            <li key={ `${ item }` } onClick={ () => handleUnits(item) }>{ item }</li>
          ))
        }
      </ul>
    </div>
  )
}
