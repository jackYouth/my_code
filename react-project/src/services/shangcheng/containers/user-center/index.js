import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { getStore } from '@boluome/common-lib'
import { wrap, Mask }    from '@boluome/oto_saas_web_app_component'

import UserCenter         from '../../components/user-center'

const mapStateToProps = ({ userCenter }) => {
  const features = [
    { title: '待付款', icon: require('../../img/feature_1.png') },
    { title: '待发货', icon: require('../../img/feature_2.png') },
    { title: '待收货', icon: require('../../img/feature_3.png') },
    { title: '待评价', icon: require('../../img/feature_4.png') },
    { title: '退款/售后', icon: require('../../img/feature_5.png') },
  ]
  const userId = getStore('customerUserId', 'session')
  return {
    ...userCenter,
    features,
    userId,
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch,
  handleFeatureClick(filter) {
    if (filter <= 3) {
      browserHistory.push(`/shangcheng/orderList?filter=${ filter }`)
    } else {
      browserHistory.push('/shangcheng/refundList')
    }
  },
  handleOwnClick(url) {
    browserHistory.push(`/shangcheng/${ url }`)
  },
  handleToAddress() {
    browserHistory.push('/shangcheng/address')
  },
})

const mapFunToComponent  = () => ({
  componentWillMount() {
    Mask.closeAll()
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(UserCenter)
)
