/*
  props:
    currentImgUrl: 当前点击的图片所在索引
    imgs:          [{ url: , text: }], 图片列表
*/

import React from 'react'
import { Carousel, Icon } from 'antd-mobile'

import './index.scss'

export default class ImageListMask extends React.Component {
  constructor(props) {
    super(props)
    const { currentImgUrl } = props
    const { imgs } = props
    let index = 1
    imgs.forEach((o, i) => {
      if (o.url === currentImgUrl) {
        index += i
      }
    })
    // isDel: 当前是删除操作
    this.state = {
      isDel: false,
      index,
      imgs,
    }
  }
  handleImgCarouseChange(index) {
    const { isDel } = this.state
    if (isDel) {
      this.setState({ isDel: false })
      return
    }
    this.setState({ index })
  }
  handleIconClick(index, imgs) {
    const { handleIconClick, handleContainerClose } = this.props
    index--
    imgs.splice(index, 1)
    if (index < 1) index = 1
    this.setState({ imgs, index, isDel: true })
    if (imgs.length === 0) handleContainerClose()
    handleIconClick(imgs)
  }
  render() {
    const { handleIconClick } = this.props
    const { index, imgs } = this.state
    const currentIndex = index - 1
    return (
      <div className='image-list'>
        {
          handleIconClick &&
          <p className='icon-container'><Icon onClick={ () => this.handleIconClick(index, imgs) } type={ require('svg/shangcheng/del.svg') } size='md' /></p>
        }
        <Carousel className='img-list-carousel' selectedIndex={ currentIndex } afterChange={ a => this.handleImgCarouseChange(a + 1) }>
          {
            imgs.map(o => <div key={ o.url }><img src={ o.url } alt='img_update' /></div>)
          }
        </Carousel>
        <p className='page-index'>
          <span>{ imgs[currentIndex].text }</span>
          <span>{ `${ index } / ${ imgs.length }` }</span>
        </p>
      </div>
    )
  }
}
