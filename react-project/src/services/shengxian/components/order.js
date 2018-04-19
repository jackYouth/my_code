import React from 'react'
import { NewPromotion, ContactShow, Mask, SlidePage } from '@boluome/oto_saas_web_app_component'
import { WhiteSpace, List, Picker, Icon } from 'antd-mobile'
import '../style/order.scss'

const Item = List.Item

const Order = order => {
  const {
          handleCur,
          handleSuccess,
          contact = '',
          dateArr,
          deliveryDate,
          handleDeliveryDate,
          invoiceName,
          handleInvoiceName,
          commodityList,
          commodityAmountpri,
          commodityAmountnum,
          curDiscountData,
          other,
          handleOther,
          freight,
          handleOrder,
          submit,
        } = order
  return (
    <div className='orderWrap'>
      <div className='order'>
        <ContactShow { ...{ contact, handleSuccess } } />
        <WhiteSpace size='lg' />
        <Picker title={ '选择送达时间' } data={ dateArr } cols={ 1 } onChange={ res => { console.log(res); handleDeliveryDate(res) } } value={ deliveryDate }>
          <Item arrow='horizontal' className='postDate' thumb={ <Icon type={ require('svg/shengxian/timer.svg') } /> }>配送日期</Item>
        </Picker>
        <WhiteSpace size='lg' />
        <List>
          <Item extra={ <p style={{ color: '#cccccc' }}>在线支付</p> }>支付方式</Item>
        </List>
        <WhiteSpace size='lg' />
        <div className='listWrap'>
          {
            commodityList && commodityList.map((o, i) => { if (i > 2 && other) { return false } return <Listviewli key={ `s${ i + 1 }` } data={ o } /> })
          }
          <p className='freight'>运费<span>￥{ freight ? freight.postFee : 0.0 }</span></p>
          { commodityList && commodityList.length > 3 && <p onClick={ () => { handleOther(other) } }>{ other ? '展开全部' : '收起全部' }</p> }
        </div>
        <WhiteSpace size='lg' />
        { commodityList && <NewPromotion handleChange={ res => { handleCur(res) } } orderType='shengxian' channel='yiguo' amount={ commodityAmountpri } count={ commodityAmountnum } /> }
        <WhiteSpace size='lg' />
        <List>
          <Item arrow='horizontal'
            extra={ <p style={{ color: '#cccccc' }}>{ invoiceName || '不需要发票' }</p> }
            onClick={ () => Mask(
              <SlidePage target='right' type='root' showClose={ false } >
                <Fapiao invoiceName={ invoiceName } handleInvoiceName={ handleInvoiceName } />
              </SlidePage>, { mask: false, style: { position: 'absolute' } }) }
          >
            发票抬头
          </Item>
        </List>
      </div>
      <div className='bottomDiv'>
        <div className='bottomInfo'>
          <div className='info'>
            <p><span><i>实付：￥{ commodityAmountpri && ((commodityAmountpri - (curDiscountData ? curDiscountData.discount : 0)) + (freight ? freight.postFee : 0)).toFixed(2) }</i></span><i>{ (curDiscountData && curDiscountData.discount) ? `优惠￥${ (curDiscountData.discount).toFixed(2) }` : '' }</i></p>
          </div>
          <div style={ submit ? { background: '#ffab00' } : { background: '#cccccc' } } className='btn' onClick={ () => { if (submit) { handleOrder(order) } } }>立即下单</div>
        </div>
      </div>
    </div>
  )
}
const Listviewli = ({ data }) => {
  return (
    <div className='listitem'>
      <div className='pic'><img alt='生鲜' src={ data.picUrl } /></div>

      <div className='info'>
        <h1>{ data.commodityName }</h1>
        <div className='bottomPart'>
          ¥{ data.price }<span>x{ data.num }</span>
        </div>
      </div>
    </div>
  )
}

class Fapiao extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      invoiceTran: this.props.invoiceName,
    }
  }
  handleInvoiceTran(invoiceTran) {
    this.setState({ invoiceTran })
  }
  close(invoiceTran) {
    this.props.handleContainerClose()
    this.props.handleInvoiceName(invoiceTran)
  }
  render() {
    const { invoiceTran } = this.state
    return (
      <div className='fapiao'>
        <h2>发票抬头</h2>
        <WhiteSpace size='lg' />
        <div className='inputWrap'>
          <textarea maxLength='60' cols='40' rows='3' placeholder='请输入发票抬头（可不填）' onChange={ e => { this.handleInvoiceTran(e.target.value) } } defaultValue={ invoiceTran } />
        </div>
        <div className='fpbtn' onClick={ () => { this.close(invoiceTran) } }>确定</div>
      </div>
    )
  }
}

export default Order
