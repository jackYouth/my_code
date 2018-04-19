import React from 'react'
import chooseIcon     from 'images/choose.png'
import nochooseIcon   from 'images/nochoose.png'
import { List, WhiteSpace } from 'antd-mobile'
import { isTest, isStg }   from 'business'

const ListItem = List.Item

const iconStyle = {
  height: '.4rem',
  width:  '.4rem',
  margin: '-6px 6px 0 0',
}

const Cashier = ({ orderlite = {}, currentPayment, customerPayment = [], handleChangePayment, handlePay, handleToOrderInfo, showCashier = true }) => {
  const { name = '', price = 0, status, url, saasUrl, orderType } = orderlite
  const codeArr = (isTest() || isStg()) ?
    ['jiudian', 'jipiao', 'waimai', 'huoche', 'huafei', 'liuliang', 'shenghuojiaofei', 'dengjifuwu', 'menpiao', 'jiayouka', 'dianying', 'shengxian', 'weizhang', 'piaowu', 'qiche', 'coffee', 'paotui', 'baoyang', 'shangcheng', 'daojia', 'daijia'] :
    ['jiudian', 'waimai', 'huafei', 'liuliang', 'chongzhi', 'dengjifuwu', 'jiayouka', 'menpiao', 'shengxian', 'shenghuojiaofei', 'dianying', 'huoche', 'piaowu', 'qiche', 'shangcheng', 'daojia', 'daijia']
  let goUrl = url
  codeArr.map(i => {
    if (orderType === i || (orderType && orderType.indexOf('mms_') >= 0)) {
      goUrl = saasUrl
    }
    return goUrl
  })
  console.log('goUrl', goUrl, orderlite)

  if (goUrl) {
    if (status === 8) {
      handleToOrderInfo(goUrl, '已取消')
    } else if (status !== 2 && status !== 25) {
      handleToOrderInfo(goUrl)
    }
  }

  return (
    <div className='cashier-container'>
      {
        showCashier ? (
          <div>
            <div className='cashier-info'>
              <div className='title'>{ name }</div>
              <div className='sub-title'>
                <span className='gray tmr font-m price-name'>订单金额</span>
                <span className='red font-m price'>{ `￥${ price.toFixed(2) }` }</span>
              </div>
            </div>
            <WhiteSpace size='lg' />
            <List>
              {
                customerPayment.map(payment => {
                  const { channelCode, channelName, iconUrl } = payment
                  const bChoose = currentPayment.channelCode === channelCode
                  return (
                    <ListItem
                      key={ `${ Math.random() }` }
                      extra={ <img src={ bChoose ? chooseIcon : nochooseIcon } style={ iconStyle } alt='' /> }
                      onClick={ () => handleChangePayment(payment) }
                    >
                      <img src={ iconUrl } style={{ ...iconStyle, marginRight: '.12rem' }} alt='' /><span style={{ fontSize: '.28rem' }}>{ channelName }</span>
                    </ListItem>
                  )
                })
              }
            </List>
            <div style={{ padding: '.32rem' }}>
              <button className='btn wp100 primary' onClick={ () => handlePay(currentPayment, orderlite) }>支付</button>
            </div>
          </div>
        ) : ''
      }
    </div>
  )
}

export default Cashier
