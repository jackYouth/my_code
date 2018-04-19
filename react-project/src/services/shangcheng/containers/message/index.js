import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
// import { getStore } from '@boluome/common-lib'
import { wrap }    from '@boluome/oto_saas_web_app_component'
// import TopClient from 'node-taobao-topclient'

import Message         from '../../components/message'

const mapStateToProps = ({ message }) => {
  return {
    ...message,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleChangeDialog(brandId, brandName) {
      location.href = `${ location.origin }/shangcheng/message/dialog?brandId=${ brandId }&brandName=${ brandName }`
      browserHistory.push()
    },
  }
}

const mapFunToComponent  = () => ({
  componentWillReceiveProps() {
    //
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Message)
)
