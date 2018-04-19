import { connect } from 'react-redux'
import { getStore, setStore } from '@boluome/common-lib'
import { Loading } from '@boluome/oto_saas_web_app_component'

import EditAddress from '../components/EditAddress'
import { newEditHome, changeCity } from '../actions/index.js'

const mapStateToProps = () => {
  const [currentHomeTag, currentBillInfo, userCategory] =
    [
      getStore('currentHomeTag', 'session').currentHomeTag,
      getStore('currentBillInfo', 'session').currentBillInfo,
      getStore('userCategory', 'session').userCategory,
    ]
  return {
    currentHomeTag,
    currentBillInfo,
    userCategory,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    // handleHomeInput: currentHomeTag => {
    //   setStore('currentHomeTag', { currentHomeTag }, 'session')
    //   browserHistory.push(`/shenghuojiaofei/${ getStore('currentCategoryName', 'session').currentCategoryName }/editHome`)
    // },
    handleChangeCityData: res => {
      const handleClose = Loading()
      dispatch(changeCity(res, handleClose, false))
    },
    handleNewEdit: (editParas, currentBillInfo) => {
      dispatch(newEditHome(editParas, 'homeManege'))
      setStore('currentBillInfo', { currentBillInfo }, 'session')
    },
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(EditAddress)
