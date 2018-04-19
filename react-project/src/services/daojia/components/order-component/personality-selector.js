import React, { Component } from 'react'
import { Popup, Icon } from 'antd-mobile'
import { contains, has } from 'ramda'


export default class PersonalitySelector extends Component {
  constructor(props) {
    super(props)
    const { title, personalityList } = this.props
    // selectStatus 表示当前选中的个性化服务对应的选中状态
    let selectStatus = personalityList.filter(ii => has(title)(ii))
    if (selectStatus.length > 0) selectStatus = selectStatus[0][title]
    this.state = {
      selectStatus,
    }
  }
  handleSelectClick(servicePersonaliseName, selectStatus) {
    if (contains(servicePersonaliseName)(selectStatus)) {
      selectStatus = selectStatus.filter(item => item !== servicePersonaliseName)
    } else {
      selectStatus.push(servicePersonaliseName)
    }

    this.setState({ selectStatus })
  }
  render() {
    const { personalityTipList, title, handleSelectConfirm, index, personalityList } = this.props
    const { selectStatus } = this.state
    return (
      <div className='personality-popup-item'>
        <div className='header'>
          { title }
          <p onClick={ () => { handleSelectConfirm(index, selectStatus, personalityList, title); Popup.hide() } }>确定</p>
        </div>
        <ul>
          {
            personalityTipList.map(o => (
              <li key={ o.servicePersonaliseTipId } onClick={ () => this.handleSelectClick(o.servicePersonaliseName, selectStatus) }>
                { o.servicePersonaliseName }
                {
                  contains(o.servicePersonaliseName)(selectStatus) ? <Icon type={ require('svg/daojia/success.svg') } size='md' /> : <span />
                }
              </li>
            ))
          }
        </ul>
      </div>
    )
  }
}
