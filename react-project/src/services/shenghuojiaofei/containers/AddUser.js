import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { getStore, setStore, parseQuery } from '@boluome/common-lib'
import { wrap } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { merge } from 'ramda'

import AddUser from '../components/AddUser.js'
import { newUserPage, newEditHome } from '../actions/index.js'
import { changeServer } from '../actions/selectOrg.js'


const chinaumsOrgIdTofft = (apiOrg, sessionOrg) => {
  return apiOrg.orgId === sessionOrg.orgId
  || (apiOrg.orgId === '888880002202900' && sessionOrg.orgId === '00000073')
  || (apiOrg.orgId === '888880002602900' && sessionOrg.orgId === '00000075')
  || (apiOrg.orgId === '888880004102900' && sessionOrg.orgId === '00000291')
  || (apiOrg.orgId === '888880004402900' && sessionOrg.orgId === '00000015')
  || (apiOrg.orgId === '888880004312900' && sessionOrg.orgId === '00000022')
  || (apiOrg.orgId === '888880002802900' && sessionOrg.orgId === '00000278')
  || (apiOrg.orgId === '888880002302900' && sessionOrg.orgId === '00000273')
  || (apiOrg.orgId === '888880002902900' && sessionOrg.orgId === '00000279')
  || (apiOrg.orgId === '888880004202900' && sessionOrg.orgId === '00000566')
  || (apiOrg.orgId === '888880000502900' && sessionOrg.orgId === '00000280')
  || (apiOrg.orgId === '888880001102900' && sessionOrg.orgId === '00000270')
  || (apiOrg.orgId === '888880001802900' && sessionOrg.orgId === '00001201')
}

const mapStateToProps = state => {
  const [currentServer, currentOrg, selectedCity, homesStore] =
    [
      getStore('currentServer', 'session').currentServer,
      getStore('currentOrg', 'session').currentOrg,
      getStore('selectedCity', 'session').selectedCity,
      getStore('homes', 'session').homes,
    ]

  const search = location.search      // ?a=1&b=2
  const queryTypeUrl = parseQuery(search).queryType //  => { a: 1, b: 2 }
  const { addUser } = state
  const { orgs } = addUser
  let queryTypes = []
  if (orgs) {
    orgs.forEach(item => {
      if (chinaumsOrgIdTofft(item, currentOrg)) {
        queryTypes = item.queryTypes
      }
    })
  }
  if (currentOrg.tag) {
    setStore('editInfo', { editInfo: currentOrg }, 'session')
  }
  return {
    currentServer,
    currentOrg,
    queryTypeUrl,
    queryTypes,
    selectedCity,
    homesStore,
    ...addUser,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleClickHome: currentHomeTag => {
      dispatch({ type: 'CHANGE_CURRENT_HOME', currentHomeTag })
    },
    handleNumChange: billNo => {
      dispatch({ type: 'CHANGE_NUM', billNo })
    },
    handlePwdChange: billPwd => {
      dispatch({ type: 'CHANGE_PWD', billPwd })
    },
    handleSelectOrg(currentServer, currentOrg, billNo) {
      let { cityId } = currentServer
      const { categoryId, billCityId } = currentOrg
      if (billCityId) cityId = billCityId
      const getOrgsPara = {
        categoryId,
        cityId,
        channel: 'chinaums',
      }
      setStore('getOrgsPara', { getOrgsPara }, 'session')  // 将请求org的参数放到session中
      dispatch({ type: 'SET_CURRENT_QUERY_TYPE', curQueryType: '' })
      if (billNo) {
        browserHistory.push(`/shenghuojiaofei/${ getStore('currentCategoryName', 'session').currentCategoryName }/selectOrg?billNo=${ billNo }`)
      } else {
        browserHistory.push(`/shenghuojiaofei/${ getStore('currentCategoryName', 'session').currentCategoryName }/selectOrg`)
      }
    },
    handleQueryBill: (queryInfo, validationExp) => {
      console.log('queryInfo', queryInfo)
      const { typeName, billNo } = queryInfo
      const reg = new RegExp(validationExp)
      if (validationExp && !reg.test(billNo)) {
        Toast.info(`请输入正确的${ typeName }`, 1)
        return
      }
      setStore('queryInfo', { queryInfo }, 'session')
      const currentBillInfo = getStore('currentBillInfo', 'session') ? getStore('currentBillInfo', 'session').currentBillInfo : ''
      const billParas = merge(currentBillInfo, queryInfo)
      if (billParas.bid) {     // 如果不是第一次新建页面，就执行编辑账单号
        dispatch(newEditHome(billParas, 'billInfo'))    // 当查询账单成功时，将账单保存到userPage中
      } else if (getStore('newUserPage', 'session') === 'newUserPage') {  // 如果是第一次加载新建页面，就执行新建账单号
        const selectedCity = getStore('selectedCity', 'session').selectedCity
        const { name, id } = selectedCity
        billParas.cityId = id
        billParas.cityName = name
        billParas.address = ''
        dispatch(newUserPage(billParas, billParas.tag, 'billInfo'))    // 当查询账单成功时，将账单保存到userPage中
      } else {  // 如果不是第一次加载新建页面，但是没有bid，就执行新建账单号
        dispatch(newUserPage(billParas, billParas.tag, 'billInfo'))    // 当查询账单成功时，将账单保存到userPage中
      }
    },
    handleQueryTypeChange: curQueryType => {
      dispatch({ type: 'SET_CURRENT_QUERY_TYPE', curQueryType })
    },
  }
}

const mapFuncToComponent = dispatch => {
  return {
    componentWillMount() {
      const currentOrg = getStore('currentOrg', 'session').currentOrg
      let { cityId } = currentOrg
      const { categoryId, billCityId, billNo } = currentOrg
      if (billCityId) cityId = billCityId
      dispatch(changeServer({ cityId, categoryId }))
      dispatch({ type: 'CHANGE_NUM', billNo })
    },
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(wrap(mapFuncToComponent)(AddUser))
