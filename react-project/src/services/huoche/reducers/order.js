import { mergeState, getStore } from '@boluome/common-lib'

const channel = getStore('huoche_channel', 'session')
const initialState = {
  title:      'huoche',
  haschecked: true,
  isBsb:      true,
  channel,
  propsObj:   {
    trainNumber: '',
    trains:      '',
  },
  seatsChoose: {
    price: 0,
  },
  touristNumer: [],
  ChangeSign:   '',
  promotion:    {
    selectedCouponId: {
      couponId:   '',
      activityId: '',
    },
  },
  chooseTime: {
    date: '',
    weed: '',
  },
}

const order = (state = initialState, action) => {
  switch (action.type) {
    case 'KJIN_ACCIDENT' :
    case 'TOURISTNUMBER' :
    case 'TICKETDETAILS' :
    case 'SEATSCHOOSE' :
    case 'CALENDAR_TIME' :
    case 'ORDER_CHECKED' :
    case 'PROMOTION' :
    case 'PHONE' :
    case 'NAME' :
    case 'WITHOUTDISCOUNTED_PRICE' :
    case 'CHANGE_DATA_SIGN' :
    case 'IS_BSB' :
    case 'HUOCHE_CHANNEL' :
      return mergeState(state, action)
    default: return state
  }
}

export default order
