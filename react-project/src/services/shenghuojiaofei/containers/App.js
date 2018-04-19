
/*
问题：
    1，默认的currentBillInfo格式：{ currentBillInfo: { cityId, cityName, address, tid, tag } }，
      正常格式：{ currentBillInfo: { cityId, cityName, address, tid, tag, ...当前的tagInfo  } }

*/

//  创建一个容器组件
//  引入react相关文件
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { Toast } from 'antd-mobile'
import { getStore, setStore, removeStore } from '@boluome/common-lib'
import { wrap, Loading } from '@boluome/oto_saas_web_app_component'
import { get, login, getLocationGaode } from 'business'
import { merge } from 'ramda'

import App from '../components/AppCategory.js'

//  引入action
import { changeCity, newDelUserPage } from '../actions'

  //  定义一个获取当前服务的函数，需传入citiId
const getCurrentServer = (cityId, serverName) => {
  let currentServer = {}
  switch (serverName) {
    case 'shuifei':
    case '1001':
      currentServer = { categoryName: 'shuifei', categoryId: '1001', cityId, name: '水费', icon: require('svg/shenghuojiaofei/sf.svg') }
      break
    case 'dianfei':
    case '1002':
      currentServer = { categoryName: 'dianfei', categoryId: '1002', cityId, name: '电费', icon: require('svg/shenghuojiaofei/df.svg') }
      break
    case 'ranqifei':
    case '1003':
      currentServer = { categoryName: 'ranqifei', categoryId: '1003', cityId, name: '燃气费', icon: require('svg/shenghuojiaofei/rqf.svg') }
      break
    case 'youxiandianshi':
    case '3001':
      currentServer = { categoryName: 'youxiandianshi', categoryId: '3001', cityId, name: '有线电视', icon: require('svg/shenghuojiaofei/yxds.svg') }
      break
    case 'guhua':
    case '7001':
      currentServer = { categoryName: 'guhua', categoryId: '7001', cityId, name: '固话', icon: require('svg/shenghuojiaofei/gh.svg') }
      break
    case 'kuandai':
    case '7002':
      currentServer = { categoryName: 'kuandai', categoryId: '7002', cityId, name: '宽带', icon: require('svg/shenghuojiaofei/kd.svg') }
      break
    case 'guhuakuandai':
    case '4001':
      currentServer = { categoryName: 'guhuakuandai', categoryId: '4001', cityId, name: '固话宽带', icon: require('svg/shenghuojiaofei/ghkd.svg') }
      break
    case 'wuyefei':
    case '5001':
      currentServer = { categoryName: 'wuyefei', categoryId: '5001', cityId, name: '物业费', icon: require('svg/shenghuojiaofei/wyf.svg') }
      break
    default:
      currentServer = { categoryName: 'all', categoryId: '', cityId, name: '全品类', icon: '' }
      break
  }
  return currentServer
}

const mapStateToProps = ({ app }) => {     // connect的第一个参数，每次state改变,这个函数都会执行一次。他的参数是定死的，第一个参数代表的是state，第二个参数代表的是router之类的属性，无用
  const localCity = getStore('localCity', 'session')

  const currentServerCategoryId = getCurrentServer('', location.pathname.split('/')[2]).categoryId
  return {
    ...app,
    localCity,
    getCurrentServer,
    currentServerCategoryId,
  }
}

