import React from 'react'
import ReactDOM from 'react-dom'
import { getStore , get , send , setStore , removeStore} from '@boluome/common-lib'
import { Tabs, WhiteSpace , Modal , Toast , RefreshControl } from 'antd-mobile'
import { Loading }   from '@boluome/oto_saas_web_app_component'
import { login } from 'business'

export const customerCode = location.host.replace(/(.test.otosaas.com|.otosaas.com)/, '')
let pageIndex = 1

class OrdersList extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      orders: []
    }
  }

  componentWillMount(){
    let postData = {
      'pageSize':10
    }

    login(err => {
      console.log('err------------',err)
      // if(err) {
        this.feachOrdersList(postData)
      // }
    })

    this.feachOrdersList(postData)
  }

  handleChange(key) {
    this.setState({ orders: [] })
    pageIndex = 1
    let status
    switch (key) {
      case '2':  setStore('status', 2, 'session') ; break
      case '3':  setStore('status', 8, 'session') ; break
      case '4':  setStore('status', 7, 'session') ; break
      default :  removeStore('status', 'session') ; break
    }
    let postData = {
      'status': getStore('status','session')
    }
    this.feachOrdersList(postData)
  }

  handleScroll(e,key){
    // e.target
    // console.log(getScrollTop() + getClientHeight() , getScrollHeight())
    //获取滚动条当前的位置
    function getScrollTop() {
      return e.target.scrollTop
    }
    //获取当前可视范围的高度
    function getClientHeight() {
      let clientHeight = 0
      if (document.body.clientHeight && document.documentElement.clientHeight) {
        clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight)
      }
      else {
        clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight)
      }
      return clientHeight
    }

    //获取文档完整的高度
    function getScrollHeight() {
      return document.getElementsByClassName('mainContainerUl')[0].scrollHeight
    }

    if (getScrollTop() + getClientHeight() >= (getScrollHeight()+121)) {
      let postData = {
        'status': getStore('status','session'),
        'pageSize': 10,
        'pageIndex' : ++pageIndex
      }
      this.feachOrdersList(postData)
    }
  }

  handleDelete(id,orderType){
    const handleClose = Loading()
    let urls = '/order/v1/:orderType/:id'
    urls = urls.replace(/:id/,id)
    urls = urls.replace(/:orderType/,orderType)
    send( urls , { "Content-Type": "application/x-www-form-urlencoded" } , 'delete')
    .then(({ code, data = {}, message }) => {
      if ( code === 0 ){
        Toast.info('删除成功', 1)
        console.log(data)
      } else {
        Toast.info(message, 1)
      }
      handleClose()
    }).catch(err => {
      console.log(err)
      handleClose()
      Toast.info('删除订单失败',2)
    })
  }

  feachOrdersList(postData){
    const handleClose = Loading()
    let urls = '/order/v1/:customerUserId/orders'
    urls = urls.replace(/:customerUserId/,getStore('customerUserId','session'))
    get( urls , postData)
    .then(({ code, data = {}, message }) => {
      if ( code === 0 ){
        if( data.orders.length > 0 ){
          const { orders } = data
          this.setState({ orders: this.state.orders.concat(orders) })
          console.log(data)
        } else if( pageIndex != 1 && data.orders.length <= 0 ) {
          Toast.info('没有更多订单信息了～～',2)
        }
      } else {
        console.log(message)
      }
      handleClose()
    }).catch(err => {
      console.log(err)
      handleClose()
      Toast.info('获取订单列表失败',2)
    })
  }



  render() {

    const TabPane = Tabs.TabPane
    const { orders = [], filterStatus = [] } = this.state
    const tabList = [{ type:"所有订单",key:1},{ type:"待付款", key:2, status:2},{ type:"已取消", key:3, status:8},{ type:"退款", key:4, status: 7}]
    const alert = Modal.alert

    return (
      <div style={{height:'100%'}}>
        <Tabs defaultActiveKey="1" swipeable = {false} onChange = { (key) => { this.handleChange(key) } } >
          {
            tabList.map(({type ,key}) => (
              <TabPane tab={ type } key={ key }>
                <div className = 'mainContainer' onScroll = { (e) => this.handleScroll(e,key) } >
                  {
                    orders.length > 0 ?
                      <ul className='mainContainerUl'>
                        {
                          orders.map( ({ id , orderType , displayStatus , icon , name, date , price , status , orderTypeName}, index) => (
                            <li key={ `arr-${ index }` }>
                              <div className='orderContainer'>
                                <div className='orderTitle'>
                                  <span>{ orderTypeName }</span>
                                  <span>{ displayStatus }</span>
                                </div>
                                <div className='orderMain'>
                                  <div className='orderInfor'>
                                    <img src={ icon } />
                                    <div className='orderDetails'>
                                      <p>{ name }</p>
                                      <div className='orderTime'>
                                        <span>下单时间：</span>
                                        <span>{ date }</span>
                                      </div>
                                      <div className='payValue'>
                                        <span>付款金额：</span>
                                        <span>{ '¥' + price }</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className='orderBtn'>
                                    <button className='deleteOrder' onClick={() => alert('删除', '确定删除么?', [
                                      { text: '取消', onPress: () => console.log('cancel') },
                                      { text: '确定', onPress: () => this.handleDelete(id,orderType), style: { fontWeight: 'bold' } },
                                    ])}>删除订单</button>
                                    {
                                      status === 2 ? <button className='payNow'>立即付款</button> : ''
                                    }
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))
                        }
                      </ul> : <div className='noCoupon'>您还没有此类订单</div>
                  }
                </div>
              </TabPane>
            ))
          }
        </Tabs>
      </div>
    )
  }
}

export default OrdersList
