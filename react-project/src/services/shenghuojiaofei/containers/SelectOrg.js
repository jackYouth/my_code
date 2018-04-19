import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { setStore, getStore, parseQuery } from '@boluome/common-lib'
import { wrap } from '@boluome/oto_saas_web_app_component'

import SelectOrg from '../components/SelectOrg.js'
import { changeServer } from '../actions/selectOrg.js'

const mapStateToProps = ({ selectOrg }, { isIndex = '' }) => {
  const selectedCity = getStore('selectedCity', 'session') ? getStore('selectedCity', 'session').selectedCity : ''
  const currentOrg = getStore('currentOrg', 'session') ? getStore('currentOrg', 'session').currentOrg : selectedCity
  const { orgs = [], searchKey } = selectOrg
  let searchOrgResults = ''
  if (orgs.length !== 0) {
    if (searchKey === '') {
      searchOrgResults = orgs
    } else {
      searchOrgResults = orgs.filter(org => org.orgName.indexOf(searchKey) >= 0)
    }
  }
  return {
    selectedCity,
    currentOrg,
    searchOrgResults,
    isIndex,
  }
}

const mapDispatchToprops = dispatch => {
  return {
    dispatch,
    handleSelectOrg: currentOrg => {
      // 当链接中有billNo带过来时，就将billNo取出，存入currentOrg中，以使在addUser页面显示出默认的billNo
      const search = location.search
      if (parseQuery(search).billNo) currentOrg.billNo = parseQuery(search).billNo
      setStore('currentOrg', { currentOrg }, 'session')
      dispatch({ type: 'CHANGE_CURRENT_ORG', currentOrg })
      browserHistory.push(`/shenghuojiaofei/${ getStore('currentCategoryName', 'session').currentCategoryName }/addUser`)
    },
    handleSearch: searchKey => {
      dispatch({ type: 'CHANGE_SEARCH_KEY', searchKey })
    },
    handleSelectCity(isIndex) {
      browserHistory.push(`/shenghuojiaofei/${ getStore('currentCategoryName', 'session').currentCategoryName }/selectCity?flag=1&isIndex=${ isIndex }`)
    },
  }
}

const mapFuncToComponent = dispatch => {
  return {
    componentWillMount() {
      const orgsPara = getStore('getOrgsPara', 'session').getOrgsPara
      console.log('orgsPara', orgsPara)
      //  清空状态树中的 orgs 和 searchKey 信息，防止已有数据后，重新选择地址返回该页后，会使用旧数据
      dispatch({ type: 'CHANGE_SERVER_DATA', orgs: [] })
      dispatch({ type: 'CHANGE_SEARCH_KEY', searchKey: '' })
      dispatch(changeServer(orgsPara))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToprops)(wrap(mapFuncToComponent)(SelectOrg))
