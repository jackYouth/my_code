import React from 'react'
import { Icon, Toast } from 'antd-mobile'
import { Mask, Loading } from '@boluome/oto_saas_web_app_component'
import { setStore, getStore } from '@boluome/common-lib'
import { get } from 'business'

import '../style/SelectTrain.scss'

import line from '../img/line.png'
import notrain from '../img/notrain.png'
import choosepng from '../img/choose.svg'
import noChoose from '../img/nokong.svg'

// const Item = List.Item
// const Brief = Item.Brief

class SelectTrain extends React.Component {
  constructor(props) {
    super(props)
    console.log('AlternativeTime---', ...props)
    this.state = {
      ...props,
      selectData: [],
      nolist:     false,
      choose:     JSON.parse(JSON.stringify(this.props.chooseTrain)),
    }
    this.handleSelectData()
    this.handleChooseTrain = this.handleChooseTrain.bind(this)
  }
  componentWillUnmount() {
    // Popup.hide()
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps,
    })
  }
  // 获取筛选的备选数据
  handleSelectData() {
    const handleClose = Loading()
    const schedulesUrl = '/huoche/v1/schedules'
    const channel = getStore('huoche_channel', 'session')
    const { date } = this.state.chooseTime
    const { from, to } = this.state.chooseCity
    let type = ''
    if (channel && channel === 'tongcheng') {
      type = 'ROBTICKETS'
    }
    const sendData = {
      from,
      to,
      date,
      channel,
      isFilter: true,
      type,
    }
    get(schedulesUrl, sendData).then(reply => {
      const { code, data, message } = reply
      if (code === 0) {
        let nolist = false
        if (data.list.length === 0) {
          nolist = true
        }
        this.setState({
          selectData: data.list,
          nolist,
        })
        console.log('handleSelectData---', data)
      } else {
        console.log('getStationsFn---', message)
      }
      handleClose()
    })
  }
  // 取消选择被选坐席
  handleClose() {
    Mask.closeAll()
    location.hash = ''
  }
  // 点击确认将选中的坐席传入到父组件
  handleOkchoose() {
    Mask.closeAll()
    location.hash = ''
  }
  // 去票的详情页面
  goDetails(res) {
    console.log(res)
  }
  // 选择此为备选车次
  handleChooseTrain(res) {
    const { choose } = this.state
    const len = choose.length
    const arr = choose.filter(item => item.no === res.no)
    if (arr.length > 0) {
      for (let i = 0; i < choose.length; i++) {
        // console.log('test-for', chooseTrain[i].no, '----', arr[0].no)
        if (choose[i].no === arr[0].no) {
          choose.splice(i, 1)
        }
      }
    } else if (len >= 11) {
      Toast.info('最多可备选11个车次哦～', 2, null, false)
    } else {
      choose.push(res)
    }
    console.log('test---', choose)
    this.setState({
      choose,
    })
    // this.handleChooseData()
  }
  // 确定后，将备选车次传入上一页
  handleChooseData() {
    const { choose } = this.state
    const { handleGetchooseTrain } = this.props
    const res = choose
    const arr = []
    let c = []
    const zuo = []
    let startTime = ''
    let chearhaveChooseZuo = false
    if (res.length > 0) {
      // 获取车次
      res.map(i => arr.push({ number: i.number, no: i.no }))
      // 获取坐席
      res.map(o => c = c.concat(o.seats))
      for (let e = 0; e < c.length; e++) {
        console.log(c[e])
        if (zuo.length > 0) {
          this.handleZuowei(c[e], zuo)
          // console.log('---zuo---', zuo)
        } else {
          zuo.push(c[e])
        }
      }
      // console.log('---zuo1111---', zuo)
      startTime = this.handleEndstartTime(choose)
      // console.log('---c--', res, 'zuo---', zuo, '-chooseTrain--', chooseTrain, 'startTime--', startTime)
    } else {
      setStore('huoche_chooseZuowei', [], 'session')
      setStore('huoche_haveChooseZuo', [], 'session')
      chearhaveChooseZuo = true
      // console.log('--test---11--', zuo, '----', chooseTrain, '----', arr, '---', startTime)
    }
    setStore('huoche_chooseZuowei', zuo, 'session')
    setStore('huoche_chooseTrain', choose, 'session')
    setStore('huoche_chooseSeat', arr, 'session')
    setStore('huoche_startTime', startTime, 'session')
    handleGetchooseTrain(zuo, choose, arr, startTime, chearhaveChooseZuo)
    history.go(-1)
    // Mask.closeAll()
    // location.hash = ''
  }
  handleZuowei(data, zuo) {
    const a = zuo.filter(z => { return z.name === data.name })
    if (a.length === 0) {
      zuo.push(data)
    }
    return zuo
  }
  // 比较备选车次的最晚发车时间
  handleEndstartTime(chooseTrain) {
    let startTime = ''
    if (chooseTrain.length > 0) {
      startTime = chooseTrain.reduce((i, cur) => {
        // 当前数据对象
        // const c = cur.startTime.split(':').join('') * 1
        if (cur.startTime.replace(':', '') * 1 > i.startTime.replace(':', '') * 1) {
          return cur
        }
        return i
      }, chooseTrain[0])
    }
    return startTime
  }
  render() {
    const { selectData, votesORprice = [], choose, details = '', nolist } = this.state
    if (selectData && selectData.length > 0) {
      return (
        <div className='SelectListWrap'>
          <p className='tips'>温馨提示：多选几个车次，抢票成功率会更高！</p>
          <div className='selectList'>
            {
              selectData.map(o => (
                <ItemCom key={ o.no }
                  item={ o }
                  votesORprice={ votesORprice }
                  handleChooseTrain={ this.handleChooseTrain }
                  chooseTrain={ choose }
                  details={ details }
                />
              ))
            }
          </div>
          <div className='Okbtn' onClick={ () => this.handleChooseData() }>确定</div>
        </div>
      )
    }
    return (
      <div className='SelectListWrap'>
        {
          nolist ? (<div className='nolist'>
            <img src={ notrain } alt='' />
            <p>没有符合条件的车次，请更改条件之后重新搜索</p>
          </div>) : ('')
        }
      </div>
    )
  }
}

