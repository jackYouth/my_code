import React from 'react'
import { List, WhiteSpace, InputItem } from 'antd-mobile'
import { NewPromotion } from '@boluome/oto_saas_web_app_component'
import Service from './service'
import '../style/confirm.scss'

const ListItem = List.Item
const Brief = ListItem.Brief

const Confirm = ({ currentService, currentShop, channel, promotion, handlePromotionChange, handleSaveOrder, handleToMap, handlePhone }) => {
  const { shopId, shopName, shopAddress } = currentShop
  const { price } = currentService
  const { discount } = promotion

  return (
    <div className='confirmWrap'>
      <div style={{ height: 'calc(100% - 1rem)', WebkitOverflowScrolling: 'touch', overflow: 'hidden', overflowY: 'scroll' }}>
        <List>
          <Service { ...{ shopId, service: currentService, isConfirm: true } } />
          <ListItem arrow='horizontal' onClick={ () => handleToMap(shopId) }>
            <span style={{ fontSize: '.28rem' }}>{ shopName }</span>
            <Brief style={{ fontSize: '.2rem' }}>{ shopAddress }</Brief>
          </ListItem>
        </List>
        <WhiteSpace size='lg' />
        <List>
          <ListItem extra='支付成功后显示'>
            兑换码
          </ListItem>
          <ListItem extra={ <span style={{ color: '#333' }}>一个月</span> } >
            有效时间
          </ListItem>
        </List>
        <WhiteSpace size='lg' />
        <List className='inputPhone'>
          <InputItem
            type='phone'
            placeholder='请输入联系人手机号'
            maxLength='11'
            onChange={ v => handlePhone(v) }
          ><span style={{ color: '#333', fontSize: '0.28rem' }}>联系人号码</span></InputItem>
        </List>
        <WhiteSpace size='lg' />
        <List>
          <NewPromotion handleChange={ handlePromotionChange } amount={ price } orderType='baoyang' channel={ channel } />
        </List>
        <WhiteSpace size='md' />
        <div style={{ fontSize: '.24rem', color: '#999', padding: '0 .3rem', lineHeight: '.4rem' }} >下单后，“兑换码”将以短信形式告知您。您可以在兑换码有效期内到商家消费，向商家出示“兑换码”即可</div>
      </div>
      <div style={{ height: '1rem', backgroundColor: '#fff' }}>
        <div style={{ display: 'inline-block', padding: '.25rem .3rem', boxSizing: 'border-box', width: '65%', color: '#ff4848' }}>
          <span style={{ fontSize: '.28rem' }}>
            实付：￥
            <span style={{ fontSize: '.36rem' }}>
              { (price - discount).toFixed(2) }
            </span>
          </span>
          {
            discount > 0 && (
              <span style={{ fontSize: '.24rem', marginLeft: '.1rem', color: '#999' }}>{ `优惠￥${ discount.toFixed(2) }` }</span>
            )
          }
        </div>
        <div onClick={ handleSaveOrder } style={{ display: 'inline-block', width: '35%', backgroundColor: '#ffab00', color: '#fff', fontSize: '.36rem', textAlign: 'center', lineHeight: '1rem', verticalAlign: 'middle' }}>
          立即下单
        </div>
      </div>
    </div>
  )
}

export default Confirm
