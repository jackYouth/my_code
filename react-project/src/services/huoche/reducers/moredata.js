import { mergeState } from '@boluome/common-lib'

const initialState = {
  title:        'huoche',
  botShow:      true,
  votesORprice: 'yupiao',
  isDrua:       false,
  isTime:       false,
  filiterObj:   {},
  oRisTime:     false,
  oRisDrua:     false,
  iSconditions: false,
  nowChecked:   false,
  nolist:       true,
  notOnceList:  true,
  ChangeSign:   '',
}

const Moredata = (state = initialState, action) => {
  switch (action.type) {
    case 'HUOCHE_INIT' :
      return initialState
    case 'KJIN_SCHEDULES' :
    case 'CALENDAR_TIME' :
    case 'CHOOSE_CITY' :
    case 'BOTTOM_SHOW' :
    case 'MORE_VOTES_PRICE' :
    case 'KJIN_STATIONS' :
    case 'IS_DRUA_TIME' :
    case 'IS_TIME' :
    case 'KJIN_FILTEROBJ' :
    case 'GET_FILTER_FN' :
    case 'NOWCHECHED' :
    case 'CHANGE_URL' :
      return mergeState(state, action)
    default: return state
  }
}

export default Moredata
