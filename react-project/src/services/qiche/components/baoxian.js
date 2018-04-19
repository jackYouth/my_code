import React, { Component } from 'react'
import { Icon } from 'antd-mobile'
// import Baoxianitem from './baoxianitem'

// 保险
class Baoxian extends Component {
  constructor(props) {
    super(props)
    this.state = {
      baoxianData: this.props.baoxianData || [],
    }
    this.handleMid = this.handleMid.bind(this)
  }

  handleMid(insurancing) {
    const { baoxianData = [] } = this.state
    const { handleContainerClose, handleInseran } = this.props
    const arr = baoxianData.map(e => {
      if (e.productId === insurancing.productId) {
        return Object.assign(e, { choose: true })
      }
      return Object.assign(e, { choose: false })
    })
    if (handleInseran) handleInseran(arr)
    this.setState({ baoxianData: arr })
    handleContainerClose()
  }

  render() {
    const { handleContainerClose } = this.props
    const { baoxianData = [] } = this.state
    return (
      <div className='baoxian' onClick={ () => { handleContainerClose() } }>
        <div className='baoxian_main' onClick={ e => { e.stopPropagation() } }>
          {
            baoxianData.length > 0 && baoxianData.map(e => {
              return (
                <div className='baoxian_list' key={ `bx${ Math.random() }` } onClick={ () => { this.handleMid(e) } }>
                  <div>
                    <p>{ `${ e.insuranceName }  ${ e.insuranceProductName }` }</p>
                    <p>{ e.compensationVolume ? `推荐购买，正常出票，保额${ e.compensationVolume }万` : '安全出行，建议选购保险' }</p>
                  </div>
                  <Icon type={ e.choose === true ? require('svg/qiche/selceting.svg') : require('svg/qiche/selcetno.svg') } />
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

export default Baoxian
