import React, { Component } from 'react'
import { getStore, removeStore, setStore } from '@boluome/common-lib'
import { Icon } from 'antd-mobile'

export default class DefaultBottom extends Component {
  constructor(props) {
    super(props)
    const channel = getStore('channel', 'session')
    const { searchHistorys } = props
    this.state = {
      channel,
      searchHistorys,
    }
  }
  handleCrossClick(e, item, index) {
    e.stopPropagation()
    const { searchHistorys } = this.state
    const { categoryLevel } = this.props
    searchHistorys.splice(index, 1)
    this.setState({ searchHistorys })
    setStore(`search_sc_${ categoryLevel }`, searchHistorys)
  }
  handleClearHistoryClick() {
    const { categoryLevel } = this.props
    this.setState({ searchHistorys: [] })
    removeStore(`search_sc_${ categoryLevel }`)
  }
  render() {
    const { handleHistoryClick } = this.props
    const { searchHistorys } = this.state
    if (!searchHistorys || searchHistorys.length === 0) {
      return <div />
    }
    return (
      <div className='search-history'>
        <div className='search-title'>搜索记录</div>
        <ul className='search-container'>
          {
            searchHistorys.map((item, index) => <li className='search-item' onClick={ () => handleHistoryClick(item) } key={ item }>{ item }<Icon onClick={ e => this.handleCrossClick(e, item, index) } type='cross' size='md' color='#999' /></li>)
          }
        </ul>
        <div className='search-footer' onClick={ () => this.handleClearHistoryClick() }>
          <Icon type={ require('svg/daojia/del.svg') } size='xs' />
          <span>清除搜索记录</span>
        </div>
      </div>
    )
  }
}
