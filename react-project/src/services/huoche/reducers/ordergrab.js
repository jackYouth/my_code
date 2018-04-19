import { mergeState } from '@boluome/common-lib'

const initialState = {
  title:         'huoche',
  maxprice:      0,
  touristNumer:  [],
  chooseArrtime: [],
  chooseCity:    {},
  haschecked:    true,
  NotEditable:   false,
  isBsb:         true,
  channel:       'tieyou',
  promotion:     {
    selectedCouponId: {
      couponId:   '',
      activityId: '',
    },
  },
}

const ordergrab = (state = initialState, action) => {
  switch (action.type) {
    case 'CALENDAR_TIME' :
    case 'MAX_PRICE' :
    case 'TOURISTNUMBER' :
    case 'PROMOTION' :
    case 'NAME' :
    case 'PHONE' :
    case 'KJIN_ACCIDENT' :
    case 'ORDER_CHECKED' :
    case 'GRAB_DATA' :
    case 'TIME_CHOOSE_ARR' :
    case 'HAVE_CHOOSE_TRAIN' :
    case 'SPEED_DATA' :
    case 'WITHOUTDISCOUNTED_PRICE' :
    case 'TICKETDETAILS' :
    case 'IS_BSB' :
    case 'HUOCHE_CHANNEL' :
      return mergeState(state, action)
    default: return state
  }
}

export default ordergrab
