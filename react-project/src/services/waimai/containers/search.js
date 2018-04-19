import { connect } from 'react-redux'
import { getStore } from '@boluome/common-lib'
import { wrap } from '@boluome/oto_saas_web_app_component'
import { searchThis, handleScrollTop } from '../actions/search'
import SearchPage from '../components/search'

let choosePoint
const mapStateToProps = ({ app, indexPage, restaurantDetail, addorMinusToShoppingCar, filter, searchProps }) => {
  choosePoint = indexPage.choosePoint
  return {
    ...app,
    ...indexPage,
    ...restaurantDetail,
    ...addorMinusToShoppingCar,
    ...filter,
    ...searchProps,
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch,
  search: (searchKey, cb) => {
    // const { choosePoint = {} } = this.props
    const geopoint = choosePoint && choosePoint.latitude ? choosePoint : getStore('geopoint', 'session')
    // const geopoint = getStore('geopoint', 'session')
    searchThis({ channel: 'ele', ...geopoint, keywords: searchKey, limit: 50 }, data => {
      console.log('data------->', data)
      if (data.length > 0) {
        // setStore('searchList', JSON.stringify(data))
        dispatch({ type: 'SEARCH_LIST', searchList: data, myKey: '' })
        cb(null, data)
      } else {
        cb(null, [])
      }
    })
  },
  setSearchKey: myKey => {
    if (typeof myKey === 'string') {
      document.querySelector('#searchInput').value = myKey
    } else {
      myKey = document.querySelector('#searchInput').value
    }
    dispatch({ type: 'SET_KEY', myKey })
  },
  handleScrollTop: e => dispatch(handleScrollTop(e)),
  myClean:         () => dispatch({ type: 'SET_KEY', myKey: '' }),
})

const mapFunToComponent  = (dispatch, state) => ({
  componentWillMount: () => {
    // const { isFromRestDetail, oldScrollTop } = state
    // // const myKey = getStore('searchHistory')[getStore('searchHistory').length - 1]
    // console.log('state--------->', isFromRestDetail, oldScrollTop, document.querySelector('.dataList'))
    // if (document.querySelector('.dataList') && isFromRestDetail) {
    //   console.log('in efwajioiaewij', oldScrollTop)
    //   document.querySelector('.dataList').scrollTop = oldScrollTop
    // }
    // Mask.closeAll()
    // console.log('myKey', myKey)
    // const searchList = getStore('searchList')
    // if (searchList.length > 0) {
    //   dispatch({ type: 'SEARCH_LIST', searchList })
    //   dispatch({ type: 'SET_KEY', myKey })
    // }
  },
  componentDidMount: () => {
    const { isFromRestDetail, oldScrollTop } = state
    if (document.querySelector('.dataList') && isFromRestDetail) {
      document.querySelector('.dataList').scrollTop = oldScrollTop
    }
    dispatch({ type: 'SET_KEY', myKey: '' })
  },
  componentWillUnmount: () => {
    dispatch({ type: 'CHANGE_OFFSET', offset: 0 })
    // dispatch({ type: 'SET_KEY', myKey: '' })
  },
})

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(SearchPage)
  )
