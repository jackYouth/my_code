import { connect } from 'react-redux'
import { wrap, Mask, Loading } from '@boluome/oto_saas_web_app_component'
import { parseQuery, getStore } from '@boluome/common-lib'
import { getLocationGaode } from 'business'
import { getRestaurantInfo, getDeliveryInfo, handleShowAct, handleChangeCategory, fetchfoods, fetchPicList,
         chooseSpecs, chooseAttrs, handleChangeKey, cleanup, fetchAllFoods,
       } from '../actions/restaurantDetail'
// import { getCart } from '../actions/addorMinusToShoppingCar'
import RestaurantDetail from '../components/restaurantDetail'

let firstSmallScroll = 0
const mapStateToProps = ({ app, indexPage, restaurantDetail, addorMinusToShoppingCar }) => {
  // console.log('restaurantDetail', restaurantDetail)
  return {
    ...app,
    ...indexPage,
    ...restaurantDetail,
    ...addorMinusToShoppingCar,
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch,
  handleShowAct:   showAct => dispatch(handleShowAct(showAct)),
  handleBigScroll: e => {
    const bigScroll = e.target.scrollTop
    if (bigScroll >= getComputedStyle(e.target.childNodes[0]).height) {
      dispatch({ type: 'BIG_SCROLL', bigCanScroll: 1, smallCanScroll: 1 })
    }
  },
  handleSmallScroll: e => {
    const smallScroll = e.target.scrollTop
    if (!firstSmallScroll) {
      firstSmallScroll = smallScroll
    }
    const bigBox = document.querySelector('.restaurantDetailContainer')
    const topBox = document.querySelector('.restaurantTopInfo')
    if (smallScroll > 0 && smallScroll < topBox.offsetHeight) {
      document.querySelector('.food-container').lastElementChild.style.marginBottom = `${ topBox.offsetHeight - firstSmallScroll }px`
      document.querySelector('.menu-container').lastElementChild.style.marginBottom = `${ topBox.offsetHeight - firstSmallScroll }px`
    }
    bigBox.scrollTop = smallScroll
  },
  handleChangeCategory: index => {
    // document.querySelector('.food-container').scrollTop = 0
    dispatch(handleChangeCategory(index))
  },
  fetchfoods:      (restaurantId, menuCategoryName, menuCategoryId) => dispatch(fetchfoods(restaurantId, menuCategoryName, menuCategoryId)),
  chooseSpecs:     (specs, value) => dispatch(chooseSpecs(specs, value)),
  chooseAttrs:     (name, value, attrsArr) => dispatch(chooseAttrs(name, value, attrsArr)),
  handleChangeKey: e => dispatch(handleChangeKey(e)),
  cleanup:         (restaurantId, shoppingCarArray) => dispatch(cleanup(restaurantId, shoppingCarArray)),
})

const mapFunToComponent  = (dispatch, state) => ({
  componentWillMount: () => {
    console.log('state--------->', state)
    dispatch({ type: 'RESTAURANT_INFO', isFromRestDetail: 1 })
    dispatch({ type: 'RESTAURANT_INFO', restaurantInfo: {} })
    dispatch({ type: 'CHOOSE_MENU', foods: [] })
    dispatch({ type: 'RESTAURANT_MENU', restaurantMenu: [] })
    const search = parseQuery(location.search)
    const { restaurantId } = search
    const { choosePoint } = state
    let shoppingCarArray = []
    if (getStore('shoppingCarArray')) {
      shoppingCarArray = getStore('shoppingCarArray')
    } else {
      shoppingCarArray = state.shoppingCarArray
    }
    // const customerUserId = getStore('customerUserId', 'session')
    // if (!shoppingCarArray[customerUserId]) {
    //   shoppingCarArray[customerUserId] = {}
    // }
    // let shoppingCar = shoppingCarArray[customerUserId][restaurantId]
    let shoppingCar = shoppingCarArray[restaurantId]
    if (!shoppingCar) {
      shoppingCar = []
    }
    // shoppingCarArray[customerUserId][restaurantId] = shoppingCar
    shoppingCarArray[restaurantId] = shoppingCar
    dispatch({ type: 'SHOPPINGCAR_ARRAY', shoppingCarArray })
    dispatch({ type: 'RESTAURANT_ID', restaurantId })
    dispatch(fetchAllFoods(restaurantId))
    // dispatch(getMenu(restaurantId))
    if (!getStore('geopoint', 'session')) {
      if (getStore('choosepoint', 'session')) {
        dispatch(getRestaurantInfo(restaurantId, getStore('choosepoint', 'session')))
        dispatch(getDeliveryInfo(restaurantId, getStore('choosepoint', 'session')))
      } else {
        const handleClose = Loading()
        getLocationGaode(err => {
          if (err) {
            console.log('getLocation err', err)
            dispatch({ type: 'LOCATION_ERR', locationErr: true, offset: 10 })
            handleClose()
          } else {
            // console.log('ahahahahahahhaahhaahahh---------->', choosePoint)
            dispatch(getRestaurantInfo(restaurantId, choosePoint))
            dispatch(getDeliveryInfo(restaurantId, choosePoint))
            handleClose()
          }
        })
      }
    } else {
      dispatch(getRestaurantInfo(restaurantId, choosePoint))
      dispatch(getDeliveryInfo(restaurantId, choosePoint))
    }
    dispatch(handleChangeCategory(0))
    dispatch({ type: 'BIG_SCROLL', bigCanScroll: 1 })
    dispatch(fetchPicList(restaurantId))
    dispatch(handleChangeKey('1'))
  },
  componentDidMount: () => {
    const clientWidth = document.documentElement.clientWidth
    const the = document.querySelector('.restaurantDetailContainer')
    if (the) {
      the.style.width = clientWidth
    }
  },
  componentWillUnmount: () => {
    Mask.closeAll()
    dispatch({ type: 'ALL_FOODS', allFoods: [] })
  },
})

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(RestaurantDetail)
  )
