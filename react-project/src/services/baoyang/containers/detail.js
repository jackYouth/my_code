import { connect }      from 'react-redux'
import { browserHistory } from 'react-router'
import { Toast } from 'antd-mobile'
import { wrap, Loading }         from '@boluome/oto_saas_web_app_component'
import { getStore, setStore } from '@boluome/common-lib'
import { Login } from 'business'
import { fetchDetails } from '../actions/detail'
import Detail           from '../components/detail'

const mapStateToProps = ({ detail, app }) => {
  const { channel } = app
  console.log('details--test', detail)
  return {
    channel,
    ...detail,
  }
}
const imgLoad = (src, cb) => {
  const img = new Image()
  img.onload = cb
  img.src = src
}
const mapDispatchToProps = dispatch => ({
  dispatch,
  handleShowLicense: shopId => {
    const { businessLicenseUrl } = getStore('currentShop', 'session')
    const handleClose = Loading()
    imgLoad(businessLicenseUrl, () => {
      handleClose()
      browserHistory.push(`/baoyang/${ shopId }/license`)
    })
  },
  handleToMap: shopId => {
    browserHistory.push(`/baoyang/${ shopId }/map`)
  },
  handleShowServiceDetail: (shopId, service) => {
    const { descriptionImage } = service
    setStore('currentService', service, 'session')
    const handleClose = Loading()
    imgLoad(descriptionImage, () => {
      handleClose()
      browserHistory.push(`/baoyang/${ shopId }/service/description`)
    })
  },
  handleBuyService: (shopId, service) => {
    if (getStore('customerUserId', 'session')) {
      setStore('currentService', service, 'session')
      browserHistory.push(`/baoyang/${ shopId }/service/confirm`)
    } else {
      Login(err => {
        if (err) {
          Toast.info('登录失败', 2, null, false)
        } else {
          console.log('用户绑定成功')
          setStore('currentService', service, 'session')
          browserHistory.push(`/baoyang/${ shopId }/service/confirm`)
        }
      }, true)
    }
  },
})

const mapFunToComponent  = (dispatch, state) => ({
  componentWillMount: () => {
    const { params, channel } = state
    const { shopId } = params
    const { longitude, latitude } = getStore('geopoint', 'session')
    dispatch(fetchDetails({
      shopId,
      channel,
      shopLng: longitude,
      shopLat: latitude,
    }))
  },
  // componentWillUnmount: () => {
  //   dispatch({ type: 'UPDATE_OFFSET', offset: 0, point: {} })
  // },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Detail)
)