const mapDispatchToProps = dispatch => { // connect的第二个参数，每次state改变，只有对应的函数会执行一次，一般参数都是存到本地中，后期获取的，在这里可以通过定义一个全局变量sta，把上一个函数中的state传递过来
  return {
    dispatch,
    handleSelectCity(selectedCity) {
      dispatch(changeCity(selectedCity)) // 改变当前选择的city对应的服务
    },
    handleSelectServer(currentServer) {
      setStore('currentServer', { currentServer }, 'session')
      setStore('getOrgsPara', { getOrgsPara: { cityId: currentServer.cityId, categoryId: currentServer.categoryId, channel: 'chinaums' } }, 'session')
      dispatch({ type: 'CHANGE_CURRENT_SERVER', currentServer })
      if (getStore('editInfo', 'session')) removeStore('editInfo', 'session')   // 当本地中有editInfo，就一出这条session
      browserHistory.push(`/shenghuojiaofei/${ getStore('currentCategoryName', 'session').currentCategoryName }/selectOrg`)
    },
    //  下面是第二个首页界面的相关方法
    handleToBill(currentServer, currentBillInfo) {  // 传入的数据是一个数组，有两个数据，一个是品类信息，一个是查询信息，直接跳转到账单页面
      currentBillInfo = merge(currentBillInfo)({ date: '' })
      setStore('currentHomeTag', { currentHomeTag: currentBillInfo.tag }, 'session')
      setStore('currentServer', { currentServer }, 'session')
      setStore('currentOrg', { currentOrg: currentBillInfo }, 'session')
      setStore('queryInfo', { queryInfo: currentBillInfo }, 'session')
      setStore('currentBillInfo', { currentBillInfo }, 'session')
      if (getStore('editInfo', 'session')) removeStore('editInfo', 'session')   // 当本地中有editInfo，就一出这条session
      browserHistory.push(`/shenghuojiaofei/${ getStore('currentCategoryName', 'session').currentCategoryName }/billInfo`)
    },
    handleToSelectOrgs(getOrgsPara, currentServer, currentBillInfo) { // 传入的数据是一个对象，只包含品类信息，直接跳转到选择org页面
      setStore('getOrgsPara', { getOrgsPara }, 'session')
      setStore('currentServer', { currentServer }, 'session')
      if (getStore('editInfo', 'session')) removeStore('editInfo', 'session')   // 当本地中有editInfo，就一出这条session
      setStore('currentBillInfo', { currentBillInfo }, 'session')
      setStore('selectedCity', { selectedCity: { id: getOrgsPara.cityId, name: getOrgsPara.name } }, 'session')             // 设置当前选择的城市信息
      removeStore('currentOrg', 'session')
      browserHistory.push(`/shenghuojiaofei/${ getStore('currentCategoryName', 'session').currentCategoryName }/selectOrg`)
    },
    handleChangeHome(o) {
      dispatch({ type: 'CHANGE_HOME_TAG', currentHomeTag: o.tag })
      dispatch(changeCity(o)) // 改变当前选择的city对应的服务
    },
    handleEditClick(isEdit) {
      dispatch({ type: 'SET_CURRENT_EDIT_STATUS', isEdit: !isEdit })
    },
    handleHomeManegeClick(currentHomeTag, currentBillInfo, userCategory) {
      setStore('currentHomeTag', { currentHomeTag }, 'session')
      setStore('currentBillInfo', { currentBillInfo }, 'session')
      setStore('userCategory', { userCategory }, 'session')
      browserHistory.push(`/shenghuojiaofei/${ getStore('currentCategoryName', 'session').currentCategoryName }/homeManege`)
    },
    handleClickNewIcon(currentHomeTag, currentBillInfo, userCategory, selectedCity) {
      setStore('currentHomeTag', { currentHomeTag }, 'session')
      currentBillInfo.cityName = selectedCity.name
      setStore('currentBillInfo', { currentBillInfo }, 'session')
      setStore('userCategory', { userCategory }, 'session')
      browserHistory.push(`/shenghuojiaofei/${ getStore('currentCategoryName', 'session').currentCategoryName }/addHome`)
    },
    handleNewEdit(currentServer, currentBillInfo) {
      const currentOrg = currentBillInfo
      setStore('currentServer', { currentServer }, 'session')
      setStore('currentBillInfo', { currentBillInfo }, 'session')
      setStore('selectedCity', { selectedCity: { id: currentBillInfo.billCityId, name: currentBillInfo.billCityName } }, 'session')        // 设置当前选择的城市信息
      setStore('currentOrg', { currentOrg }, 'session')
      if (getStore('editInfo', 'session')) removeStore('editInfo', 'session')   // 当本地中有editInfo，就一出这条session
      dispatch({ type: 'SET_CURRENT_EDIT_STATUS', isEdit: true })
      browserHistory.push(`/shenghuojiaofei/${ getStore('currentCategoryName', 'session').currentCategoryName }/addUser`)
    },
    handleNewDel(currentBillInfo) {
      const { tid, bid } = currentBillInfo
      dispatch({ type: 'SET_CURRENT_EDIT_STATUS', isEdit: true })
      dispatch(newDelUserPage({ tid, bid }))
    },
  }
}

