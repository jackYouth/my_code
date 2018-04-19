import React from 'react'
import { InputItem, WhiteSpace, Toast } from 'antd-mobile'
import { getStore, setStore } from '@boluome/common-lib'
import Button from './Button'


class EditHome extends React.Component {
  constructor(props) {
    super(props)
    this.state = { changedHome: props.currentHomeTag }
    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.onClose = this.onClose.bind(this)
  }
  handleChange(changedHome) {
    this.setState({ changedHome })
  }

  handleClick() {
    const { changedHome } = this.state
    const { currentHomeTag } = this.props
    //  设置一个开关，判断当前的tag是否在已有的tag中
    let homes = getStore('homes', 'session') ? getStore('homes', 'session').homes : []
    let inHomes = false
    homes = homes.map(item => {
      if (item.tag === changedHome) {
        inHomes = true
      } else if (item.tag === currentHomeTag) {
        item.tag = changedHome
      }
      return item
    })
    //  如果当前的tag是已存在的，就弹出已存在，不改变添加操作
    if (inHomes) {
      Toast.fail('已存在此家庭名称，请重新修改', 1)
    } else {
      const { handleNewEdit, currentBillInfo } = this.props
      const { address, cityId, cityName, tid } = currentBillInfo
      const editParas = {
        address,
        cityId,
        cityName,
        tid,
        tag: changedHome,
      }
      setStore('homes', { homes }, 'session')
      handleNewEdit(editParas)
    }
  }

  onClose = key => () => {
    this.setState({
      [key]: false,
    })
  }

  render() {
    const { currentHomeTag } = this.props
    const { changedHome } = this.state
    return (
      <div>
        <InputItem defaultValue={ currentHomeTag } onChange={ this.handleChange } >家庭</InputItem>
        <WhiteSpace size='lg' />
        <Button title='保存' btnStyle={ changedHome === currentHomeTag ? { background: '#cccccc' } : { } } handleClick={ () => changedHome !== currentHomeTag && this.handleClick() } />
      </div>
    )
  }
}

export default EditHome
