
import React, { Component } from 'react'
// import { Icon } from 'antd-mobile'

import '../style/slideTab.scss'

let startX
let preNode = 'undefined'
let bool = true
const dpr = document.documentElement.clientWidth / window.screen.width
export default class SlideTab extends Component {
  static defaultProps = {
  }
  constructor(props) {
    super(props)
    this.state = {
      dataList: this.props.dataList,
    }
    this.tabWarp = null
    this.tabCro = null
    this.tabFoucs = null
    this.tabSpan = []
    this.translateX = 0
  }

  handleSelect(i, o) {
    // const endAnchor = e.offsetLeft
    if (preNode !== i) {
      if (preNode === 'undefined') {
        preNode = 0
      }
      if (this.props.selectSub) {
        this.props.selectSub(o, this.props.dataList)
      }
      this.tabSpan[preNode].style.color = ''
      this.tabSpan[i].style.color = '#333333'
      this.tabFoucs.style.borderTop = '0.04rem solid #ffab00'
      this.tabFoucs.style.width = this.tabSpan[i].offsetWidth
      this.tabFoucs.style.WebkitTransform = `translateX(${ this.tabSpan[i].offsetLeft }px)`
      if (this.tabWarp) {
        let disX = (this.tabSpan[i].offsetLeft * (-1)) + 150
        const warpWidth = parseFloat(window.getComputedStyle(this.tabWarp).width, 10) - parseFloat(window.getComputedStyle(this.tabCro).width, 10)
        if (disX < (warpWidth * (-1))) {
          disX = warpWidth * (-1)
        }
        if (disX > 0) {
          disX = 0
        }
        this.translateX = disX
        this.tabWarp.style.WebkitTransition = '.3s ease'
        this.tabWarp.style.WebkitTransform = `translateX(${ this.translateX }px)`
      }
      preNode = i
    }
  }


  handleTouchStart(e) {
    // e.preventDefault()
    this.tabWarp.style.WebkitTransition = ''
    startX = e.touches ? e.touches[0].screenX : e.screenX
  }


  handleTouchMove(e) {
    // e.preventDefault()
    const { translateX } = this
    const warpWidth = parseFloat(window.getComputedStyle(this.tabWarp).width, 10) - parseFloat(window.getComputedStyle(this.tabCro).width, 10)
    const movedX = e.touches ? e.touches[0].screenX : e.screenX
    let disX = translateX + ((movedX - startX) * dpr)

    if (disX > 0) {
      disX = 0
    }
    if (disX < (warpWidth * (-1))) {
      disX = warpWidth * (-1)
    }
    if (warpWidth < 0) {
      disX = 0
    }
    this.translateX = disX
    startX = movedX
    this.tabWarp.style.WebkitTransform = `translateX(${ this.translateX }px)`
  }
  handleTouchEnd() {
    // e.preventDefault()
  }

  componentWillReceiveProps(nextProps) {
    // 重置
    const preData = this.state.dataList
    const { dataList } = nextProps
    if (preData !== dataList) {
      // 状态还原
      this.tabSpan[preNode].style.color = ''
      this.tabWarp.style.WebkitTransform = `translateX(${ 0 }px)`
      // 数据还原
      this.tabWarp = null
      this.tabCro = null
      this.tabFoucs = null
      this.tabSpan = []
      this.translateX = 0
      preNode = 'undefined'
      bool = true
      this.setState({ dataList })
    }
  }

  componentWillMount() {
    // 数据还原
    this.tabWarp = null
    this.tabCro = null
    this.tabFoucs = null
    this.tabSpan = []
    this.translateX = 0
    preNode = 'undefined'
    bool = true
  }

  render() {
    const { dataList } = this.state
    const { data } = this.props
    let index = 0
    if (dataList) {
      for (let i = 0; i < dataList.length; i++) {
        if (data && (dataList[i].id === data.id)) {
          index = i
        }
      }
    }
    const dataLi = dataList && dataList.map((o, i) => <span ref={ node => { if (node) { this.tabSpan[i] = node } } } key={ `${ i + 1 }` } className='select_li' onClick={ () => this.handleSelect(i, o) }>{ o.eventDate }<br />{ o.eventWeekday }</span>)
    return (
      <div className='select_tabs'>
        <div className='select_cro' ref={ node => { if (node) { this.tabCro = node } } }>
          <p
            ref={ node => { if (node) { this.tabWarp = node } } }
            onTouchStart={ e => this.handleTouchStart(e) }
            onTouchMove={ e => this.handleTouchMove(e) }
            onTouchEnd={ e => this.handleTouchEnd(e) }
          >
            { dataLi }
            <span className='select_foucs' ref={ node => { if (node && bool) { this.tabFoucs = node; this.handleSelect(index, dataList[index]); bool = false } } } />
          </p>
        </div>
      </div>
    )
  }
}
