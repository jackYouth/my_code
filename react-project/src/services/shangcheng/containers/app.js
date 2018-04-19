/*
  1， 页面中有购物车时，需参见specialty中的三处数据初始化配置：购物车相关，因为是全局购物车，所以购物车数据统一放入app的数据分支中, 所以需要购物车的都要加上app分支加上const { cartCommoditys } = app
  2,  带搜索头部页面zIndex
    默认： 不设置
    不显示底部menus： 1
    省份： 2
    搜索模式底部： 3

  订单商品数据：
  // directOrder:  表示是否是在详情页面直接下单，如果是，就不删除购物车中数据
  {
    "commodityList": [
      {
      "currentPriceInfo": {
      "specificationId":539,
      "sellPrice":8,
      "originalPrice":10,
      "inventory":59,
      "threshold":5,
      "commodityWeight":0.04,
      "specificationItems":[],
      "canService":true
    },
    "buyNum":1,
    "commodityId":220,
    "brandId":140,
    "brandName":"我只有店铺",
    "bigLogoImg":"http://app.static.boluomeet.com/dev/mms/be1b14aa258e48a78a5a269a4136d195.png",
    "banners": ["http://app.static.boluomeet.com/0ae635a1-5177-41fa-9dc2-cd35aad4767a.jpeg"],
    "commodityName":"薄荷茶",
    "commodityDescription":"凉凉",
    "freightPrice":9,
    "purchasesCount":0,
    "specificationsMore":1,
    "city":"抚顺市",
    "province":"辽宁",
    "sellPrice":8,
    "originalPrice":10,
    "commodityStatus":1,
    "brandStatus":6,
    "prices":[{"specificationId":539,"sellPrice":8,"originalPrice":10,"inventory":59,"threshold":5,"commodityWeight":0.04,"specificationItems":[]}],
    "brand":{
    "brandId":140,
    "brandName":"我只有店铺",
    "bigLogoImg":"http://app.static.boluomeet.com/dev/mms/be1b14aa258e48a78a5a269a4136d195.png",
    "servicePhone":"111999",
    "mainCategoryId":194,
    "mainCategoryCode":"mms_nongtechanping",
    "commodityCount":17,
    "brandStatus":6,
    "brandCode":"wozhiyoudianpu",
    "serviceScore":5,
    "expressScore":4.3,
    "commodityScore":5,
    "attentionCount":13
    },
    "commodityDetails":[{ "imgDescription":"http://app.static.boluomeet.com/090aa8dd-5618-42ba-ae38-9abd1c2eafeb.jpg","commodityDetailType":1 }],
    "commentCount":0,
    "goodCommentCount":0,
    "parameters":[],
    "isCollection":false,
    "isNull":true,
    "isSelectCommodity":true
    }
    ],
    "directOrder": true,
    "totalPrice":"8.00",
    "totalNum":1,
    "brandId":140,
    "brandName":"我只有店铺",
    "brandImg":"http://app.static.boluomeet.com/dev/mms/be1b14aa258e48a78a5a269a4136d195.png",
  }

  2, 阿里百川聊天显示：
    1，app(containers)：componentDidMount
    2，app(components)：底部按钮个数
    3，commodity-detail(components)：消息icon入口
*/

import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { getStore, setStore } from '@boluome/common-lib'
import { wrap, Loading }    from '@boluome/oto_saas_web_app_component'
import customize from 'customize'
import { login, getLocationGaode } from 'business'

import App         from '../components/app'

const mapStateToProps = ({ app, message }) => {
  return {
    ...app,
    ...message,
  }
}


const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleChangeMenu(currentMenu) {
      if (currentMenu === 'main') {
        browserHistory.push(getStore('indexUrl', 'session'))
      } else {
        browserHistory.push(`/shangcheng/${ currentMenu }`)
      }
    },
  }
}
const closeLoading = Loading()

