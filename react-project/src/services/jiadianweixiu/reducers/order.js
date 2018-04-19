import { mergeState } from '@boluome/common-lib'

const initialState = {
  title:           'jiadianweixiu',
  sum:             1,
  curDiscountData: { coupon: {}, activity: {}, discount: 0 },
  disabled:        false,
}
const getDetailsData = (state = initialState, action) => {
  switch (action.type) {
    case 'KJIN_DETAILSHOW':
    case 'KJIN_ORDERTIME' :
    case 'CHANGE_CONTACT' :
    case 'CHANGE_NUMBER' :
    case 'CHANGE_POINT' :
    case 'CHOOSE_SERVICETIME' :
    case 'NOHAS_CITYNAME' :
    case 'MARK_ORDERBTN' :
    case 'KJIN_PROMOTION' :
      return mergeState(state, action)
    default: return state
  }
}

export default getDetailsData
