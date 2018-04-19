import React from 'react'
import { Listview, Empty }   from '@boluome/oto_saas_web_app_component'
import { getStore, get } from '@boluome/common-lib'
import { Toast } from 'antd-mobile'
import { login }  from 'business'
import '../style/index.scss'
import img from '../images/6DB8BB14-84BE-4363-BAD0-7B65871D9340@3x.png'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      offset:    0,
      pageSize:  10,
      pageIndex: 1,
    }
    this.feachOrdersList = this.feachOrdersList.bind(this)
  }

  feachOrdersList(limit, offset, fetchData, onSuccess) {
    // const handleClose = Loading()
    const urls = '/order/v1/:customerUserId/orders'.replace(/:customerUserId/, getStore('customerUserId', 'session'))
    const { pageSize, pageIndex } = this.state
    get(urls, { pageIndex, pageSize })
    .then(({ code, data = {}, message }) => {
      if (code === 0) {
        if (data.orders.length > 0) {
          console.log(data)
          onSuccess(data.orders)
          this.setState({ offset: this.state.offset + data.orders.length })
          this.setState({ pageIndex: ++this.state.pageIndex })
        } else if (data.orders.length === 0) {
          onSuccess(data.orders)
          // Toast.info('没有更多订单信息了～～', 2)
          // handleClose()
        }
      } else {
        Toast.info(message, 2)
      }
      // handleClose()
    }).catch(err => {
      console.log(err)
      Toast.info('获取订单列表失败', 2)
    })
  }

  componentWillMount() {
    // document.title = '订单列表'
    login(err => {
      if (err) {
        console.log('login is err')
      } else {
        console.log('login is ok')
        this.setState({ customerUserId: getStore('customerUserId', 'session') })
      }
    })
  }

  render() {
    const { offset, pageSize, customerUserId, pageIndex } = this.state
    console.log('this.state', this.state, pageIndex, pageSize)
    return (
      <div>
        {
          customerUserId ?
            <Listview
              listItem={ <ListItem /> }
              onFetch={ this.feachOrdersList }
              limit={ 20 }
              offset={ offset }
              dataList={ [] }
              noOneComponent={ <Empty message='暂无订单' imgUrl={ img } /> }
            />
           : ''
        }
      </div>
    )
  }
}

const ListItem = ({ data }) => {
  const { id, orderType, displayStatus, icon, name, date, price, saasUrl } = data // url
  let payColor
  if (displayStatus === '待支付') {
    payColor = '#ff9a00'
  } else if (displayStatus === '已完成') {
    payColor = '#000'
  } else {
    payColor = '#999'
  }
  return (
    <div key={ `arr-${ id }` } className='listItem-container' onClick={ () => window.location.replace(saasUrl) }>
      <div className='orderInfor'>
        <img src={ icon } alt={ orderType } />
        <div className='orderDetails'>
          <p>{ name }</p>
          <span className='displayStatus' style={{ color: payColor }}>{ displayStatus }</span>
          <div className='payValue'>
            <span>付款金额：</span>
            <span>{ `¥ ${ price }` }</span>
            <span className='order-time'>{ date }</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
