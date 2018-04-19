import { connect } from 'react-redux'
import { wrap }    from '@boluome/oto_saas_web_app_component'
import App         from '../components/app'

const mapStateToProps = ({ app }) => {
  const service = [
    // { name: '水费', icon: require('../img/icon_1.png'), url: '/shenghuojiaofei/shuifei' },
    { name: '话费充值', icon: require('../img/icon_2.png'), url: '/huafei' },
    // { name: '电费', icon: require('../img/icon_3.png'), url: '/shenghuojiaofei/dianfei' },
    { name: '流量充值', icon: require('../img/icon_4.png'), url: '/liuliang' },
    // { name: '燃气费', icon: require('../img/icon_5.png'), url: '/shenghuojiaofei/ranqifei' },
    { name: '加油卡充值', icon: require('../img/icon_6.png'), url: '/jiayouka' },
    // { name: '固话宽带', icon: require('../img/icon_7.png'), url: '/shenghuojiaofei/guhuakuandai' },
    { name: '违章缴费', icon: require('../img/icon_8.png'), url: '/weizhang' },
    // { name: '有线电视', icon: require('../img/icon_9.png'), url: '/shenghuojiaofei/youxiandianshi' },
  ]
  const tips = '温馨提示：<br />1.本服务不提供机打发票，服务商是否提供发票以当地服务商发票获取政策为准。如有报销需求，建议线下充值缴费；<br />2.支付成功后，如遇未到账或未处理的情况，请及时拨打客服热线：400-991-0008；<br />3.充错号码或缴费号码有误，一旦成功，无法办理退款。请输入号码时仔细确认。'
  return {
    ...app,
    service,
    tips,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleToServer(url) {
      const { location } = window
      location.href = `${ location.origin }${ url }${ location.search }`
    },
  }
}

const mapFunToComponent  = () => ({
  componentDidMount: () => console.log('root mounted'),
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(App)
)
