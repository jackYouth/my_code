import React, { Component } from 'react'
import Baoxianitem from './baoxianitem'

// 保险
class Baoxian extends Component {
  constructor(props) {
    super(props)
    this.state = {
      insuranceList: this.props.insuranceList || [],
    }
    this.handleMid = this.handleMid.bind(this)
  }

  handleMid(insurancing) {
    const { insuranceList } = this.state
    let bool = false
    let index = 0
    for (let i = 0; i < insuranceList.length; i++) {
      if (insuranceList[i].code === insurancing.code) {
        bool = true
        index = i
      }
    }
    if (bool && insurancing.credentialCodes.length > 0) {
      insuranceList[index].credentialCodes = insurancing.credentialCodes
    } else if (bool) {
      insuranceList.splice(index, 1)
    } else {
      insuranceList.push(insurancing)
    }
    this.setState({ insuranceList })
  }

  render() {
    const { handleContainerClose, baoxianData = [], pasdata, insuranceList, handleInseran } = this.props
    return (
      <div className='baoxian'>
        <div className='baoxian_main'>
          {
            baoxianData.length > 0 && baoxianData.map(e => <Baoxianitem key={ e.code } handleMid={ this.handleMid } insuranceList={ insuranceList } baoxianDataitem={ e } pasdata={ pasdata } />)
          }
          <Baoxianitem />
        </div>
        <div className='baoxian_btn'><span onClick={ () => { handleInseran(this.state.insuranceList); handleContainerClose() } }>确定</span></div>
      </div>
    )
  }
}

export default Baoxian
