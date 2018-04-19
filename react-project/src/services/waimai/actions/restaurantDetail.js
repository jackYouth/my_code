import { getStore, setStore } from '@boluome/common-lib'
import { Loading }   from '@boluome/oto_saas_web_app_component'
import { get } from 'business'

export const fetchAllFoods = restaurantId => dispatch => {
  const handleClose = Loading()
  get('/waimai/v1/restaurant/specs/menus', { channel: 'ele', restaurantId }, {}, true)
  .then(({ code, data = {}, message }) => {
    if (code === 0) {
      dispatch({
        type:     'ALL_FOODS',
        allFoods: data,
      })
    } else {
      console.log(message)
    }
    handleClose()
  }).catch(err => {
    console.log(err)
  })
}

export const fetchfoods = (restaurantId, menuCategoryName, menuCategoryId) => dispatch => {
  const handleClose = Loading()
  get('/waimai/v1/specs/menus/category/foods', { channel: 'ele', restaurantId, menuCategoryName, menuCategoryId })
  .then(({ code, data = [], message }) => {
    if (code === 0) {
      dispatch({
        type:  'CHOOSE_MENU',
        foods: data,
        menuCategoryName,
        menuCategoryId,
      })
    } else {
      console.log(message)
    }
    handleClose()
  }).catch(err => {
    console.log(err)
  })
}

// 商家实景图列表
export const fetchPicList = restaurantId => dispatch => {
  const handleClose = Loading()
  get('/waimai/v1/restaurantPhotoList', { channel: 'ele', restaurantId })
  .then(({ code, data = [], message }) => {
    if (code === 0) {
      dispatch({
        type:      'PHOTO_LIST',
        photoList: data,
      })
    } else {
      console.log(message)
    }
    handleClose()
  }).catch(err => {
    console.log(err)
  })
}

// 获取多规格菜单分类
export const getMenu = restaurantId => dispatch => {
  const handleClose = Loading()
  get('/waimai/v1/specs/menus/categories', { channel: 'ele', restaurantId })
  .then(({ code, data = [], message }) => {
    if (code === 0) {
      dispatch({
        type:           'RESTAURANT_MENU',
        restaurantMenu: data,
      })
      dispatch(fetchfoods(restaurantId, data[0].menuCategoryName))
    } else {
      console.log(message)
    }
    handleClose()
  }).catch(err => {
    console.log(err)
  })
}

// 获取餐厅信息
export const getRestaurantInfo = (restaurantId, choosePoint) => dispatch => {
  const geopoint = typeof choosePoint !== 'undefined' ? choosePoint : getStore('geopoint', 'session')
  const handleClose = Loading()
  get('/waimai/v1/restaurant', { channel: 'ele', restaurantId, ...geopoint })
  .then(({ code, data = [], message }) => {
    if (code === 0) {
      dispatch({
        type:           'RESTAURANT_INFO',
        restaurantInfo: data,
      })
    } else {
      console.log(message)
    }
    handleClose()
  }).catch(err => {
    console.log(err)
  })
}

// 获取配送信息
export const getDeliveryInfo = (restaurantId, choosePoint) => dispatch => {
  const geopoint = typeof choosePoint !== 'undefined' ? choosePoint : getStore('geopoint', 'session')
  const handleClose = Loading()
  get('/waimai/v1/restaurant/delivery_info', { channel: 'ele', restaurantId, ...geopoint }, {}, true)
  .then(({ code, data = [], message }) => {
    if (code === 0) {
      dispatch({
        type:         'DELIVERY_INFO',
        deliveryInfo: data,
      })
    } else {
      console.log(message)
    }
    handleClose()
  }).catch(err => {
    console.log(err)
  })
}

export const handleShowAct = showAct => {
  return {
    type: 'SHOW_ACT',
    showAct,
  }
}

// 切换菜品
export const handleChangeCategory = index => {
  return {
    type:      'CHOOSE_MENU',
    currIndex: index,
  }
}

export const handleChangeKey = changedKey => {
  return {
    type: 'CHANGED_KEY',
    changedKey,
  }
}

// 暂存specs对象用于高亮
export const chooseSpecs = (specsName, value) => {
  const specsObj = {}
  specsObj.specsName = specsName
  specsObj.value = value
  return {
    type: 'CHOOSE_SPECS',
    specsObj,
  }
}

// 同上
export const chooseAttrs = (name, value, attrsArr) => {
  const attrsObj = {}
  attrsObj.name = name
  attrsObj.value = value
  attrsArr.push(attrsObj)
  return {
    type: 'CHOOSE_ATTRS',
    attrsArr,
  }
}

export const cleanup = (restaurantId, shoppingCarArray) => {
  // const customerUserId = getStore('customerUserId', 'session')
  // shoppingCarArray[customerUserId][restaurantId] = []
  shoppingCarArray[restaurantId] = []
  setStore('shoppingCarArray', shoppingCarArray)
  return {
    type: 'SHOPPINGCAR_ARRAY',
    shoppingCarArray,
  }
}
