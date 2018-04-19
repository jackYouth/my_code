import { mergeState } from '@boluome/common-lib'

const initialState = {
  title:       'huoche',
  seatsChoose: {
    price: 0,
  },
}

const orderDetails = (state = initialState, action) => {
  switch (action.type) {
    case 'TICKETDETAILS' :
    case 'KJIN_SEATSDATA' :
    case 'CALENDAR_TIME' :
    case 'SEATSCHOOSE' :
    case 'TOURISTNUMBER' :
      return mergeState(state, action)
    default: return state
  }
}

export default orderDetails
