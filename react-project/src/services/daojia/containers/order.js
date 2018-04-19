import { connect } from 'react-redux'
import { parseQuery, getStore } from '@boluome/common-lib'
import { wrap } from '@boluome/oto_saas_web_app_component'
import { has } from 'ramda'

import Order from '../components/order'

import { getBestAddress, placeOrder, getPersonality, checkAddressAvail } from '../actions/order'

const mapStateToProps = ({ order }) => {
  const serviceId = parseQuery(location.search).serviceId
  const industryCode = getStore('industryCode', 'session')
  const selectGood = getStore(`selectGood_${ industryCode }`, 'session')
  return {
    ...order,
    serviceId,
    selectGood,
    industryCode,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleSelectAddress(contact, serviceId) {
      dispatch({ type: 'SET_CURRENT_ADDRESS', contact })
      if (contact) {
        const { contactId, mapType } = contact
        dispatch(checkAddressAvail({ contactId, serviceId, mapType }))
      }
    },
    handlePromotion(promotionData) {
      dispatch({ type: 'SET_PROMOTION_DATA', promotionData })
    },
    handlePlaceClick(paras) {
      dispatch(placeOrder(paras))
    },
    handleSelectConfirm(index, content, personalityList, title) {
      // index表示当前选择的是第几个个性化选项，content 表示当前选中的内容, personalityList 表示当前个性化选择的列表，title表示列表中每个个性化选择的名称
      personalityList = personalityList.filter(ii => !has(title)(ii))
      personalityList.push({ [title]: content })
      dispatch({ type: 'SET_PERSONALITY_CONTENT', [`personality${ index }`]: content, personalityList })
    },
    handleChangeCount(count) {
      dispatch({ type: 'SET_CURRENT_COUNT', count })
    },
  }
}

const mapFunToComponent = dispatch => {
  return {
    componentWillMount() {
      dispatch(getBestAddress())
      dispatch(getPersonality())

      // 还原默认数据
      dispatch({ type: 'SET_CURRENT_COUNT', count: 1 })
      dispatch({ type: 'SET_PERSONALITY_CONTENT', personalityList: [], personality0: '', personality1: '', personality2: '', personality3: '', personality4: '' })
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrap(mapFunToComponent)(Order))
