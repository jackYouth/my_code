import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { getStore, setStore } from '@boluome/common-lib'
import { Modal } from 'antd-mobile'

import { newDelUserPage } from '../actions/index.js'

import HomeManege from '../components/HomeManege'

import '../styles/home-manege.scss'

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
    handleNewDel(paras) {
      Modal.alert('', '删除将清除所有缴费信息', [
        { text: '取消', onPress: () => console.log('cancel') },
        { text: '删除', onPress: () => dispatch(newDelUserPage(paras)) },
      ])
    },
    handleHomeInput(currentHomeTag) {
      setStore('currentHomeTag', { currentHomeTag }, 'session')
      browserHistory.push(`/shenghuojiaofei/${ getStore('currentCategoryName', 'session').currentCategoryName }/editHome`)
    },
    handleToAddress() {
      browserHistory.push(`/shenghuojiaofei/${ getStore('currentCategoryName', 'session').currentCategoryName }/editAddress`)
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeManege)
