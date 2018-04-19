import { connect } from 'react-redux'
import { getStore, setStore } from '@boluome/common-lib'
import { wrap } from '@boluome/oto_saas_web_app_component'

import Order from '../../components/user-center/order'

import { getBestAddress, changeAddress, placeOrder } from '../../actions/user-center/order'

const mapStateToProps = ({ order }) => {
  const orderCommoditys = getStore('orderCommoditys')
  return {
    ...order,
    orderCommoditys,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleSelectAddress(contact) {
      dispatch({ type: 'SET_CURRENT_ADDRESS', contact })
      dispatch(changeAddress(contact))
    },
    handleRemarkChange(remark) {
      dispatch({ type: 'SET_CURRENT_REMARK', remark })
    },
    handlePlaceClick(orderCommoditys, contact, remark, invoiceId) {
      const { brandId, brandName, directOrder } = orderCommoditys
      const { contactId, province } = contact
      const paras = {
        contactId,
        province,
        invoiceId,
        brands: [
          {
            brandDescription: brandName,
            brandId,
          },
        ],
      }
      if (remark) paras.remark = remark
      dispatch(placeOrder(paras, directOrder))
    },
    handleSelectInvoice(invoiceInfo) {
      console.log('invoiceInfo', invoiceInfo)
      dispatch({ type: 'SET_INVOICE_INFO', invoiceInfo })
    },
  }
}

// 将当前的订单商品对应的运费参数，抽取出来，存入本地，供计算运费时使用
const getFreightParas = () => {
  const orderCommoditys = getStore('orderCommoditys')
  const { brandId, commodityList } = orderCommoditys
  // 将订单商品列表中的相同商品不同规格的商品合并为同一个商品，commodities为结果
  const commodities = []
  commodityList.forEach(o => {
    // inP：是否已存在当前列表中
    let inP = false
    const currentSpecificationFreigts = { specificationId: o.currentPriceInfo.specificationId, specificationName: o.currentPriceInfo.specificationName, count: o.buyNum }
    // 如果在已有列表中，将规格合并到已有商品的规格列表中
    commodities.map(oo => {
      if (oo.commodityId === o.commodityId) {
        inP = true
        oo.specifications.push(currentSpecificationFreigts)
      }
      return oo
    })
    // 如果不在已有列表中，新建一个商品，插入到已有商品列表
    if (!inP) {
      commodities.push({ commodityId: o.commodityId, commodityDescription: o.commodityDescription, specifications: [currentSpecificationFreigts], commodityType: o.commodityType })
    }
    return commodities
  })

  const freightParas = {
    brands: [
      {
        brandId,
        commodities,
      },
    ],
  }
  setStore('freightParas', freightParas, 'session')
  setStore('orderParasCommodities', commodities, 'session')
}

const mapFunToComponent = dispatch => {
  return {
    componentWillMount() {
      getFreightParas()
      dispatch(getBestAddress())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrap(mapFunToComponent)(Order))
