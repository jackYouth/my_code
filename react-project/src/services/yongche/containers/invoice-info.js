import { connect } from 'react-redux'
import { wrap } from '@boluome/oto_saas_web_app_component'
import { contains } from 'ramda'

import InvoiceInfo from '../components/invoice-info'

const mapStateToProps = ({ invoiceInfo }) => {
  // let totalinvoiceInfoPrice = 0
  return {
    ...invoiceInfo,
  }
}
const mapDispatchToProps = dispatch => ({
  dispatch,
  handleinvoiceInfoClick(index, invoiceInfoArr) {
    invoiceInfoArr.splice(index, 1, !invoiceInfoArr[index])
    dispatch({ type: 'SET_invoiceInfo_SELECTE', invoiceInfoArr })
    // 判断全选是否应该选中
    if (invoiceInfoArr && !contains(false)(invoiceInfoArr) && !contains(0)(invoiceInfoArr)) {
      dispatch({ type: 'SET_invoiceInfo_ALL_SELECTE', isAllSelect: true })
    } else {
      dispatch({ type: 'SET_invoiceInfo_ALL_SELECTE', isAllSelect: false })
    }
  },
  handleAllSelect(isAllSelect, invoiceInfoArr) {
    if (isAllSelect) {
      invoiceInfoArr = invoiceInfoArr.map(() => false)
    } else {
      invoiceInfoArr = invoiceInfoArr.map(() => true)
    }
    isAllSelect = !isAllSelect
    dispatch({ type: 'SET_invoiceInfo_ALL_SELECTE', isAllSelect })
    dispatch({ type: 'SET_invoiceInfo_SELECTE', invoiceInfoArr })
  },
})

const mapFunToComponent = () => ({
  componentDidMount: () => {
    console.log('invoice-info')
  },
})

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(InvoiceInfo)
  )
