import React from 'react'
// import { browserHistory } from 'react-router'
import { setStore, getStore } from '@boluome/common-lib'
import { Calendar } from '@boluome/oto_saas_web_app_component'
import '../style/moreDate.scss'

class MoreDate extends React.Component {
  static defaultProps = {
    localCity: getStore('localCity', 'session'),
  }
  constructor(props) {
    super(props)
    // const { TimeListData } = props;console.log('ptops---more', props)
    const pricearr = getStore('priceDate', 'session')
    if (pricearr && pricearr.length > 0) {
      this.state = {
        pricearr,
      }
    } else {
      this.state = {
        pricearr: [],
      }
    }
    this.handleChooseTime = this.handleChooseTime.bind(this)
  }
  handleChooseTime(res) {
    setStore('chooseTime', res, 'session')
    // browserHistory.push('/menpiao/order')
    window.history.back()
  }

  render() {
    const { pricearr } = this.state
    console.log('pricearr---', pricearr)
    if (pricearr) {
      return (
        <div className='moreDateWrap'>
          <div className='moreDateMain'>
            <Calendar pricearr={ pricearr } isShow={ 'menpiao' } onChange={ e => this.handleChooseTime(e) } DefaultnoUse='nouse' />
          </div>
        </div>
      )
    }
  }
}

export default MoreDate
