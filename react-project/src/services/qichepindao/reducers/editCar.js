import { mergeState } from '@boluome/common-lib'

const initialState = {
  cheguChexi:     {
    model: '',
    logo:  '',
  },
  currentIndex:   '',
  engineNoLength: 99,
  vinLength:      0,
  plateNumber:    ['沪', 'A', '', '', '', '', ''],
  carPhone:       '',
  cityId:         '31',
  cityName:       '上海',
  engineNo:       '',
  id:             '',
  userId:         '',
  vin:            '',
  model:          '',
  time:           '',
  chexi:          '',
  chexing:        '',
  keyData:        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'],
}

const editCar = (state = initialState, action) => {
  switch (action.type) {
    case 'EDIT_RESET':
      return mergeState(state, action)
    default: return state
  }
}

export default editCar

// case 'DATA_INIT' :
//   return initialState
