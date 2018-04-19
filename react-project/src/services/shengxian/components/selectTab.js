
import React, { Component } from 'react'
import { Icon } from 'antd-mobile'

import '../style/selectTab.scss'

let startX
let preNode = 'undefined'
let rotate = 0
let bool = true
const dpr = document.documentElement.clientWidth / window.screen.width
export default class SelectTab extends Component {
  static defaultProps = {
  }
  constructor(props) {
    super(props)
    this.state = {
      data: this.props.data,
    }
    this.tabWarp = null
    this.tabIcon = null
    this.tabCro = null
    this.tabFoucs = null
    this.tabShade = null
    this.tabSpan = []
    this.tabSpans = []
    this.translateX = 0
    this.shadeWidth = 0
  }

  handleSelect(i, o) {
    // const endAnchor = e.offsetLeft
    if (preNode !== i) {
      if (this.props.selectSub) {
        this.props.selectSub(o, this.props.categoryIdList)
      }
      if ((rotate % 360) && (preNode !== 'undefined')) {
        this.tabShade.style.height = '0px'
        rotate += 180
        this.tabIcon.style.WebkitTransform = `rotate(${ rotate }deg)`
      } else if (typeof preNode !== 'number') {
        preNode = 0
      }
      this.tabSpan[preNode].style.color = ''
      this.tabSpans[preNode].style.color = ''
      this.tabSpan[i].style.color = '#ffab00'
      this.tabSpans[i].style.color = '#ffab00'
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

  handleSwitch() {
    // const endAnchor = e.offsetLeft
    this.tabShade.style.WebkitTransition = '.3s ease'
    if (rotate % 360) {
      this.tabShade.style.height = '0px'
    } else {
      this.tabShade.style.height = `${ this.shadeWidth }`
    }
    rotate += 180
    this.tabIcon.style.WebkitTransform = `rotate(${ rotate }deg)`
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
    const preData = this.state.data
    const { data } = nextProps
    if (preData !== data) {
      // 状态还原
      this.tabSpan[preNode].style.color = ''
      this.tabSpans[preNode].style.color = ''
      this.tabWarp.style.WebkitTransform = `translateX(${ 0 }px)`
      this.tabShade.style.height = 'auto'
      // 数据还原
      this.tabWarp = null
      this.tabIcon = null
      this.tabCro = null
      this.tabFoucs = null
      this.tabShade = null
      this.tabSpan = []
      this.tabSpans = []
      this.translateX = 0
      this.shadeWidth = 0
      preNode = 'undefined'
      rotate = 0
      bool = true
      this.setState({ data })
    }
  }

  componentWillMount() {
    // 数据还原
    this.tabWarp = null
    this.tabIcon = null
    this.tabCro = null
    this.tabFoucs = null
    this.tabShade = null
    this.tabSpan = []
    this.tabSpans = []
    this.translateX = 0
    this.shadeWidth = 0
    preNode = 'undefined'
    rotate = 0
    bool = true
  }

  render() {
    const { data } = this.state
    const { categoryIdList } = this.props
    let index = 0
    if (data) {
      for (let i = 0; i < data.length; i++) {
        if (JSON.stringify(data[i].idList) === JSON.stringify(categoryIdList)) {
          index = i
        }
      }
    }
    const dataLi = data && data.map((o, i) => <span ref={ node => { if (node) { this.tabSpan[i] = node } } } key={ `${ i + 1 }` } className='select_li' onClick={ () => this.handleSelect(i, o) }>{ o.name }</span>)
    const dataLis = data && data.map((o, i) => <span ref={ node => { if (node) { this.tabSpans[i] = node } } } key={ `s${ i + 1 }` } className='select_li' onClick={ () => this.handleSelect(i, o) }>{ o.name }</span>)
    return (
      <div className='select_tabs'>
        <span className='select_icon' ref={ node => { if (node) { this.tabIcon = node } } } onClick={ () => this.handleSwitch() }><Icon type={ require('svg/shengxian/arrow.svg') } /></span>
        <div className='select_shade' ref={ node => { if (node) { this.tabShade = node; if (parseFloat(window.getComputedStyle(node).height) > 0) { node.style.height = 'auto'; this.shadeWidth = window.getComputedStyle(node).height } node.style.height = '0px' } } }>
          <p>选择类目</p>
          <div>{ dataLis }</div>
        </div>
        <div className='select_cro' ref={ node => { if (node) { this.tabCro = node } } }>
          <p
            ref={ node => { if (node) { this.tabWarp = node } } }
            onTouchStart={ e => this.handleTouchStart(e) }
            onTouchMove={ e => this.handleTouchMove(e) }
            onTouchEnd={ e => this.handleTouchEnd(e) }
          >
            { dataLi }
            <span className='select_foucs' ref={ node => { if (node && bool) { this.tabFoucs = node; this.handleSelect(index, data[index]); bool = false } } } />
          </p>
        </div>
      </div>
    )
  }
}
