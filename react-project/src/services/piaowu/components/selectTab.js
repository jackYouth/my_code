
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
    const { cityArr, categoryArr, cityName, handleSelct } = this.props
    filtered[filtering] = o.code
    handleSelct(cityArr, categoryArr, cityName, filtered)
  }

  render() {
    const { filterdata, filtered, handlePush } = this.props
    const { filtering } = this.state
    const dataLi = filterdata
                  && filtering
                  && filterdata[filtering].map(o => {
                    return (
                      <p key={ `${ o.text }${ o.code }` }
                        className='select_li'
                        style={ o.code === filtered[filtering] ? { color: '#ffab00' } : {} }
                        onClick={ () => this.handleSelect(filtered, filtering, o) }
                      >
                        { o.text }
                        { o.code === filtered[filtering] && <Icon type={ require('svg/piaowu/selected.svg') } /> }
                      </p>
                    )
                  })
    if (filtering) {
      return (
        <div className='select_shade' onClick={ () => handlePush(filtering, filtering) }>
          <div className='select_wrap'>
            { dataLi }
          </div>
        </div>
      )
    }
    return <div />
  }
}
