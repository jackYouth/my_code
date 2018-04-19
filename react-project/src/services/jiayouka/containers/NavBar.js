import { connect } from 'react-redux'
import { wrap } from '@boluome/oto_saas_web_app_component'
import { getStore, setStore } from '@boluome/common-lib'
import { login }  from 'business'
import NavBar from '../components/navBar'
import { ChangeTab, showInfo, SaveOrder, getdiscountPrice } from '../actions/index'
import { fetchCardsList } from '../actions/getCardsList'
import { fetchOilChannel } from '../actions/getOilChannel'

const mapStateToProps = state => {
  const { GetOilChannel, GetCardsList, GetOilPrice, ShowInfo, DiscountPrice, Choosen, categoryId } = state


  return {
    ...GetOilChannel,
    ...GetCardsList,
    ...GetOilPrice,
    ...ShowInfo,
    ...Choosen,
    ...categoryId,
    ...DiscountPrice,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleChange: categoryId => {
      setStore('categoryId', categoryId, 'session')
      dispatch(ChangeTab(categoryId))
      dispatch(showInfo(''))
      dispatch(fetchCardsList({ customerUserId: getStore('customerUserId', 'session'), categoryId }))
      dispatch({ type: 'GET_OILPRICE', oilPrice: [] })
    },
    SaveOrder:        postData => dispatch(SaveOrder(postData)),
    getdiscountPrice: e => dispatch(getdiscountPrice(e)),
  }
}

const mapFuncToComponent = dispatch => {
  return {
    componentWillMount: () => {
      const categoryIds = getStore('categoryId', 'session')
      if (!categoryIds) {
        setStore('categoryId', '1', 'session')
      }
      if (getStore('customerUserId', 'session')) {
        console.log('in jiayouka index has customerUserId', getStore('customerUserId', 'session'))
        dispatch(fetchOilChannel())
      } else {
        login(err => {
          if (err) {
            console.log('jiayouka login err', err)
          } else {
            console.log('in jiayouka index login success has customerUserId', getStore('customerUserId', 'session'))
            dispatch(fetchOilChannel())
          }
        })
      }
    },
    componentDidMount: () => {
      console.log('window.otosaas-------', window.otosaas)
      console.log('window.OTO_SAAS-------', window.OTO_SAAS)
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrap(mapFuncToComponent)(NavBar))
