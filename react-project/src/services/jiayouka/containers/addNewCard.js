import { connect } from 'react-redux'
import { wrap } from '@boluome/oto_saas_web_app_component'
import AddNewCard from '../components/addNewCard'

const mapStateToProps = state => {
  const { GetCardsList, ShowInfo } = state

  // console.log('AddNewCardstate==========',state);

  return {
    GetCardsList,
    ShowInfo,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
  }
}

const mapFuncToComponent = () => {
  return {
    componentWillMount: () => {
      // dispatch(fetchOilChannel())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrap(mapFuncToComponent)(AddNewCard))
