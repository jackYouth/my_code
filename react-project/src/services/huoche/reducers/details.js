import { mergeState } from '@boluome/common-lib'

const initialState = {
  title:      'huoche',
  ChangeSign: '',
  noSeats:    true,
}

const details = (state = initialState, action) => {
  switch (action.type) {
    case 'TICKETDETAILS' :
    case 'CALENDAR_TIME' :
    case 'KJIN_SEATSDATA' :
    case 'CHANGE_URL' :
      return mergeState(state, action)
    default: return state
  }
}

export default details
