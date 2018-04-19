import { connect } from 'react-redux'
import { getStore } from '@boluome/common-lib'
import { Loading } from '@boluome/oto_saas_web_app_component'

import AddHome from '../components/AddHome'
import { newUserPage, changeCity } from '../actions/index.js'

const mapStateToProps = () => {
  const [currentHomeTag, currentBillInfo, userCategory, currentServer] =
    [
      getStore('currentHomeTag', 'session').currentHomeTag,
      getStore('currentBillInfo', 'session').currentBillInfo,
      getStore('userCategory', 'session').userCategory,
      getStore('currentServer', 'session').currentServer,
    ]

  const homes = ['我家', '父母家', '房东', '朋友', '其它'].filter(item => {
    let inHomes = false
    userCategory.forEach(o => {
      if (item === o.tag) {
        inHomes = true
      }
    })
    return !inHomes
  }).map(item => ({ label: item, value: item }))

  return {
    currentHomeTag,
    currentBillInfo,
    currentServer,
    userCategory,
    homes,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleChangeCityData: res => {
      const handleClose = Loading()
      dispatch(changeCity(res, handleClose, false))
    },
    handleNewHome: (currentBillInfo, currentHomeTag) => {
      dispatch({ type: 'CHANGE_HOME_TAG', currentHomeTag })
      dispatch(newUserPage(currentBillInfo, currentHomeTag))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddHome)
