import React         from 'react'
import { List, DatePicker } from 'antd-mobile'
import moment from 'moment'
import { Mask } from '@boluome/oto_saas_web_app_component'
import '../style/guarantee.scss'

const Item = List.Item
const Guarantee = props => {
  console.log('guarantee props---------------', props)
  const { checkInfo, handleUserPhone, handleID, handleUserName, handleDate, handleCvv, cvvNo, checkCreditCard, creditCardNo, handleCreditNo, availData = {}, cardInfo = {}, quantity = 1, validDate } = props
  const { price = 0 } = availData
  const { IsValid = false } = cardInfo

  return (
    <div className='guarantee-container'>
      <div className='guarantee-price-container'>
        <span>需担保：</span>
        <span>{ `¥${ Number(price * quantity).toFixed(2) }` }</span>
      </div>
      <div className='guarantee-main-container' style={{ height: IsValid ? 'auto' : '.88rem' }}>
        <div className='input-box'>
          <span>卡号</span>
          <input type='text' placeholder='请输入信用卡号' value={ creditCardNo } onChange={ v => handleCreditNo(v.target.value) } />
        </div>
        <div className='cvv-box input-box'>
          <span>CVV码</span>
          <input style={{ width: '75%' }} type='text' placeholder='请输入卡片背面签名栏末三位' value={ cvvNo } maxLength='3' onChange={ v => handleCvv(v.target.value) } />
          <span className='help' onClick={ () =>
            Mask(
              <div className='img-box cvv-img' />
            )
          }
          />
        </div>
        <div style={{ height: '0.88rem', position: 'relative' }}>
          <DatePicker
            mode='month'
            title='选择有效期'
            extra=''
            format={ val => val.format('YYYY-MM') }
            onChange={ t => handleDate(t.format('YYYY-MM')) }
            minDate={ moment('2017-10-01', 'YYYY-MM') }
            maxDate={ moment('2099-12-31', 'YYYY-MM') }
          >
            <Item style={{ height: '0.88rem' }}>
              <span style={{ width: '31%', display: 'inline-block' }}>卡有效期</span>
              <span style={{ color: !validDate ? '#999' : '' }}>{ !validDate ? '请选择有信用卡效期' : validDate }</span>
            </Item>
          </DatePicker>
          <span className='help' style={{ position: 'absolute', right: '.3rem', top: '0' }} onClick={ () =>
            Mask(
              <div className='img-box use-img' />
            )
          }
          />
        </div>
        <div className='input-box'>
          <span>姓名</span>
          <input type='text' placeholder='持卡人姓名' onChange={ v => handleUserName(v.target.value) } />
        </div>
        <div className='input-box'>
          <span>身份证</span>
          <input type='text' placeholder='银行办卡证件号' maxLength='18' onChange={ v => handleID(v.target.value) } />
        </div>
        <div className='input-box'>
          <span>手机号</span>
          <input type='tel' placeholder='银行办卡手机号' maxLength='11' onChange={ v => handleUserPhone(v.target.value) } />
        </div>
      </div>
      <div className='btn-container'>
        <button onClick={ () => { if (IsValid) { checkInfo(props) } else { checkCreditCard(creditCardNo) } } }>{ IsValid ? '确认担保' : '下一步' }</button>
      </div>
    </div>
  )
}
export default Guarantee