const mapFunToComponent  = dispatch => ({
  componentWillMount() {
    // mock_Data
    // setStore('customerUserId', 'blm_', 'session')
    // setStore('userPhone', '18787878787', 'session')
    // setStore('token', '7a08fcd1129a6821f877f0cb7f964249', 'session')

    // 存储基础数据
    setStore('channel_sc', 'shangcheng', 'session')
    if (!getStore('cartCommoditys')) setStore('cartCommoditys', { totalNum: 0, brandList: [] })
    if (!getStore('orderCommoditys')) setStore('orderCommoditys', { totalNum: 0, brandList: [] })

    // 购物车相关
    const cartCommoditys = getStore('cartCommoditys') ? getStore('cartCommoditys') : {}
    dispatch({ type: 'SET_CART_GOODS', cartCommoditys })

    // 登陆
    login(err => {
      if (err) {
        console.log('login err')
      } else {
        console.log('login suc')
        closeLoading()
        if (!getStore('indexUrl', 'session')) {
          setStore('indexUrl', window.location.href, 'session')
          console.log(2323232323232323, getStore('indexUrl', 'session'))
        }
      }
    })
    // 定位
    getLocationGaode(err => {
      if (err) {
        console.log('getLoaction error')
      } else {
        const currentPosition = getStore('currentPosition', 'session')
        const geopoint = getStore('geopoint', 'session')
        const { city, district } = currentPosition
        const selectedCity = { city: city.replace('市', ''), county: district, ...geopoint }
        setStore('selectedCity', selectedCity, 'session')
      }
      closeLoading()
    })
  },
  componentWillReceiveProps() {
    const pathname = location.pathname
    if (pathname.length <= 12 || pathname.indexOf('main') >= 0 || pathname.indexOf('message') >= 0 || pathname.indexOf('cart') >= 0 || pathname.indexOf('userCenter') >= 0) {
      dispatch({ type: 'SET_MENUS_VISIBLE', showMenus: true })
      const currentMenu = location.pathname.split('/')[2] ? location.pathname.split('/')[2] : 'main'
      dispatch({ type: 'SET_CURRENT_MENU', currentMenu })
    } else {
      dispatch({ type: 'SET_MENUS_VISIBLE', showMenus: false })
    }
  },

  // 阿里百川初始化
  // componentDidMount() {
  //   // 获取要聊天的用户
  //   const isPro = !isTest()
  //   const uid = isPro ? getStore('customerUserId', 'session') : '123'
  //   const credential = isPro ? getStore('customerUserId', 'session') : '123'
  //   const appkey = isPro ? '24687881' : '24687881'
  //
  //   const callback = () => {
  //     if (window.WSDK) {
  //       const sdk = new window.WSDK()
  //
  //       // 获取未读消息条数
  //       const getUnreadMsg = () => {
  //         sdk.Base.getUnreadMsgCount({
  //           count: 10,
  //           success({ data }) {
  //             console.log('getUnreadMsgCount', data)
  //             const totalUnreadNum = data.reduce((p, c) => {
  //               return p + c.msgCount
  //             }, 0)
  //             dispatch({ type: 'GET_UNREAD_MSG_COUNT', unreadMsg: data, totalUnreadNum })
  //           },
  //           error(error) {
  //             console.log('获取未读消息的条数失败', error)
  //           },
  //         })
  //       }
  //
  //       // 获取最近联系人
  //       const getRecentContact = () => {
  //         const msgLoading = Loading()
  //         if (sdk) {
  //           sdk.Base.getRecentContact({
  //             count: 10,
  //             success({ data }) {
  //               console.log('getRecentContact', data)
  //               // cnts数组中type：0 文字，1 图片，2 语音
  //               dispatch({ type: 'GET_RECENT_CONTACT', recentContact: data.cnts })
  //               msgLoading()
  //             },
  //             error(error) {
  //               console.log('获取最近联系人及最后一条消息内容失败', error)
  //               msgLoading()
  //             },
  //           })
  //         }
  //       }
  //
  //       // 订阅接受所有消息的事件
  //       const receiveAllMsg = () => {
  //         const Event = sdk.Event
  //         Event.on('START_RECEIVE_ALL_MSG', data => {
  //           console.log('我所有消息都能收到1', data)
  //         })
  //         sdk.Base.startListenAllMsg()
  //       }
  //
  //       // 用户登陆
  //       const baichuanLogin = () => {
  //         sdk.Base.login({
  //           uid,
  //           appkey,
  //           credential,
  //           timeout: 5000,
  //           success(data) {
  //             // {code: 1000, resultText: 'SUCCESS'}
  //             console.log('login success', data)
  //             getUnreadMsg()
  //             getRecentContact()
  //             receiveAllMsg()
  //
  //             // 轮询未读消息
  //             // if (window.unreadTimer) window.unreadTimer = setInterval(getUnreadMsg, 1000)
  //           },
  //           error(error) {
  //             // {code: 1002, resultText: 'TIMEOUT'}
  //             console.log('login fail', error)
  //           },
  //         })
  //       }
  //
  //       // 登陆并轮询获取未读消息(对话框页面，不登陆)
  //       baichuanLogin()
  //     }
  //   }
  //   // 阿里百川sdk加载
  //   if (location.pathname.indexOf('dialog') < 0) {
  //     const url = 'https://g.alicdn.com/aliww/h5.imsdk/2.1.5/scripts/yw/wsdk.js'
  //     appendJs(url, callback)
  //   }
  // },
})

export default customize(
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(App)
  )
)
