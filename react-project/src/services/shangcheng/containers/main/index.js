import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
// import { getStore, setStore } from '@boluome/common-lib'
import { wrap }    from '@boluome/oto_saas_web_app_component'

import Main         from '../../components/main'
import { getColumns, getNewCommoditys, getRecommends } from '../../actions/main'


const mapStateToProps = ({ main }) => {
  const mockAdList = [
    { img: require('../../img/carousel_1.png'), id: 1 },
    { img: require('../../img/carousel_1.png'), id: 2 },
    { img: require('../../img/carousel_1.png'), id: 3 },
    { img: require('../../img/carousel_1.png'), id: 4 },
  ]
  const columnList = [
    { categoryName: '全部商品', url: '/shangcheng/commodityList/all', icon: require('../../img/market.png') },
    { categoryName: '口碑食品', url: '/shangcheng/commodityList/158', icon: require('../../img/food.png') },
    { categoryName: '订单', url: '/shangcheng/orderList?filter=', icon: require('../../img/order.png') },
    { categoryName: '分类', url: '/shangcheng/categories', icon: require('../../img/category.png') },
  ]
  const categorySecondatys = [
    { title: '珠宝首饰', text: '顺从自然，至臻于美', img: require('../../img/accessories.png'), url: '/shangcheng/commodityList/215', id: 1 },
    { title: '休闲食品', text: '浓情惬意，尽在其中', img: require('../../img/foods.png'), url: '/shangcheng/commodityList/162', id: 2 },
    { title: '农特产品', text: '强国富民，助推三农', img: require('../../img/products.png'), url: '/shangcheng/commodityList/194', id: 3 },
  ]
  return {
    ...main,
    mockAdList,
    columnList,
    categorySecondatys,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleColumnClick(data) {
      const { url } = data
      browserHistory.push(url)
    },
    handleCommodityClick(id) {
      browserHistory.push(`/shangcheng/commodity?commodityId=${ id }`)
    },
    handleCategoryClick(url) {
      browserHistory.push(url)
    },
  }
}

const mapFunToComponent  = dispatch => ({
  componentWillMount() {
    dispatch(getColumns())
    dispatch(getNewCommoditys())
    dispatch(getRecommends())
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Main)
)
