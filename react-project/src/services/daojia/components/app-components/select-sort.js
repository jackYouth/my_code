import React from 'react'
import { Icon } from 'antd-mobile'

export default class SelectSort extends React.Component {
  constructor(props) {
    super(props)
    const { currentSort } = props
    this.state = { currentSort }
  }
  handleClick(currentSort) {
    const { handleSortItemClick, handleContainerClose } = this.props
    this.setState({ currentSort })
    handleSortItemClick(currentSort)
    handleContainerClose()
  }
  render() {
    const { serverSorts } = this.props
    const { currentSort } = this.state
    return (
      <ul className='dj-select-sort'>
        {
          serverSorts.map(item => (
            <li className={ currentSort.id === item.id ? 'active' : '' } key={ item.id } onClick={ () => this.handleClick(item) }>
              <span>{ item.name }</span>
              {
                currentSort.id === item.id && <Icon type={ require('svg/daojia/selected.svg') } size='md' />
              }
            </li>
          ))
        }
      </ul>
    )
  }
}
