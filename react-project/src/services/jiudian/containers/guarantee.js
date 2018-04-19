import { connect }     from 'react-redux'
import { wrap, Mask }        from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import Guarantee       from '../components/guarantee'
import { handleCreditNo, checkCreditCard, handleCvv, handleDate, handleUserName, handleID, handleUserPhone } from '../actions/guarantee'
import { saveOrder } from '../actions/order'

const mapStateToProps = ({ app, condition, hotelList, detail, order, guarantee }) => {
  return {
    ...app,
    ...condition,
    ...hotelList,
    ...detail,
    ...order,
    ...guarantee,
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch,
  handleCreditNo:  v => dispatch(handleCreditNo(v)),
  checkCreditCard: creditCardNo => dispatch(checkCreditCard(creditCardNo)),
  handleCvv:       v => dispatch(handleCvv(v)),
  handleDate:      v => dispatch(handleDate(v)),
  handleUserName:  v => dispatch(handleUserName(v)),
  handleID:        v => dispatch(handleID(v)),
  handleUserPhone: v => dispatch(handleUserPhone(v)),
  checkInfo:       data => {
    console.log('data', data)
    const { cvvNo, validDate, userName, userID, userPhone } = data
    let isPassed = 0
    const a = [userPhone, userID, userName, validDate, cvvNo]
    const b = ['银行办卡手机号', '银行办卡证件号', '持卡人姓名', '有效期', 'CVV码']
    a.forEach((item, index) => {
      if (!item) {
        console.log('item', item)
        Toast.info(`请输入${ b[index] }`, 2)
      } else {
        isPassed++
      }
    })
    if (isPassed === 5) {
      dispatch(saveOrder(data))
    }
  },
})

const mapFunToComponent = () => ({
  componentWillMount: () => {

  },
  componentWillUnmount: () => {
    Mask.closeAll()
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Guarantee)
)
