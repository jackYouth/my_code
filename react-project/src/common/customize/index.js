import offlinePluginRuntime from 'offline-plugin/runtime'
import React, { Component } from 'react'
import { customerCode, customerConfig, customer, isTest } from 'business'
import { setServerUrl, log, appendJs, parseQuery }  from '@boluome/common-lib'
import { Empty } from '@boluome/oto_saas_web_app_component'
import { Icon }  from 'antd-mobile'
// import pingan    from './pingan-one'

offlinePluginRuntime.install()

export default (
  WrappedComponent =>
  class extends Component {
    constructor(props) {
      super(props)

      const { routes = [], location } = this.props
      const { pathname } = location
      this.state = {
        childPageShow: false,
        alreadyConfig: false,
        isRoot:        this.checkIsRoot(routes, pathname),
        // 添加当获取不到在线状态时，默认在线的判断（兼容 唯品 红米4 手机无法识别是否在线的问题）  2018.1.5 jackyouth
        online:        navigator.onLine || (typeof navigator.onLine) === 'undefined',
        indexHref:     '',                      // 首页的链接，用于iframe包裹容器时使用
      }
      this.pre = this.pre.bind(this)
      this.processNetwork = this.processNetwork.bind(this)
    }
    componentWillMount() {
      let { indexHref } = this.state
      if (!indexHref) {
        indexHref = window.location.href
        this.setState({ indexHref })
      }
      // this.handleCloseLoading = Loading()
    }
    checkIsRoot(routes, pathname) {
      return routes.filter(({ path = '' }) => path.replace(/\//g, '') === pathname.replace(/\//g, '')).length > 0
    }
    componentWillReceiveProps(props) {
      const { routes = [], location }   = props
      const { pathname } = location
      this.setState({ isRoot: this.checkIsRoot(routes, pathname) })
    }
    componentDidUpdate() {
      const { isRoot } = this.state
      const { afterChangePage = () => {} } = this.process
      afterChangePage(isRoot)
    }
    componentDidMount() {
      // 首页loading
      // console.log('firstLoading')
      const firstLoading = document.getElementById('firstLoading')
      if (firstLoading) firstLoading.remove()
      const { fetch } = window
      if (!fetch) {
        const fetchJsUrl = isTest() ? './fetch.js' : 'https://jackyouth.cdn.com/js/fetch.js'
        appendJs(fetchJsUrl, this.pre)
      } else {
        this.pre()
      }
    }
    processNetwork() {
      window.addEventListener('online', () => {
        this.setState({ online: navigator.onLine })
      })
      window.addEventListener('offline', () => {
        this.setState({ online: navigator.onLine })
      })
    }
    handleShowChildPage() {
      this.setState({ childPageShow: true })
    }
    pre() {
      // 设置请求的服务地址
      setServerUrl(/192.168.|localhost/.test(location.hostname) ? 'https://dev-api.jackyouth.com' : `${ location.origin }/api`)
      // 获取客户配置
      customerConfig(customerCode, err => {
        if (err) {
          log('customer config err', err)
        }
        this.process = customer('process')
        const { beforeEnterPage = () => {} } = this.process
        beforeEnterPage()
        this.setState({
          alreadyConfig: true,
        })
        // this.handleCloseLoading()
      })
      this.processNetwork()
    }
    processRender() {
      const { childPageShow, isRoot, online, alreadyConfig, indexHref } = this.state
      // console.log('isRoot', isRoot)
      const currentCustomer = (customer('customize') && customer('customize').default) || {}
      // 如果没有网络的情况下展示无网络
      if (!online) return (<Empty imgUrl={ <Icon type={ require('./images/no-network.svg') } /> } title='无网络连接' message='请检查是否连接到 无线/移动 网络' />)
      // 如果没有获取到用户配置则返回空页面
      if (!alreadyConfig) return (<div className='non-config' />)
      const { type } = currentCustomer

      if (type === 'full' && isRoot) {
        return (
          childPageShow
          ? React.cloneElement(<WrappedComponent />, { ...this.props })
          : currentCustomer.create({ onClick: this.handleShowChildPage.bind(this) })
        )
      }
      if (type === 'banner') {
        return (
          <div>
            { currentCustomer.create({ isRoot, serviceComponent: React.cloneElement(<WrappedComponent />, { ...this.props }) }) }
          </div>
        )
      }
      if (parseQuery(window.location.search).noframe !== '1' && type === 'frameWrap') {
        return (
          <div>
            { currentCustomer.create({ isRoot, serviceComponent: React.cloneElement(<WrappedComponent />, { ...this.props }), indexHref }) }
          </div>
        )
      }
      return React.cloneElement(<WrappedComponent />, { ...this.props })
    }
    render() {
      return this.processRender()
    }
  }
)
