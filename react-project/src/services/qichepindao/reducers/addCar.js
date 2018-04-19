import { mergeState } from '@boluome/common-lib'

const initialState = {
  cityName:   '上海',
}

const addCar = (state = initialState, action) => {
  switch (action.type) {
    case 'ADDCAR_RESET':
      return mergeState(state, action)
    default: return state
  }
}

export default addCar
