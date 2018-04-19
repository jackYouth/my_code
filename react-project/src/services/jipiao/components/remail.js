import React from 'react'
import { List } from 'antd-mobile'
// import { Mask, SlidePage, Calendar }    from '@boluome/oto_saas_web_app_component'
import '../style/remail.scss'
import '../style/order.scss'

const Item = List.Item

const Remail = remail => {
  console.log(remail)
  const { remailData } = remail
  if (remailData) {
    const { receiverType, receiverTitle, name, phone, address, taxNumber = '' } = remailData
    return (
      <div className='remail'>
        <div className='remailWrap' style={ status === 0 ? {} : { height: '100%' } }>
          <div>
            <Item><div className='billinfo'><span>报销凭证</span><div>{ receiverType }</div></div></Item>
            <Item>
              <div className='billinfo'>
                <span>发票信息</span>
                <div>
                  <div className='addrinfo'>
                    <p>{ receiverTitle }</p>
                    <p style={{ fontSize: '0.24rem', color: '#666666' }}><span style={{ margin: '0' }}>类型： { taxNumber ? '公司' : '个人' }</span><span>{ taxNumber ? `税号：${ taxNumber }` : '' }</span></p>
                  </div>
                </div>
              </div>
            </Item>
            <Item>
              <div className='billinfo'>
                <span>收货地址</span>
                <div>
                  {
                    <div className='addrinfo'>
                      <p>{ name }{ phone }</p>
                      <p>{ address }</p>
                    </div>
                  }
                </div>
              </div>
            </Item>
            <Item><div className='billinfo'><span>配送方式</span><div>快递¥20</div></div></Item>
          </div>
          <p className='qtip'>温馨提示：报销凭证将在航班起飞后1-7天寄出</p>
        </div>
      </div>
    )
  }
  return (
    <div />
  )
}
// <Item><div className='billinfo'><span>状态</span><div>{ statusText[status] }</div></div></Item>
// {
//   status === 0 &&
//   <div className='qbtn'>
//     <span onClick={ () => { handleSubmit() } }>取消邮寄</span>
//   </div>
// }
export default Remail
