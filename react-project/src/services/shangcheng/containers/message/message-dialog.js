import React from 'react'
import { browserHistory } from 'react-router'
import { appendJs, getStore, parseQuery } from '@boluome/common-lib'
import { isTest } from 'business'

import '../../styles/message/message-dialog.scss'

export default class MessageDialog extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)
    this.fSize = document.documentElement.style.fontSize
  }
  componentDidMount() {
    // 获取要聊天的用户
    const brandName = parseQuery(location.search).brandName
    const touid = parseQuery(location.search).brandId
    const isPro = !isTest()
    const uid = isPro ? getStore('customerUserId', 'session') : '132'
    const credential = isPro ? getStore('customerUserId', 'session') : '132'
    const appkey = isPro ? '24687881' : '24687881'

    // 阿里百川初始化
    const url = 'https://g.alicdn.com/aliww/??h5.imsdk/2.1.5/scripts/yw/wsdk.js,h5.openim.kit/0.4.0/scripts/kit.js?mobile=1'
    const callback = () => {
      if (window.WKIT) {
        window.WKIT.init({
          uid,
          credential,
          appkey,
          // 需要聊天的用户
          touid,
          // 自定义颜色 (初始化了这些颜色，才会出现对应的类名)
          themeBgColor:     '#f3f3f4',
          msgBgColor:       '#ffab00',
          themeColor:       '#333333',
          title:            brandName,
          // avatar:        'https://otosaas.pek3a.qingstor.com/test/mms/f2169f31-7b84-48c0-a290-1fe70c10b63a.jpg',
          // 隐藏登陆结果提示
          hideLoginSuccess: true,
          // 成功后回调
          onLoginSuccess() {
            const sdk = window.WKIT.Conn.sdk
            // console.log('登陆成功，sdk为：', sdk)
            // 接受当前的所有消息
            sdk.Chat.startListenMsg({ touid })
          },
          // 收到消息后的回调
          onMsgReceived(data) {
            console.log('收到消息：', data)
          },
        })
      }
    }
    appendJs(url, callback)

    // 创建一个店铺的悬浮框
    const business = document.createElement('div')
    business.id = 'business-icon'
    business.innerHTML = `<img src=${ require('../../img/business.png') } alt='business-icon' />`
    business.onclick = () => {
      browserHistory.push(`/shangcheng/${ touid }`)
    }
    document.body.appendChild(business)
    this.business = business
  }
  componentWillUnmount() {
    if (window.WKIT) {
      // const node = document.getElementById('wkit-content')
      window.WKIT.destroy()
      document.documentElement.style.fontSize = this.fSize
      // node.parentNode.removeChild(node)
    }
    // 移除插入的商家按钮标签
    if (this.business) this.business.remove()
  }

  render() {
    return (
      <div />
    )
  }
}
