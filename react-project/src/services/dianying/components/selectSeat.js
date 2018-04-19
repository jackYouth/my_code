
import React, { Component } from 'react'

const ua = navigator.userAgent
const matches = ua.match(/Android[\S\s]+AppleWebkit\/(\d{3})/i)
const UCversion = ua.match(/U3\/((\d+|\.){5,})/i)
const isUCHd = UCversion && parseInt(UCversion[1].split('.').join(''), 10) >= 80
const isIos = navigator.appVersion.match(/(iphone|ipad|ipod)/gi)
let dpr = window.devicePixelRatio || 1
const ws = window.screen.width * dpr
if (isIos || (!(matches && matches[1] > 534) && !isUCHd)) {
  // 如果非iOS, 非Android4.3以上, 非UC内核, 就不执行高清, dpr设为1;
  dpr = 1
}
let bool = true
const pxRem = parseFloat(window.document.documentElement.style.fontSize, 10)
let startX
let startY
let secStartX
let secStartY
let startScale
let canOffset = false
export default class SelectSeat extends Component {
  static defaultProps = {
  }
  constructor(props) {
    super(props)
    this.state = {}
    this.seatContainer = null
    this.tipContainer = null
    this.translateX = 0
    this.translateY = 0
    this.scaleNumb = ((ws / (this.props.divWidth * pxRem)) > 1) ? 1 : ws / (this.props.divWidth * pxRem)
    this.scaleInitNumb = ((ws / (this.props.divWidth * pxRem)) > 1) ? 1 : ws / (this.props.divWidth * pxRem)
  }


  handleTouchStart(e) {
    // e.preventDefault()
    if (e.touches.length === 1) {
      canOffset = true
      startX = e.touches ? e.touches[0].screenX : e.screenX
      startY = e.touches ? e.touches[0].screenY : e.screenY
    } else if (e.touches.length === 2) {
      canOffset = false
      startX = e.touches ? e.touches[0].screenX : e.screenX
      startY = e.touches ? e.touches[0].screenY : e.screenY
      secStartX = e.touches ? e.touches[1].screenX : e.screenX
      secStartY = e.touches ? e.touches[1].screenY : e.screenY
      startScale = this.scaleNumb
    }
  }


  handleTouchMove(e) {
    e.preventDefault()
    const { translateX, translateY, scaleNumb } = this
    // const { divWidth, divHeight } = this.props
    // console.log(translateX, translateY, divWidth, divHeight)
    const { width, height } = window.getComputedStyle(this.seatContainer)
    // console.log(window.getComputedStyle(this.seatContainer))
    // console.log(parseFloat(width, 10) * scaleNumb, parseFloat(height, 10) * scaleNumb, translateX, translateY)
    if (e.touches.length === 1 && canOffset) {
      const movedX = e.touches ? e.touches[0].screenX : e.screenX
      const movedY = e.touches ? e.touches[0].screenY : e.screenY
      const disX = translateX + ((movedX - startX) * dpr)
      const disY = translateY + ((movedY - startY) * dpr)
      this.translateX = disX
      startX = movedX
      this.translateY = disY
      startY = movedY
    } else if (e.touches.length === 2) {
      const movedX = e.touches ? e.touches[0].screenX : e.screenX
      const movedY = e.touches ? e.touches[0].screenY : e.screenY
      const secMovedX = e.touches ? e.touches[1].screenX : e.screenX
      const secMovedY = e.touches ? e.touches[1].screenY : e.screenY
      const ss = startScale * (Math.sqrt(((secMovedX - movedX) * (secMovedX - movedX)) + ((secMovedY - movedY) * (secMovedY - movedY))) / Math.sqrt(((secStartX - startX) * (secStartX - startX)) + ((secStartY - startY) * (secStartY - startY))))
      this.scaleNumb = ss
      this.translateX = translateX * (ss - 1)
      this.translateY = translateY * (ss - 1)

      // this.seatContainer.style.WebkitTransform = `matrix(${ this.scaleNumb }, 0, 0, ${ scaleNumb }, ${ translateX }, ${ translateY })`
    }
    const realWidth = parseFloat(width, 10)
    const realHeight = parseFloat(height, 10)

    if ((((realWidth * scaleNumb) - (realWidth * this.scaleInitNumb)) / 2) < this.translateX) {
      this.translateX = ((realWidth * scaleNumb) - (realWidth * this.scaleInitNumb)) / 2
    } else if ((((realWidth * this.scaleInitNumb) - (realWidth * scaleNumb)) / 2) > this.translateX) {
      this.translateX = ((realWidth * this.scaleInitNumb) - (realWidth * scaleNumb)) / 2
    }
    if ((((realHeight * scaleNumb) - (realHeight * this.scaleInitNumb)) / 2) < this.translateY) {
      this.translateY = ((realHeight * scaleNumb) - (realHeight * this.scaleInitNumb)) / 2
    } else if ((((realHeight * this.scaleInitNumb) - (realHeight * scaleNumb)) / 2) > this.translateY) {
      this.translateY = ((realHeight * this.scaleInitNumb) - (realHeight * scaleNumb)) / 2
    }

    if (this.scaleNumb < this.scaleInitNumb) {
      this.scaleNumb = this.scaleInitNumb
    } else if (this.scaleNumb > 1) {
      this.scaleNumb = 1
    }
    this.seatContainer.style.WebkitTransform = `matrix(${ this.scaleNumb }, 0, 0, ${ this.scaleNumb }, ${ this.translateX }, ${ this.translateY })`
    this.tipContainer.style.WebkitTransform = `matrix(1, 0, 0, 1, ${ ((((this.scaleNumb - this.scaleInitNumb) * realWidth) / 2) - this.translateX) / this.scaleNumb }, 0)`
    // this.seatContainer.setAttribute('x', this.translateX)
    // this.seatContainer.setAttribute('y', this.translateY)
    // this.seatContainer.setAttribute('s', this.scaleNumb)
  }
  handleTouchEnd() {
    // e.preventDefault()
  }

