
import React from 'react'
import { Icon } from 'antd-mobile'
import { UserCenter, Nolocation, Mask, SlidePage, Contact } from '@boluome/oto_saas_web_app_component'
// import { vconsole } from 'vconsole' // <vconsole />
// import { setStore, getStore } from '@boluome/common-lib'
import '../style/index.scss'
import CartListCom from './cart.js'
import GoodslistMain from './goodslist.js'
import icondown from '../img/down.svg'
import noshop from '../img/noshopp.png'

// const Item = List.Item
const App = props => {
  // console.log('app props-=--=-==-=--=', props)
  const { goodslist, goodsCartarr,
    goDetailsShow, goOrderMmessage, // goContactList,
    addCartFn, ReduceCartNum, ReduceCartListNum,
    handleReduceNum, handleAddNum, handleOnClose,
    handleChangeContact, handleBtnEvevtR, nolocation, handleChooseContact,
    contactData, titleAddress = '定位中...', OptimalContact = {}, // goOrderDetails,
    outRange,
  } = props
  const handleGoContact = () => {
    Mask.closeAll()
    Mask(
      <SlidePage target='left' type='root' showClose={ false }>
        <Contact handleChange={ contact => handleChooseContact(contact) }
          hideDefaultBtn='true'
          source='coffee'
          chooseContact={ OptimalContact }
        />
      </SlidePage>
      , { mask: false, style: { position: 'absolute' } }
    )
  }
  if (nolocation && goodslist) {
    console.log('sssss')
    const { merchant } = goodslist
    const { name } = merchant
    return (
      <div className='indexWrap'>
        <div className='indexLocation'>
          <div className='location_c' onClick={ () => handleGoContact() }>{ titleAddress }</div><Icon type={ icondown } />
        </div>
        <GoodslistMain
          goDetailsShow={ goDetailsShow }
          goodsCartarr={ goodsCartarr }
          addCartFn={ addCartFn }
          ReduceCartNum={ ReduceCartNum }
          ReduceCartListNum={ ReduceCartListNum }
          contactData={ contactData }
          handleChangeContact={ handleChangeContact }
          OptimalContact={ OptimalContact }
          handleGoContact={ handleGoContact }
          goodslist={ goodslist }
          name={ name }
          goContactList={ handleGoContact }
        />
        <div className='footerCart'>
          <CartListCom onChange={ goOrderMmessage }
            goodsCartarr={ goodsCartarr }
            handleReduceNum={ handleReduceNum }
            handleAddNum={ handleAddNum }
            handleOnClose={ handleOnClose }
          />
        </div>
        <UserCenter categoryCode='coffee' />
      </div>
    )
  } else if (outRange) {
    return (
      <div className='outRangeWrap'>
        <div className='indexLocation'>
          <div className='location_c' onClick={ () => handleGoContact() }>{ titleAddress }</div><Icon type={ icondown } />
        </div>
        <div className='outRange'>
          <img src={ noshop } alt='' />
          <p>当前位置暂无可用商家～</p>
        </div>
      </div>
    )
  }
  return (
    <div>
      {
        nolocation && nolocation === true ? (<div className='loading_self' />) : (<Nolocation handleBtnEvevtL={ handleGoContact } handleBtnEvevtR={ handleBtnEvevtR } />)
      }
    </div>
  )
}

export default App
