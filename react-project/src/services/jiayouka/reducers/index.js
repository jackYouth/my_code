import { combineReducers } from 'redux'
import Choosen from './choosen'
import GetOilChannel from './getOilChannel'
import GetCardsList from './getCardsList'
import ChangeTab from './changeTab'
import GetOilPrice from './getOilPrice'
import ShowInfo from './showInfo'
import EditInfo from './editInfo'
import DeleteCard from './deleteCard'
import SaveOrder from './saveOrder'
import DiscountPrice from './discountPrice'
import orderDetails from './orderDetails'

const reducer = combineReducers({
  Choosen,
  GetOilChannel,
  GetCardsList,
  ChangeTab,
  GetOilPrice,
  ShowInfo,
  EditInfo,
  DeleteCard,
  SaveOrder,
  DiscountPrice,
  orderDetails,
})

export default reducer
