import React, { Component } from 'react'
import { Icon } from 'antd-mobile'
import { Mask, SlidePage } from '@boluome/oto_saas_web_app_component'

// 保险item
class Baoxianitem extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentWillMount() {
    const { baoxianDataitem, insuranceList = [] } = this.props
    const code =  typeof baoxianDataitem === 'object' ? baoxianDataitem.code : ''
    const arr = insuranceList.filter(e => {
      if (e.code === baoxianDataitem.code) {
        return true
      }
      return false
    })
    const insurancing = arr.length > 0 ? arr[0] : { credentialCodes: [], code }
    this.setState({ insurancing })
  }
  handleSelect(info) {
    const { handleMid } = this.props
    const { insurancing } = this.state
    const { credentialCodes } = insurancing
    let bool = false
    let index = 0
    for (let i = 0; i < credentialCodes.length; i++) {
      if (credentialCodes[i].id === info.id) {
        bool = true
        index = i
      }
    }
    if (bool) {
      insurancing.credentialCodes.splice(index, 1)
    } else {
      insurancing.credentialCodes.push(info)
    }
    handleMid(insurancing)
    this.setState({ insurancing })
  }

  render() {
    const { baoxianDataitem, pasdata = [] } = this.props
    const { insurancing } = this.state
    const { credentialCodes } = insurancing
    if (baoxianDataitem) {
      const { name, price, brief } = baoxianDataitem
      return (
        <div className='baoxianlist'>
          <div className='baoxianlist_title' >
            <div>
              <p>{ name }<span><i>¥{ price }</i>/份</span></p>
              <Icon onClick={ () => Mask(<SlidePage target='right' showClose={ false } ><Tan data={ baoxianDataitem } /></SlidePage>, { mask: false, style: { position: 'absolute' } }) } type={ require('svg/jipiao/tip.svg') } />
            </div>
            <p>{ brief }</p>
          </div>
          {
            pasdata.length > 0 && <div className='baoxianlist_select'>
                {
                  pasdata.map(e => <span key={ e.id } onClick={ () => { this.handleSelect(e) } }><Icon type={ credentialCodes.some(s => s.id === e.id) ? require('svg/jipiao/selceting.svg') : require('svg/jipiao/selcetno.svg') } />{ e.name }</span>)
                }
              </div>
          }
        </div>
      )
    }
    return (
      <div />
    )
  }
}

// 保险信息
const Tan = props => {
  const { handleContainerClose, data } = props
  console.log(data)
  const { detail, name } = data
  return (
    <div className='baoxianinfo'>
      <h3>{ name }</h3>
      <div className='bxif'>
        {
          detail.map(e => <p>{ e }</p>)
        }
      </div>
      <div className='closebtn'>
        <p><Icon onClick={ () => { handleContainerClose() } } type={ require('svg/jipiao/close.svg') } /></p>
      </div>
    </div>
  )
}

export default Baoxianitem
