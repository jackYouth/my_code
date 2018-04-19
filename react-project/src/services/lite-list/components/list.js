import React, { Component }  from 'react'
import { ActivityIndicator, Toast } from 'antd-mobile'
// import VConsole from 'vconsole'
import { getStore, setStore, removeStore }          from '@boluome/common-lib'
import { get, isTest, isStg, login }               from 'business'
import { Loading, Empty }    from '@boluome/oto_saas_web_app_component'
import emptySrc              from '../images/empty.png'

// const vconsole = new VConsole()
// console.log('vconsole', vconsole.test)

class List extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orderList: [],
      loading:   false,
      pageSize:  10,
      pageIndex: 1,
      fetchmore: false,
      isMax:     false,
      orderListArr: ['waimai', 'dianying'],
      customerUserId: getStore('customerUserId'),
    }
    this.handleFetchMoreFn = this.handleFetchMore.bind(this)
  }

  upDateList() {
    const { customerUserId } = this.state
    const localOrderList = getStore(`${ customerUserId }_orderList_${ this.orderType }`).orderList
    localOrderList.forEach(({ status, id, orderType }) => {
      if ([4, 7, 8].every(i => status !== i)) {
        const handleClose = Loading({ mask: false })
        get(`/order/v1/${ orderType }/${ id }/info`, {}, {}, true)
        .then(({ code, data = {}, message }) => {
          if (code === 0) {
            const { orderList } = this.state
            for (let i = 0; i < orderList.length; i++) {
              if (orderList[i].id === id) {
                orderList[i] = data
                this.setState({ orderList })
                const newObj = {
                  orderList,
                  customerUserId,
                  date: getStore(`${ customerUserId }_orderList_${ this.orderType }`).date,
                }
                console.log('newObj', newObj)
                setStore(`${ customerUserId }_orderList_${ this.orderType }`, newObj)
                return
              }
            }
          } else {
            Toast.info(message, 2)
            console.log(message)
          }
        }).catch(err => {
          console.log(err)
        })
        handleClose()
      }
    })
  }

  fetchList() {
    let { orderList, isMax } = this.state
    const { pageSize, pageIndex, customerUserId } = this.state
    const { params, location } = this.props
    const { orderType } = params
    this.orderType = orderType
    const { orderTypes } = location.query
    const handleClose = Loading({ mask: false })
    let localOrderList = []
    if (this.isSaveOrder) {
      const localOrderObj = getStore(`${ customerUserId }_orderList_${ orderType }`)
      localOrderList = (localOrderObj && localOrderObj.orderList) || []
    }
    if (localOrderList.length >= pageSize * pageIndex || (localOrderList.length > 0 && localOrderList.length < 10)) {
      this.setState({ orderList: localOrderList, loading: false, fetchmore: false, isMax })
      this.upDateList()
      handleClose()
    } else {
      this.setState({ loading: true })
      get(`/order/v1/${ customerUserId }/orders`, { orderType: orderType === 'all' ? '' : orderTypes || orderType, pageSize, pageIndex }, {}, true)
      .then(({ code, data, message }) => {
        if (code === 0) {
          const { orders } = data
          orderList = orderList.concat(orders)
          const orderListObj = {
            orderList,
            customerUserId,
            date: new Date().getTime(),
          }
          if (this.isSaveOrder) {
            setStore(`${ customerUserId }_orderList_${ orderType }`, orderListObj)
          }
          // 由于减低服务器开销订单列表最多获取最新50条
          // if (count === orderList.length) {
          if (orderList.length === 50 || orders.length < 10) {
            isMax = true
          }
          this.setState({ orderList, loading: false, fetchmore: false, isMax })
        } else {
          this.setState({ fetchmore: false, loading: false })
          console.log(message)
        }
        handleClose()
      })
    }
  }

  componentWillMount() {
    const { params } = this.props
    const { orderType } = params
    const { customerUserId, orderListArr = [] } = this.state
    let date
    let nowDate
    // 如果是白名单中的服务则需要激活离线订单列表状态，并且判断缓存中的数据是否过期，如果过期，自动清除
    if (orderListArr.some(e => e === orderType)) {
      this.isSaveOrder = true
      date = (getStore(`${ customerUserId }_orderList_${ orderType }`) && getStore(`${ customerUserId }_orderList_${ orderType }`).date)
      nowDate = new Date().getTime()
      if (nowDate - date > 604800000) {
        removeStore(`${ customerUserId }_orderList_${ orderType }`)
      }
    }

    if (!getStore('customerUserId', 'session')) {
      login(err => {
        if (err) {
          console.log('binduser err', err)
        } else {
          this.fetchList()
        }
      }, true)
    } else {
      this.fetchList()
    }
  }

  handleFetchMore({ target }) {
    const { pageIndex, fetchmore, isMax, customerUserId } = this.state
    const localList = getStore(`${ customerUserId }_orderList_${ this.orderType }`)
    if (target.scrollHeight - (target.scrollTop + target.offsetHeight) <= 0 && !fetchmore) {
      if (isMax || localList.orderList.length >= 50) {
        this.setState({ fetchmore: true })
        setTimeout(() => {
          target.scrollTop -= 120
          this.setState({ fetchmore: false })
        }, 1500)
        // 为减低服务器开销，不再发起请求，并提示用户
        Toast.info('暂无更多订单', 2)
      } else {
        this.setState({ pageIndex: pageIndex + 1, fetchmore: true })
        setTimeout(() => {
          this.fetchList()
        }, 500)
      }
    }
  }
  render() {
    const { orderList, loading, fetchmore, isMax } = this.state
    // console.log('orderList---->', orderList)
    return (
      <div ref={ () => document.title = '订单列表' } className='touch-layer hp100' onScroll={ this.handleFetchMoreFn }>
        <div style={{ height: '100%' }} className='x-hide tmb touch-layer'>
          {
            getStore('customerUserId', 'session') ?
              <div>
                {
                  !loading && orderList.length === 0 ? (
                    <Empty imgUrl={ emptySrc } title='' message='暂无订单' />
                  ) : (
                    orderList.map((order, index) => {
                      return (<ListItem { ...{ ...order, index } } key={ order.id } />)
                    })
                  )
                }
                { fetchmore ? <div className='local-fetch'>{ isMax ? '没有更多数据了...' : <ActivityIndicator text='加载中...' /> }</div> : '' }
              </div>
            : ''
          }
        </div>
      </div>
    )
  }
}

