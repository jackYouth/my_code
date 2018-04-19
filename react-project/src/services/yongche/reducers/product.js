import { mergeState } from '@boluome/common-lib'

// const date = moment('YYYY-MM-DD HH:mm')(new Date())
const initialState = {
  hasUnpay:           false,
  currentDate:        '',
  flightNo:           '',
  flightDate:         [''],
  defaultCurrentDate: ['今天', '现在'],
  // currentDate: [date.split(' ')[0], date.split(' ')[1].split(':')[0], date.split(' ')[1].split(':')[1]],
}

const product = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CURRENT_CITY':
    case 'SET_PRODUCT_SUPPORT_THIS_CITY':
    case 'SET_NEARBY_CAR':
    case 'SET_CURRENT_PRODUCT':
    case 'SET_ORDER_STATUE':
    case 'SET_START_POINT_STR':
    case 'SET_START_POINT_OBJ':
    case 'SET_END_POINT_STR':
    case 'SET_END_POINT_OBJ':
    case 'SET_CURRENT_CAR_INFO':
    case 'SET_CURRENT_PASSENGER':
    case 'SET_CURRENT_DATE':
    case 'SET_ESTIMATA':
    case 'SET_SINGLE_PRICE_INDEX_ORDER':
    case 'SET_PROMOTION_DATA':
    case 'SET_SINGLE_PRICE_PAY_VISIABLE':
    case 'SET_CURRENT_FLIGHT_NO':
    case 'SET_IS_START_TIMES_2':
    case 'SET_FLIGHTNO_ERROR_INFO':
    case 'SET_PAY_FOOTER_VISIBLE':
    case 'SET_PICKER_VISIBLE':
      return mergeState(state, action)
    default:
      return state
  }
}

export default product
