import React from 'react'
import { Carousel, Icon } from 'antd-mobile'
import '../style/imglist.scss'

export default class ImageListMask extends React.Component {
  constructor(props) {
    super(props)
    let { defaultIndex } = props
    const { imgs } = props
    console.log('imgs', imgs)
    // isDel: 当前是删除操作
    this.state = {
      index: ++defaultIndex,
      isDel: false,
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
    const { handleContainerClose } = this.props
    const { index, imgs } = this.state
    return (
      <div className='image-wrap' onClick={ () => { handleContainerClose() } }>
        <div className='image-list' onClick={ e => { e.stopPropagation() } }>
          <p className='icon-container'><Icon onClick={ () => this.handleIconClick(index, imgs) } type={ require('svg/jipiao/delete.svg') } size='md' /></p>
          <Carousel className='img-list-carousel' selectedIndex={ index - 1 } afterChange={ a => this.handleImgCarouseChange(a + 1) }>
            {
              imgs.map(o => <div key={ o.url }><img src={ o.url } alt='img_update' /></div>)
            }
          </Carousel>
          <p className='page-index'>{ `${ index } / ${ imgs.length }` }</p>
        </div>
      </div>
    )
  }
}