export default List


const ListItem = ({ icon, name, displayStatus, price = 0, date, url, saasUrl, index, orderType }) => (
  <div className='pd16 tmb' key={ `order-list-${ index }` } style={{ backgroundColor: '#fff' }} onClick={ () => {
    const codeArr = (isTest() || isStg()) ?
    ['jiudian', 'jipiao', 'waimai', 'huoche', 'huafei', 'liuliang', 'shenghuojiaofei', 'dengjifuwu', 'menpiao', 'jiayouka', 'dianying', 'shengxian', 'weizhang', 'piaowu', 'qiche', 'coffee', 'paotui', 'baoyang', 'shangcheng', 'daojia', 'daijia'] :
    ['jiudian', 'waimai', 'huafei', 'liuliang', 'chongzhi', 'dengjifuwu', 'jiayouka', 'menpiao', 'shengxian', 'shenghuojiaofei', 'dianying', 'huoche', 'piaowu', 'qiche', 'shangcheng', 'daojia', 'daijia']
    let goUrl = url
    codeArr.map(i => {
      if (orderType === i) {
        goUrl = saasUrl
      }
      return goUrl
    })
    console.log('goUrl', goUrl)
    location.href = goUrl
  } }
  >
    <div className='wp15 inline-block vtop'><img src={ icon } alt='' style={ price > 0 ? { position: 'relative', width: '.64rem' } : { position: 'relative', top: '15px', width: '.64rem' } } /></div>
    <div className='wp85 inline-block'>
      <div className='tmb'>
        <div className='fright gray font-s' style={{ color: displayStatus === '待支付' ? '#ffab00' : '' }}>{ displayStatus }</div>
        <span className='font-m wp60' style={{ display: 'inline-block', textAlign: 'justify' }} >{ name }</span>
      </div>
      <div>
        <div className='fright gray font-s'>{ date }</div>
        <span className='gray font-s'>{ price > 0 ? `付款金额：${ price.toFixed(2) }元` : 0 }</span>
      </div>
    </div>
  </div>
)
