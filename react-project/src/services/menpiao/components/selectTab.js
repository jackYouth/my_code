
import React, { Component } from 'react'
import { Icon } from 'antd-mobile'

import '../style/selectTab.scss'

export default class SelectTab extends Component {
  static defaultProps = {
  }
  constructor(props) {
    super(props)
    this.state = {
      filtering: this.props.filtering,
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    // 重置
    const preData = this.state.filtering
    const { filtering } = nextProps
    if (preData !== filtering) this.setState({ filtering })
  }

  componentWillMount() {
    // 数据还原
  }

  handleSelect(filtered, filtering, o) {
    let { categoryCode, sort, timeRange } = filtered // wei
    // console.log('ladaoba==========》', categoryCode, sort, timeRange, o, filtering)
    const { handleSelct } = this.props
    filtered[filtering] = o.code
    if (categoryCode === 0) {
      categoryCode = '全部分类'
    } else if (sort === 0) {
      sort = ''
    } else if (timeRange === 0) {
      timeRange = 'Default'
    }
    // console.log('log in handleSelct------->', filtered, sort, timeRange, categoryCode)
    handleSelct(filtered.sort, filtered.timeRange, filtered.categoryCode) // dang
  }

  render() {
    const { themeDatas, filtered, handlePush } = this.props
    console.log('log in render filtered', filtered)
    const { filtering } = this.state

    const dataLi = themeDatas
                  && filtering
                  && themeDatas[filtering].map(o => {
                    return (
                      <p key={ `${ o.text }${ o.code }` }
                        className='select_li'
                        style={ o.code === filtered[filtering] ? { color: '#ffab00' } : {} }
                        onClick={ () => this.handleSelect(filtered, filtering, o) }
                      >
                        { o.text }
                        { o.code === filtered[filtering] && <Icon type={ require('../img/selected.svg') } /> }
                      </p>
                    )
                  })
    if (filtering) {
      return (
        <div className='select_shade' onClick={ () => handlePush(filtering, filtering) }>
          <div className='select_wrap' style={ dataLi && dataLi.length > 6 ? { height: '50%', overflowY: 'scroll' } : { height: 'auto' } }>
            { dataLi }
          </div>
        </div>
      )
    }
    return <div />
  }
}
