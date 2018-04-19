import { connect } from 'react-redux'
import AddOrMinusToShoppingCar from '../components/addOrMinusToShoppingCar'
import { addToShoppingCar } from '../actions/addorMinusToShoppingCar'

const mapStateToProps = ({ app, indexPage, restaurantDetail, order, addorMinusToShoppingCar }, { specfoods, attrs, specifications, activity }) => {
  // console.log(specfoods, attrs, specifications)
  return {
    ...app,
    ...indexPage,
    ...restaurantDetail,
    ...order,
    ...addorMinusToShoppingCar,
    specfoods,
    attrs,
    specifications,
    activity,
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch,
  addToShoppingCar: (datas, data, num) => dispatch(addToShoppingCar(datas, data, num)),
  // minusToShoppingCar: (datas, data) => dispatch(minusToShoppingCar(datas, data)),
})

export default
  connect(mapStateToProps, mapDispatchToProps)(
    (AddOrMinusToShoppingCar)
  )
