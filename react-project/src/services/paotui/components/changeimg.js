import React from 'react'
import { ImagePicker, Icon } from 'antd-mobile'
import { Mask } from '@boluome/oto_saas_web_app_component'
import { setStore } from '@boluome/common-lib'
// import { send } from 'business'

import '../style/textarea.scss'
import close from '../img/close.svg'
import deleteIcon from '../img/delete.svg'

class ChangeImg extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ...props,
    }
    console.log('ChangeImg', props)
    this.handleFireImg = this.handleFireImg.bind(this)
    this.handleImgshow = this.handleImgshow.bind(this)
    this.handleResectImg = this.handleResectImg.bind(this)
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps,
    })
  }
  handleImgshow(v, o, i) {
    console.log('ll', v, o, i)
    this.setState({
      files: [v[v.length - 1]],
    })
  }
  handleCloseMask() {
    Mask.closeAll()
  }
  handleFireImg() {
    const { onChange } = this.props
    onChange([])
    Mask.closeAll()
    this.setState({
      files: [],
    })
    setStore('paotui_photoUrl', '', 'session')
  }
  handleOk(files) {
    const { onChange } = this.props
    console.log('handleOk---', files)
    onChange(files)
    this.setState({
      files,
    })
    setStore('paotui_imgSrc', files, 'session')
    Mask.closeAll()
  }
  // 以下这段代码  我也不知道有什么用
  handleResectImg(i, o) {
    console.log(i, o)
    this.setState({
      imgSrc: o,
    })
    const { onChange } = this.props
    onChange(o)
    Mask.closeAll()
  }
  render() {
    const { files } = this.state
    const imgSrc = files.length > 0 ? files[0].url : ''
    return (
      <div className='imgItem'>
        <div className='backBtn'>
          <Icon className='oto_s1' onClick={ () => { this.handleCloseMask() } } type={ close } />
          <Icon className='oto_s2' onClick={ () => { this.handleFireImg() } } type={ deleteIcon } />
        </div>
        <div className='imgMain'>
          <img src={ imgSrc } alt='' />
        </div>
        <div className='btnWrap'>
          <span className='oto_s1'>
            重新选择
            <ImagePicker
              files={ files }
              onChange={ this.handleImgshow }
              onImageClick={ (index, fs) => this.handleResectImg(index, fs) }
            />
          </span>
          <span className='oto_s2' onClick={ () => { this.handleOk(files) } }>确定</span>
        </div>
      </div>
    )
  }
}

export default ChangeImg
