import { connect } from 'react-redux'
import { getStore, setStore } from '@boluome/common-lib'

import EditHome from '../components/EditHome'
import { newEditHome } from '../actions/index.js'

const mapStateToProps = () => {
  const [currentHomeTag, userCategory, currentBillInfo] = [getStore('currentHomeTag', 'session').currentHomeTag, getStore('userCategory', 'session').userCategory, getStore('currentBillInfo', 'session').currentBillInfo]
  return {
    currentHomeTag,
    userCategory,
    currentBillInfo,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleNewEdit: currentBillInfo => {
      const currentHomeTag = currentBillInfo.tag
      setStore('currentHomeTag', { currentHomeTag }, 'session')
      dispatch(newEditHome(currentBillInfo, 'homeManege'))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditHome)
