import { get, setStore } from '@boluome/common-lib'
// import { Loading } from '@boluome/oto_saas_web_app_component'
// import { getLocationGaode } from 'business'

export const appReset = data => ({
  type: 'ADD_RESET',
  ...data,
})

// 查询子分类
// export const getsubCategorie = (channel, areaId, categoryId) => dispatch => {
//   get('/shengxian/v1/commodity/subcategories', { channel, areaId, categoryId }).then(({ code, data, message }) => {
//     if (code === 0) {
//       dispatch(
//        appReset({
//          subcategoriesData: data,
//        })
//       )
//     } else {
//       console.log(message)
//     }
//   })
// }

// 查询分类
export const getCategorieAfter = (channel, areaId) => dispatch => {
  setStore('areaId', areaId, 'session')
  get('/shengxian/v1/categories', { channel, areaId }).then(({ code, data, message }) => {
    if (code === 0) {
      dispatch(
       appReset({
         categoriesData: '',
       })
      )
      const categoriesData = data.filter(e => {
        if (e.subcategoryList.length > 0) {
          e.areaId = `${ areaId }${ e.id }`
          return true
        }
        return false
      })
      if (categoriesData.length > 0) {
        dispatch(
         appReset({
           areaId,
           categoriesData,
           offset:            0,
           categoryId:        categoriesData[0].id,
           keys:              categoriesData[0].areaId,
           subcategoriesData: categoriesData[0].subcategoryList,
           categoryIdList:    categoriesData[0].subcategoryList[0].idList,
         })
        )
        setStore('categoryId', categoriesData[0].id, 'session')
        setStore('categoryIdList', categoriesData[0].subcategoryList[0].idList, 'session')
      } else {
        dispatch(
         appReset({
           areaId,
           categoriesData,
         })
        )
      }
    } else {
      console.log(message)
    }
  })
}


// 查询 areaId -> 分类
export const getCategorie = (channel, cityName, cityArr) => dispatch => {
  let areaId = ''
  for (let i = 0; i < cityArr.length; i++) {
    if (cityArr[i].name === cityName) {
      areaId = cityArr[i].channelCityId
      break
    }
  }
  dispatch(getCategorieAfter(channel, areaId))
}
