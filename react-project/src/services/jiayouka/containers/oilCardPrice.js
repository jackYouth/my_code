import { connect } from 'react-redux'
import OilCardPrice from '../components/oilCardPrice'
import { AddChooseClass } from '../actions'

const mapStateToProps = state => {
  const { Choosen, GetOilPrice } = state

  return {
    ...Choosen,
    ...GetOilPrice,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    handleClick: currIndex => dispatch(AddChooseClass(currIndex)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OilCardPrice)
