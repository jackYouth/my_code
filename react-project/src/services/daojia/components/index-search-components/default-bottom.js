import React, { Component } from 'react'
import { getStore, removeStore, setStore } from '@boluome/common-lib'
import { Icon } from 'antd-mobile'

export default class DefaultBottom extends Component {
  constructor(props) {
    super(props)
    const industryCode = getStore('industryCode', 'session')
    const searchHistorys = getStore(`${ industryCode }_searchHistorys`)
    this.state = {
      industryCode,
      searchHistorys,
    }
  }
  handleCrossClick(e, item, index) {
    e.stopPropagation()
    const { industryCode, searchHistorys } = this.state
    searchHistorys.splice(index, 1)
    this.setState({ searchHistorys })
    setStore(`${ industryCode }_searchHistorys`, searchHistorys)
  }
  handleClearHistoryClick() {
    const { industryCode } = this.state
    this.setState({ searchHistorys: [] })
    removeStore(`${ industryCode }_searchHistorys`)
  }
  render() {
    const { handleHistoryClick } = this.props
    const { searchHistorys } = this.state
    if (!searchHistorys || searchHistorys.length === 0) {
      return <div />
    }
    return (
      <ul className='search-history'>
        <li className='title'>搜索记录</li>
        {
          searchHistorys.map((item, index) => <li onClick={ () => handleHistoryClick(item) } key={ item }>{ item }<Icon onClick={ e => this.handleCrossClick(e, item, index) } type='cross' size='md' color='#999' /></li>)
        }
        <div className='footer' onClick={ () => this.handleClearHistoryClick() }>
          <Icon type={ require('svg/daojia/del.svg') } size='xs' />
          <span>清除搜索记录</span>
        </div>
      </ul>
    )
  }
}
