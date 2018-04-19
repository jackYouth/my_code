import React from 'react'
import { Picker, List, WhiteSpace, Slider, Icon, createTooltip, Modal } from 'antd-mobile'
import { ContactShow, NewPromotion, SlidePage, Mask } from '@boluome/oto_saas_web_app_component'
// import { setStore, getStore } from '@boluome/common-lib'
import '../style/order.scss'
import tips from '../img/tips.svg'
import icontime from '../img/time.svg'

const Item = List.Item
const SliderWithTooltip = createTooltip(Slider)
const Order = props => {
  const { contact = '',
    handleChangeTips, handlePromotion, handleGoOrder,
    goContactEdit, handleNotesText, noteText, merchant,
    tipsPrice = 0, deliverFees = 0, goodsCartarr, Promotion,
    orderTimeDate = [], serviceDate = '', handleServiceDate,
    visible, handleTipsNotice,
  } = props
  const seasons = orderTimeDate.map(({ deliverDate, deliverTime }) => ({ label: deliverDate, value: deliverDate, children: deliverTime.map(key => ({ label: key, value: key })) }))
  const EditNotes = () => {
    Mask(
      <SlidePage target='right' type='root' showClose={ false }>
        <NotesComponent handleNotesText={ handleNotesText } noteText={ noteText } />
      </SlidePage>
      , { mask: false, style: { position: 'absolute' } }
    )
  }

  let Sum = 0
  let SumPrice = 0.00
  if (goodsCartarr) {
    for (let s = 0; s < goodsCartarr.length; s++) {
      Sum += goodsCartarr[s].quantity
      SumPrice += (goodsCartarr[s].quantity * goodsCartarr[s].oprice)
    }
  }
  if (goodsCartarr) {
    return (
      <div className='orderWrap'>
        <div className='orderMain'>
          <ContactShow { ...{ contact } } handleSuccess={ goContactEdit } />
          <WhiteSpace size='lg' />
          <List className='orderTime'>
            <Picker
              data={ seasons }
              title='选择日期'
              extra={ serviceDate ? (`${ serviceDate[0] } ${ serviceDate[1] }`) : '请选择上门服务时间' }
              cols={ 2 }
              onChange={ v => handleServiceDate(v, contact) }
            >
              <Item arrow='horizontal' className='timeIcon'><Icon type={ icontime } /><span>送达时间</span></Item>
            </Picker>
          </List>
          <WhiteSpace size='lg' />
          <Item extra='在线支付'>支付方式</Item>
          <WhiteSpace size='lg' />
          <List>
            <Item>星巴克代购</Item>
            {
              goodsCartarr.map((item, index) => (
                <Item key={ `${ index + item.markId }` } className='oto_item' extra={ <GoodsPrice goods={ item } /> }>{ item.data.productName }</Item>
              ))
            }
          </List>
          <List className='tipsWrap'>
            <Item extra={ `¥ ${ deliverFees.toFixed(2) }` }>配送费</Item>
            <Item extra={
              <div className='iconWrapper'>
                <Icon type={ tips } />
                <SliderWithTooltip min={ 0 } max={ 20 } defaultValue={ 0 } onChange={ handleChangeTips } />
                <Icon onClick={ () => handleTipsNotice('show') } type={ tips } />
              </div>
            }
            >
              小费 <span className='tipsPrice'>{ tipsPrice }元</span>
            </Item>
          </List>
          <WhiteSpace size='lg' />
          <NewPromotion orderType='coffee' amount={ (SumPrice + tipsPrice) * 1 } count={ Sum } channel='linqu' handleChange={ reply => handlePromotion(reply) } />
          <WhiteSpace size='lg' />
          <Item className='noteText' arrow='horizontal' extra={ noteText === '' ? '口味，偏好等' : noteText } onClick={ () => EditNotes() }>订单备注</Item>
          <WhiteSpace size='lg' />
        </div>
        <FooterSumPrice
          tipsPrice={ tipsPrice }
          contact={ contact }
          serviceDate={ serviceDate }
          goodsCartarr={ goodsCartarr }
          SumPrice={ SumPrice }
          Promotion={ Promotion }
          deliverFees={ deliverFees }
          handleGoOrder={ handleGoOrder }
          merchant={ merchant }
          noteText={ noteText }
        />
        <Modal
          title='关于小费'
          transparent
          visible={ visible }
          footer={ [{ text: '知道了', onPress: () => { handleTipsNotice('colse') } }] }
        >
          支付小费后配送员会更及时接单，得到更优质的服务。付小费让小邻哥飞起来吧！
        </Modal>
      </div>
    )
  }
  return (<div />)
}

export default Order

// 订单页面的商品展示
const GoodsPrice = ({ goods }) => {
  const { oprice = 0, quantity } = goods
  return (
    <div className='goodsshow'>
      <span>x { quantity }</span>
      <span className='goodsSpan'>¥ { oprice.toFixed(2) }</span>
    </div>
  )
}

// 小费说明
// const TipsNotice = () => {
//   return (
//     <Modal
//       title='关于小费'
//       transparent
//       maskClosable='true'
//       visible='true'
//       footer={ [{ text: '知道了', onPress: () => { Modal.close() } }] }
//     >
//       支付小费后配送员会更及时接单，得到更优质的服务。付小费让小邻哥飞起来吧！
//     </Modal>
//   )
// }
// 订单备注
const NotesComponent = ({ handleNotesText, noteText, handleContainerClose }) => {
  return (
    <div className='notes'>
      <Item className='noteHeader'>订单备注</Item>
      <WhiteSpace size='lg' />
      <Item className='title'>其他备注</Item>
      <div className='note'>
        <textarea className='textarea' maxLength='50' placeholder='请输入备注内容(可不填)'>{ noteText === '口味，偏好等' ? '' : noteText }</textarea>
      </div>
      <WhiteSpace size='lg' />
      <WhiteSpace size='lg' />
      <div className='saveBtn' onClick={ () => handleNotesText(handleContainerClose) }>确定</div>
    </div>
  )
}

// 底部总价计算
const FooterSumPrice = ({ tipsPrice, contact, merchant, serviceDate, goodsCartarr, SumPrice, Promotion, deliverFees, noteText, handleGoOrder }) => {
  // console.log(tipsPrice, contact, serviceDate, goodsCartarr, SumPrice, Promotion, deliverFees)
  const { discount = 0 } = Promotion
  const orderPrice = (SumPrice + tipsPrice + deliverFees) - discount
  return (
    <div className='footerPrice'>
      <div className='footerL'>
        实付: ¥ <span className='price'>{ orderPrice.toFixed(2) }</span>{ discount === 0 ? ('') : (<span className='downprice'>优惠¥{ discount.toFixed(2) }</span>) }
      </div>
      <div className='footerR' onClick={ () => handleGoOrder(tipsPrice, contact, merchant, serviceDate, goodsCartarr, Promotion, deliverFees, noteText) }>立即下单</div>
    </div>
  )
}