const mapFuncToComponent = dispatch => {   // 整个生命周期只执行一次
  return {
    componentWillMount: () => {
      const handleClose = Loading()                   // 页面加载时开启loading图

      //  创建一个函数用于设置当前的生活缴费的服务信息
      const setServerInfo = cityId => {
        let currentCategoryName = location.pathname.split('/')[2]
        const currentServer = getCurrentServer(cityId, currentCategoryName)
        currentCategoryName = currentServer.categoryName
        const { categoryId } = currentServer
        setStore('currentCategoryName', { currentCategoryName }, 'session')
        setStore('currentServer', { currentServer }, 'session')
        setStore('getOrgsPara', { getOrgsPara: { cityId, categoryId, channel: 'chinaums' } }, 'session')
        dispatch({ type: 'CHANGE_CURRENT_SERVER', currentServer })
      }

      // 检查当前定位城市是否在城市列表中
      const checkCity = (localCity, cityList) => {
        cityList.forEach(item => {
          if (item.name === localCity) {                // 当定位城市在城市列表中，将城市名换成列表中的定位对象
            setStore('selectedCity', { selectedCity: item }, 'session')
            console.log('item', item)
            localCity = item
          }
        })

        if (localCity.id) {                             // 当定位城市不在城市列表中时，城市信息中是不会有id属性的
          setServerInfo(localCity.id)                   // 设置单品类时需要信息
          dispatch(changeCity(localCity, handleClose))  // 执行一次改变城市的套路，将当前城市下的service绑定到状态树中
        } else {                                        // 当定位城市不在城市列表中，将所有service表为空，这样其后所有页面都不会进入了
          dispatch({ type: 'CHANGE_CITY_SERVICE', service: [] })
          setServerInfo('')                             // 设置单品类时需要信息
          handleClose()
        }
      }

      let [localCity, cityList] = ['', '']
      // 如果已有选择城市，就不必执行定位，比如拆分的水费，新用户进入selectOrg，并选择城市时
      if (getStore('selectedCity', 'session') && getStore('selectedCity', 'session').selectedCity) {
        localCity = getStore('selectedCity', 'session').selectedCity.name
        setStore('localCity', localCity, 'session')     // localCity是字符串格式，表示定位的地址
        if (cityList) {
          checkCity(localCity, cityList)
        }
      } else {
        getLocationGaode(
          () => {                                                                  // 获取定位城市
            localCity = getStore('currentPosition', 'session').city.replace(/['省', '市', '县', '区']/, '')
            setStore('localCity', localCity, 'session')     // localCity是字符串格式，表示定位的地址
            if (cityList) {
              checkCity(localCity, cityList)
            }
          }
        )
      }

      // 获取定位时的城市名和城市信息，并通过checkCity获取当前定位的城市信息
      const getGeolocation = () => {
        get('/shenghuojiaofei/v1/chinaums/citys').then(({ code, data, message }) => {        // 获取支持城市列表
          if (code === 0) {
            cityList = data
            console.log('localCity', localCity)
            if (localCity) {
              checkCity(localCity, cityList)
            }
          } else {
            Toast.fail(message, 1)
          }
        })
      }

      // 获取用户信息
      const getUserPage = customerUserId => {
        get(`/shenghuojiaofei/v2/${ customerUserId }/info`).then(({ code, data, message }) => {
          if (code === 0) {
            const userCategory = data ? data.userCategory : []
            setStore('userCategory', { userCategory }, 'session')
            if (!userCategory || userCategory.length === 0) {           // 如果后台没有保存的用户信息，就删除session中保存的currentBillInfo，currentHomeTag
              setStore('currentBillInfo', { currentBillInfo: '' }, 'session')
              setStore('currentHomeTag', { currentHomeTag: '' }, 'session')
              // 调用获取定位城市对应信息的方法
              getGeolocation()
            } else {                                                    // 如果后台有保存的用户信息，就将保存的城市名称和id，保存到本地
              let name = userCategory[0].cityName
              let id = userCategory[0].cityId
              const currentHomeTag = getStore('currentHomeTag', 'session')
              // 如果是其他页面返回的，则session中就有currentHomeTag，根据这个，筛选出当前的city
              if (currentHomeTag) {
                userCategory.forEach(item => {
                  if (item.tag === currentHomeTag.currentHomeTag) {
                    name = item.cityName
                    id = item.cityId
                  }
                })
              }
              const selectedCity = {
                name,
                id,
              }
              setServerInfo(id)
              dispatch(changeCity(selectedCity, handleClose))  // 执行一次改变城市的套路，将当前城市下的service绑定到状态树中
            }
            dispatch({ type: 'GET_USER_PAGE', userCategory })
          } else {
            Toast.fail(message, 1)
          }
        })
      }

      // 如果已经有过登陆账号，那么直接使用登陆后的账号，不执行联合登陆
      if (getStore('customerUserId', 'session')) {
        getUserPage(getStore('customerUserId', 'session'))
      } else {
        login((err, { customerUserId }) => {
          if (err) {
            Toast.fail('用户登录失败！', 1)
          } else {
            getUserPage(customerUserId)
          }
        })
      }
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrap(mapFuncToComponent)(App))
