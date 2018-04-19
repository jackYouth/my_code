import { connect } from 'react-redux'
import { getStore, parseQuery } from '@boluome/common-lib'
import { wrap }    from '@boluome/oto_saas_web_app_component'

import CommodityList         from '../../components/common-component/commodity-list'
import { getCommodityList } from '../../actions/common-component/commodity-list'

const mapStateToProps = ({ commodityList }, props) => {
  const { isBrand } = props
  const filters = [{ name: '价格', code: 'priceDESC' }, { name: '销量', code: 'sales' }, { name: '新品', code: 'new' }]
  // 购物车相关
  return {
    ...commodityList,
    filters,
    isBrand,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleChangeCommodityList(currentFilter, commodityListParas) {
      if (currentFilter.code === 'priceASC') {
        currentFilter.code = 'priceDESC'
      } else if (currentFilter.code === 'priceDESC') {
        currentFilter.code = 'priceASC'
      }
      const url = commodityListParas.url
      const paras = commodityListParas.paras
      paras.filter = currentFilter.code
      dispatch(getCommodityList(url, paras))
      dispatch({ type: 'SET_CURRENT_FILTER', currentFilter })
    },
    handleChangeMode(model) {
      dispatch({ type: 'CHANGE_SHOW_MODE', model })
    },
  }
}

const mapFunToComponent = (dispatch, props) => (
  {
    componentWillMount() {
      // 清空想上一次页面的数据
      dispatch({ type: 'SET_GOOD_LIST', commodityList: '', commodityListParas: '' })

      const { isBrand } = props
      const isBrandCategories = parseQuery(location.search).isBrandCategories
      let url = ''
      let paras = {}
      if (!isBrand && !isBrandCategories) {
        url = '/mall/v1/commodities'
        paras = location.pathname.split('/')[3] === 'all' ? { filter: 'sales' } : { categoryId: location.pathname.split('/')[3], filter: 'sales' }
      }

      if (isBrand) {
        url = '/mall/v1/commodity/list'
        const brandId = getStore('brandId', 'session')
        paras = { brandId, filter: 'sales' }
      }

      if (isBrandCategories) {
        url = '/mall/v1/brand/sort/commoditys'
        const brandId = getStore('brandId', 'session')
        const brandSortId = parseQuery(location.search).brandSortId
        paras = { brandId, brandSortId, filter: 'sales' }
      }
      dispatch(getCommodityList(url, paras))
    },
  }
)

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(CommodityList)
)
