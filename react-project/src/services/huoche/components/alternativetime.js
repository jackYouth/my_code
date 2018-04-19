import React from 'react'
import { List, Icon } from 'antd-mobile'
import { Mask } from '@boluome/oto_saas_web_app_component'
import { setStore } from '@boluome/common-lib'

import '../style/alternative.scss'
import choose from '../img/choose.svg'
import noChoose from '../img/nokong.svg'

const Item = List.Item
// const Brief = Item.Brief

class AlternativeTime extends React.Component {
  constructor(props) {
    super(props)
    // const { chooseTime } = props
    // const chooseArr = []
    // chooseArr[0] = chooseTime
    this.state = {
      ...props,
      // chooseArr,
    }
    this.handleAlterTime = this.handleAlterTime.bind(this)
    this.handleChoosetime = this.handleChoosetime.bind(this)
  }
  componentWillUnmount() {
    // Popup.hide()
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps,
    })
  }
  // 取消选择被选坐席
  handleClose() {
    Mask.closeAll()
    location.hash = ''
  }
  // 点击确认将选中的坐席传入到父组件
  handleOkchoose() {
    const { chooseArrtime } = this.state
    const { handleChooseArr } = this.props
    const alterTime = []
    setStore('huoche_chooseArrtime', chooseArrtime, 'session')
    for (let i = 0; i < chooseArrtime.length; i++) {
      alterTime.push(chooseArrtime[i].dateShow)
    }
    handleChooseArr(alterTime)
    console.log('-----eee---', alterTime)
    setStore('huoche_alterTime', alterTime, 'session')
    Mask.closeAll()
    location.hash = ''
  }
  handleChoosetime(time) {
    const { chooseTime } = this.state
    // console.log('test----', time, chooseTime)
    if (time.datestr === chooseTime.datestr) {
      console.log('这是指定日期')
    } else {
      this.setState({
        chooseArrtime: this.handleAlterTime(time),
      })
    }
  }
  // 处理要选择的备选日期
  handleAlterTime(res) {
    const { chooseArrtime } = this.state
    const arr = chooseArrtime.filter(item => item.datestr === res.datestr)
    if (arr.length > 0) {
      for (let i = 0; i < chooseArrtime.length; i++) {
        if (chooseArrtime[i].datestr === arr[0].datestr) {
          chooseArrtime.splice(i, 1)
        }
      }
    } else {
      chooseArrtime.push(res)
    }
    return chooseArrtime
  }
  render() {
    const { timearr, chooseArrtime, handleContainerClose } = this.state
    return (
      <div className='alternativeWrap'>
        <div className='title'><span onClick={ () => { this.handleClose(); handleContainerClose() } }>取消</span><span>选择备选日期</span><span onClick={ () => { this.handleOkchoose(); handleContainerClose() } }>确定</span></div>
        <p>温馨提示：多选几个日期，抢票成功的记录会更高！</p>
        <div className='main'>
          {
            timearr.map(item => (
              <ShowItem key={ item.datestr } data={ item } handleChoosetime={ this.handleChoosetime } chooseArrtime={ chooseArrtime } />
            ))
          }
        </div>
      </div>
    )
  }
}

const ShowItem = ({ data, handleChoosetime, chooseArrtime }) => {
  const { dateShow, weed, datestr } = data
  // console.log(noChoose, choose, data)
  return (
    <List>
      <Item onClick={ () => handleChoosetime(data) }
        extra={ <Icon type={ `${ chooseArrtime.filter(i => { return i.datestr === datestr }).length > 0 ? choose : noChoose }` } /> }
      >
        { dateShow }
        <span className='time'>{ weed }</span>
      </Item>
    </List>
  )
}
export default AlternativeTime
