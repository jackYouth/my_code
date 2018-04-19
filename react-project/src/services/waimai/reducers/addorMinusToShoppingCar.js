import { mergeState } from '@boluome/common-lib'

const initialState = {
  title: 'takeaway-addorMinusToShoppingCar',
}

const addorMinusToShoppingCar = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOPPINGCAR_ARRAY' :
      return mergeState(state, action)
    default: return state
  }
}

export default addorMinusToShoppingCar