  componentWillReceiveProps(nextProps) {
    if (this.scaleNumb < 1) {
      const { origin } = nextProps
      const { colRatio, rowRatio } = origin
      const { width, height } = window.getComputedStyle(this.seatContainer)
      const realWidth = parseFloat(width, 10)
      const realHeight = parseFloat(height, 10)
      this.scaleNumb = 1
      this.translateX = (realWidth * (0.5 - (colRatio / 100)))
      this.translateY = (realHeight * (0.5 - (rowRatio / 100)))
      if (((realWidth - (realWidth * this.scaleInitNumb)) / 2) < this.translateX) {
        this.translateX = (realWidth - (realWidth * this.scaleInitNumb)) / 2
      } else if ((((realWidth * this.scaleInitNumb) - realWidth) / 2) > this.translateX) {
        this.translateX = ((realWidth * this.scaleInitNumb) - realWidth) / 2
      }
      if (((realHeight - (realHeight * this.scaleInitNumb)) / 2) < this.translateY) {
        this.translateY = (realHeight - (realHeight * this.scaleInitNumb)) / 2
      } else if ((((realHeight * this.scaleInitNumb) - realHeight) / 2) > this.translateY) {
        this.translateY = ((realHeight * this.scaleInitNumb) - realHeight) / 2
      }
      this.seatContainer.style.WebkitTransformOrigin = `${ colRatio }% ${ rowRatio }%`
      this.seatContainer.style.WebkitTransition = 'transform .5s ease-in-out'
      this.seatContainer.style.WebkitTransform = `matrix(${ this.scaleNumb }, 0, 0, ${ this.scaleNumb }, ${ this.translateX }, ${ this.translateY })`
      this.seatContainer.addEventListener('transitionend', () => {
        this.seatContainer.style.WebkitTransition = ''
        this.seatContainer.style.WebkitTransformOrigin = ''
      }, false)
    }
  }
  componentWillMount() {
    bool = true
  }
  componentDidUpdate() {
    const { width } = window.getComputedStyle(this.seatContainer)
    const realWidth = parseFloat(width, 10)
    this.seatContainer.style.WebkitTransform = `matrix(${ this.scaleNumb }, 0, 0, ${ this.scaleNumb }, ${ this.translateX }, ${ this.translateY })`
    this.tipContainer.style.WebkitTransform = `matrix(1, 0, 0, 1, ${ ((((this.scaleNumb - this.scaleInitNumb) * realWidth) / 2) - this.translateX) / this.scaleNumb }, 0)`
  }

  render() {
    const { innerComponent, divWidth, divHeight, seatData } = this.props
    // const rowTip = []
    // for (let i = 0; i < seatData.length; i++) {
    //   rowTip.push(<li key={ `tipLi${ Math.random() }` }>{ i + 1 }</li>)
    // }
    const rowTip = seatData.map(o => {
      return <li key={ `tipLi${ Math.random() }` }>{ o[0].seatRow }</li>
    })
    return (
      <div style={{ width: '100%', height: 'calc(100% - 1rem)', overflow: 'hidden', position: 'relative' }} onTouchStart={ e => this.handleTouchStart(e) } onTouchMove={ e => this.handleTouchMove(e) } onTouchEnd={ e => this.handleTouchEnd(e) }
        ref={
          node => {
            if (node && bool) {
              const ht = parseInt(window.getComputedStyle(node).height, 10) - (0.7 * pxRem)
              const hts = ((ht / (divHeight * pxRem)) > 1) ? 1 : (ht / (divHeight * pxRem))
              const htsc = hts > this.scaleInitNumb ? this.scaleInitNumb : hts
              this.scaleNumb = htsc
              this.scaleInitNumb = htsc
              bool = false
            }
          }
        }
      >
        <div style={{ position: 'absolute', left: `calc(50% - ${ divWidth * pxRem * 0.5 }px)`, top: `calc(50% - ${ divHeight * pxRem * 0.5 }px)` }} ref={ node => { if (node) { this.seatContainer = node; node.style.WebkitTransform = `matrix(${ this.scaleNumb }, 0, 0, ${ this.scaleNumb }, 0, 0)` } } } >
          {
            innerComponent && React.cloneElement(innerComponent)
          }
          <ul className='rowTip' ref={ node => { if (node) { this.tipContainer = node } } }>{ rowTip }</ul>
        </div>
      </div>
    )
  }
}
