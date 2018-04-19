import { connect } from 'react-redux'
import { wrap } from '@boluome/oto_saas_web_app_component'
import { getStore } from '@boluome/common-lib'
import { browserHistory } from 'react-router'
import { fetchCardsList } from '../actions/getCardsList'
import { showInfo, editInfo, DeleteCard } from '../actions/index'
import CardsList from '../components/cardsList'

const mapStateToProps = state => {
  const { GetCardsList, ShowInfo, EditInfo } = state

  return {
    ...GetCardsList,
    ShowInfo,
    EditInfo,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleClick: currId => {
      dispatch(showInfo(currId))
      window.history.go(-1)
      // browserHistory.push('/')
    },
    editCards: id => {
      dispatch(editInfo(id))
      browserHistory.push(`/jiayouka/AddNewCard?id=${ id }`)
    },
    handleDeleteContact: id => {
      dispatch(DeleteCard(id))
    },
  }
}

const mapFuncToComponent = dispatch => {
  return {
    componentWillMount: () => {
      dispatch(fetchCardsList({ customerUserId: getStore('customerUserId', 'session'), categoryId: getStore('categoryId', 'session') }))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrap(mapFuncToComponent)(CardsList))