export default SelectTrain

const ItemCom = ({ item, votesORprice, handleChooseTrain, chooseTrain, details }) => {
  const { no, from, startTime, number, duration, to, endTime, price, seats } = item
  // console.log(votesORprice, chooseTrain, seats)
  if (details && details.no === no) {
    return (<div />)
  }
  return (
    <div className='listItem' onClick={ () => { if (no) handleChooseTrain(item) } }>
      <div className='item_t'>
        <div className='startTime'>
          <span className='addressSpan'>{ from }</span>
          <span className='timeSpan'>{ startTime }</span>
        </div>
        <div className='decTime'>
          <span>{ number }</span>
          <span><img src={ line } alt='---' /></span>
          <span>{ `${ Math.floor(duration / 60) }时${ Math.floor(duration % 60) }分` }</span>
        </div>
        <div className='endTime'>
          <span className='addressSpan'>{ to }</span>
          <span className='timeSpan'>{ endTime }</span>
        </div>
        <div className='price'>
          <span className='priceSpan'><i className='ii'>¥</i>{ price }<i>起</i></span>
        </div>
      </div>
      <ItemTrick
        seats={ seats }
        votesORprice={ votesORprice }
        item={ item }
        chooseTrain={ chooseTrain }
      />
    </div>
  )
}

// 列车座位
const ItemTrick = ({ seats, votesORprice, item, chooseTrain }) => {
  return (
    <div className='item_b'>
      <div className='item_bchild'>
        {
          seats.map(i => (
            <span key={ i.name + i.price }>{ i.name }: { votesORprice === 'price' ? `¥${ i.price }` : `${ i.yupiao }张` }</span>
          ))
        }
      </div>
      <Icon type={ chooseTrain.filter(o => o.no === item.no)[0] ? choosepng : noChoose } />
    </div>
  )
}
