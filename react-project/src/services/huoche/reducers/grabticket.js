import { mergeState } from '@boluome/common-lib'

const initialState = {
  title:         'huoche',
  timearr:       [],
  maxprice:      0,
  detailsTrick:  '',
  NotEditable:   true,
  seatsDataGrab: '',
  packagePrice:  30,
  chooseSeat:    [],
  chooseTrain:   [],
  searchgoGrab:  '',
}

const grabticket = (state = initialState, action) => {
  switch (action.type) {
    case 'CALENDAR_TIME' :
    case 'TIME_CHOOSE_ARR' :
    case 'CHOOSE_CITY' :
    case 'SPEED_DATA' :
    case 'MAX_PRICE' :
    case 'KJIN_ACCIDENT' :
    case 'HAVE_CHOOSE_TRAIN' :
      return mergeState(state, action)
    default: return state
  }
}

export default grabticket
