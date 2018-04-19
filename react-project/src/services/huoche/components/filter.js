import React from 'react'
import { List, Icon } from 'antd-mobile'
import { Mask } from '@boluome/oto_saas_web_app_component'

import '../style/filter.scss'
import deletes from '../img/deletes.svg'

const Item = List.Item
class FilterCom extends React.Component {
  constructor(props) {
    super(props)
    // const newState = merge(state)(props)
    this.state = {
      ...props,
      clear: false,
    }
    console.log('FilterCom----', props)
    this.handleSumFilter = this.handleSumFilter.bind(this)
    this.handleSumFilterOne = this.handleSumFilterOne.bind(this)
    this.handleFilter = this.handleFilter.bind(this)
    this.handleAllResults = this.handleAllResults.bind(this)
  }
  componentWillUnmount() {
    // Popup.hide()
  }
  componentDidMount() {
    const { filterFn } = this.props
    const { filiterObj, scheduleslist } = this.state
    filterFn(this.handleFilter, filiterObj)
    console.log('testeee', filterFn, scheduleslist)
    // this.handleFilter(filiterObj, scheduleslist)
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps,
    })
  }
  // 清空筛选条件---注意渲染清空和数据清空
  handleClear() {
    console.log('qingkong')
    const { defiliterObj } = this.props
    // console.log('--测试数据---', defiliterObj)
    this.setState({
      filiterObj: JSON.parse(JSON.stringify(defiliterObj)),
      clear:      true,
    })
  }
  // 按照条件筛选之车次类型
  handleFilter(filiterObj, scheduleslist) {
    const { handleContainerClose } = this.state
    const { trainline } = filiterObj
    const line = []
    for (let i = 0; i < trainline.length; i++) {
      if (trainline[i].choose === true) {
        line.push(trainline[i].name)
      }
    }
    if (line.length <= 0) {
      this.handlefromArr(filiterObj, scheduleslist)
      return
    }
    const Standard = line.join('') // JSON.stringify(line)
    const filter1 = this.handleSumFilterOne(Standard, scheduleslist, 'number')
    this.handlefromArr(filiterObj, filter1)
    handleContainerClose()
    Mask.closeAll()
    location.hash = ''
    const node = document.getElementsByClassName('mask-container')
    if (node.length > 0) {
      node[0].remove()
    }
  }
  // 在总的里面筛选
  handleSumFilterOne(Standard, data, codeStr) {
    // console.log('stan---', data, Standard)
    const dataFilter = []
    for (let s = 0; s < data.length; s++) {
      if (Standard.indexOf(data[s][codeStr].split('')[0]) === -1) { // 这就是没有匹配的
        console.log('没有我')
      } else {
        dataFilter.push(data[s])
      }
    }
    return dataFilter
  }
  // 按照条件筛选之出发地点
  handlefromArr(filiterObj, filter1) {
    const { fromArr } = filiterObj
    const froms = []
    for (let j = 0; j < fromArr.length; j++) {
      if (fromArr[j].choose === true) {
        froms.push(fromArr[j].name)
      }
    }
    if (froms.length <= 0) {
      this.handletoArr(filiterObj, filter1)
      return
    }
    const Standard = froms // .join('')
    const filter2 = this.handleSumFilter(Standard, filter1, 'from')
    // console.log('from----', filter2)
    this.handletoArr(filiterObj, filter2)
  }
  // 按照条件筛选之到达地点
  handletoArr(filiterObj, filter2) {
    const { toArr } = filiterObj
    const tos = []
    for (let j = 0; j < toArr.length; j++) {
      if (toArr[j].choose === true) {
        tos.push(toArr[j].name)
      }
    }
    if (tos.length <= 0) {
      this.handleFromTime(filiterObj, filter2)
      return
    }
    const Standard = tos // .join('')
    const filter3 = this.handleSumFilter(Standard, filter2, 'to')
    console.log('to----', filter3)
    this.handleFromTime(filiterObj, filter3)
  }
  // 处理车站的筛选---始末
  handleSumFilter(Standard, data, codeStr) {
    console.log('stan---', data, Standard)
    const dataFilter = []
    for (let s = 0; s < data.length; s++) {
      for (let g = 0; g < Standard.length; g++) {
        if (data[s][codeStr] === Standard[g]) {
          console.log('bbbb--', Standard[g])
          dataFilter.push(data[s])
          break
        } else {
          console.log('没有我', Standard[g])
        }
      }
    }
    // console.log('aaa---', dataFilter)
    return dataFilter
  }
  // 按照条件筛选之出发时间
  handleFromTime(filiterObj, filter3) {
    const { fromTime } = filiterObj
    const time = []
    for (let s = 0; s < fromTime.length; s++) {
      if (fromTime[s].choose === true) {
        time.push(fromTime[s].name)
      }
    }
    if (time.length <= 0) {
      this.handleToTime(filiterObj, filter3)
      return
    }
    const filter4 = this.handleFromToTime(time, filter3, 'startTime')
    this.handleToTime(filiterObj, filter4)
    // console.log(filter3)
  }
  // 按照条件筛选之到达时间
  handleToTime(filiterObj, filter4) {
    const { toTime } = filiterObj
    const time = []
    for (let s = 0; s < toTime.length; s++) {
      if (toTime[s].choose === true) {
        time.push(toTime[s].name)
      }
    }
    if (time.length <= 0) {
      this.handleAllResults(filiterObj, filter4)
      console.log('最总筛选结果-kong--', filter4)
      return
    }
    const filter5 = this.handleFromToTime(time, filter4, 'endTime')
    console.log('最总筛选结果---', filter5)
    this.handleAllResults(filiterObj, filter5)
  }
  // 处理筛选的始末时间
  handleFromToTime(Standard, data, codeStr) {
    console.log(Standard, data, codeStr)
    const timeFilter = []
    for (let y = 0; y < data.length; y++) {
      const timestr = parseInt(data[y][codeStr].replace(':', ''), 10)
      for (let x = 0; x < Standard.length; x++) {
        const timearr = Standard[x].split('-')
        const pro = parseInt(timearr[0].replace(':', ''), 10)
        const next = parseInt(timearr[1].replace(':', ''), 10)
        if (timestr > pro && timestr < next) {
          timeFilter.push(data[y])
          break
        }
      }
    }
    // console.log('timeFilter---', timeFilter)
    return timeFilter
  }
  // 当所有的条件都筛选完了，---注意是否有时长和早到晚的排序
  handleAllResults(filiterObj, filter5) {
    const { handleContainerClose } = this.state
    Mask.closeAll()
    location.hash = ''
    handleContainerClose()
    const { handleFilterResult } = this.props
    const { defiliterObj } = this.state
    handleFilterResult(filiterObj, filter5, defiliterObj)
  }
  // 总汇每个筛选条件的方法
  handleSumChange(i, arr) {
    const { filiterObj } = this.state
    arr[i].choose = !arr[i].choose
    filiterObj[arr] = arr
    this.setState({
      filiterObj,
      clear: false,
    })
  }

  render() {
    const { filiterObj, defiliterObj, scheduleslist, clear, handleContainerClose } = this.state
    // console.log('defiliterObj---', defiliterObj, '--filiterObj--', filiterObj)
    if (filiterObj && filiterObj.trainline) {
      const { trainline = [], fromTime = [], toTime = [], fromArr = [], toArr = [] } = filiterObj
      return (
        <div className='filterWrap'>
          <Item className='filterItem'>
            <span onClick={ () => { Mask.closeAll(); location.hash = ''; handleContainerClose() } }>取消</span>
            <span className='EmptySpan' onClick={ () => { this.handleClear() } }><Icon type={ deletes } /><span className='clearS'>清空已选</span></span>
            {
              clear ? <span className='lastSpan' onClick={ () => this.handleFilter(defiliterObj, scheduleslist) }>确定</span> :
              <span className='lastSpan' onClick={ () => this.handleFilter(filiterObj, scheduleslist) }>确定</span>
            }
          </Item>
          <div className='filterMain'>

            <h4>车次类型</h4>
            {
              trainline.map((e, i) => <p className={ e.choose && 'choose' } onClick={ () => { this.handleSumChange(i, trainline) } } key={ e.name }><span><Icon type={ e.choose ? require('svg/jipiao/choose.svg') : '' } /></span>{ e.name }</p>)
            }
            <h4>出发时间</h4>
            {
              fromTime.map((e, i) => <p className={ e.choose && 'choose' } onClick={ () => { this.handleSumChange(i, fromTime) } } key={ e.name }><span><Icon type={ e.choose ? require('svg/jipiao/choose.svg') : '' } /></span>{ e.name }</p>)
            }
            <h4>到达时间</h4>
            {
              toTime.map((e, i) => <p className={ e.choose && 'choose' } onClick={ () => { this.handleSumChange(i, toTime) } } key={ e.name }><span><Icon type={ e.choose ? require('svg/jipiao/choose.svg') : '' } /></span>{ e.name }</p>)
            }
            <h4>出发车站</h4>
            {
              fromArr.map((e, i) => <p className={ e.choose && 'choose' } onClick={ () => { this.handleSumChange(i, fromArr) } } key={ e.name }><span><Icon type={ e.choose ? require('svg/jipiao/choose.svg') : '' } /></span>{ e.name }</p>)
            }
            <h4>到达车站</h4>
            {
              toArr.map((e, i) => <p className={ e.choose && 'choose' } onClick={ () => { this.handleSumChange(i, toArr) } } key={ e.name }><span><Icon type={ e.choose ? require('svg/jipiao/choose.svg') : '' } /></span>{ e.name }</p>)
            }
          </div>
        </div>
      )
    }
    return (<div />)
  }
}

export default FilterCom
