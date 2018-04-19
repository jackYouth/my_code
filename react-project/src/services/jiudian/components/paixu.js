import React, { Component } from 'react'
import closeMask from './closeMask'
import '../style/paixu.scss'

// 单个显示商家组件
class Paixu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sortArr: ['默认排序', '推荐星级由高到低', '价格由高到低', '价格由低到高', '距离由近到远'],
      realArr: ['Default', 'StarRankDesc', 'RateDesc', 'RateAsc', 'DistanceAsc'],
      Sort:    this.props.data.Sort,
    }
  }

  handleClose() {
    const { handleContainerClose } = this.props
    handleContainerClose()
    closeMask()
    // document.querySelector('.mask-container').parentNode.removeChild(document.querySelector('.mask-container'))
  }

  chooseSort(v) {
    const { handleChange } = this.props
    const { realArr = [] } = this.state
    this.setState({ curridx: v })
    handleChange(realArr[v])
    history.go(-1)
    closeMask()
    // document.querySelector('.mask-container').parentNode.removeChild(document.querySelector('.mask-container'))
  }

  render() {
    // console.log('paixu props', this.props, this.state)
    const { Sort = 'Default', sortArr = [], realArr = [] } = this.state
    let { curridx = 0 } = this.state
    realArr.forEach((i, idx) => {
      if (Sort === i) {
        curridx = idx
      }
    })

    return (
      <div className='paixu-container'>
        <div className='top-bar'>
          <span onClick={ () => this.handleClose() }>取消</span>
          <span>排序</span>
          <span onClick={ () => this.handleClose() }>确定</span>
        </div>
        <div className='sort-main'>
          {
            sortArr.map((item, index) => {
              return (
                <div className={ curridx === index ? 'sort-box choosen' : 'sort-box' } onClick={ () => this.chooseSort(index) } key={ Math.random() }>{ item }</div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

export default Paixu
