import { connect } from 'react-redux'
import { getdiscountPrice } from '../actions'
import MainContainer from '../components/mainContainer'

const mapStateToProps = state => {
  const { categoryId, ShowInfo, GetOilPrice, Choosen, DiscountPrice } = state

  return {
    ...categoryId,
    ...ShowInfo,
    ...GetOilPrice,
    ...Choosen,
    ...DiscountPrice,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    // handleClick:      currIndex => dispatch(AddChooseClass(currIndex)),
    getdiscountPrice: e => dispatch(getdiscountPrice(e)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer)
