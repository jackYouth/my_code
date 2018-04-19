import React from 'react'
import { ImagePicker, TextareaItem, Toast } from 'antd-mobile'
import { Mask, Loading } from '@boluome/oto_saas_web_app_component'
import { setStore, getStore } from '@boluome/common-lib'
// import { send } from 'business'
// import { Buffer } from 'buffer'
import ChangeImg from './changeimg.js'
import '../style/textarea.scss'
// import back from '../img/back.svg'
// import deleteIcon from '../img/delete.svg'

class TextareaCom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ...props,
    }
    // this.handleFireImg = this.handleFireImg.bind(this)
    this.handleChooseImg = this.handleChooseImg.bind(this)
    this.onChangeImg = this.onChangeImg.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.ImgHandle = this.ImgHandle.bind(this)
    this.ImgUpload = this.ImgUpload.bind(this)
    this.CreateCanvas = this.CreateCanvas.bind(this)
    this.canvertToBinary = this.canvertToBinary.bind(this)
  }
  componentWillReceiveProps(nextProps) {
    // console.log('this.props.textareaStr333', nextProps)
    this.setState({
      ...nextProps,
    })
  }
  componentDidUpdate() {
    // console.log('start')
    // const elW = document.querySelector('.am-textarea-control')
    // elW.scrollTop = elW.scrollHeight
  }
  // 图片处理
  ImgHandle(file) {
    console.log('ImgHandle---', file)
    const fileType = file.type
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = event => {
      const result = event.target.result  // 返回的dataURL
      const img = new Image()
      img.src = result
      const max = 1024 * 1024 // Math.pow(1024, 2)
      if (file.size / max < 8) {
        img.onload = () => {
          const base64 = this.CreateCanvas(img, fileType)
          // const a = Buffer.from(base64, 'base64').toString('binary')
          // console.log(a)
          const a = this.canvertToBinary(base64)
          this.ImgUpload(a)
        }
      } else {
        Toast.info('图片不能超过8MB !', 2, null, false)
        this.setState({
          files: [],
        })
        setStore('paotui_imgSrc', [], 'session')
      }
    }
  }
  CreateCanvas(img, fileType) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const quality = 0.5  // 默认图片质量为0.7
    const width = img.width * 0.2
    const height = img.height * 0.2

    canvas.width = width
    canvas.height = height

    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, width, height)

  // 压缩--quality值越小，所绘制出的图像越模糊
    const base64data = canvas.toDataURL(fileType, quality)
    return base64data
  }
  // 对base64 进行处理
  canvertToBinary(dataURI) {
    const byteString = window.atob(dataURI.split(',')[1])
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    const bb = new window.Blob([ab], { type: 'image/png' })
    // console.log('bb----', bb, '-----', byteString)
    return bb
  }
  ImgUpload(imgUrl) {
    console.log('ImgUpload--', imgUrl)
    const userid = getStore('customerUserId', 'session')
    const token = getStore('accessToken', 'session')
    const appcode = getStore('customerCode', 'session')
    console.log(userid, token, appcode)
    const handleClose = Loading()
    const getUrl = 'https://upload.otosaas.com/new'
    const headers = {
      appcode,
      userid,
      token,
      // 'Content-Type': 'image/jpeg',   // FormData 不能用image
    }
    // const datas = new FormData()
    // datas.append('file', imgUrl)
    // fetch(getUrl, { body: datas, method: 'post', headers })
    fetch(getUrl, { body: imgUrl, method: 'post', headers })
    .then(response => response.json())
    .then(json => {
      const { code, data } = json
      console.log('json----', json)
      if (code === 0) {
        Toast.info('上传成功 !', 2, null, false)
        const photoUrl = `https://f2.otosaas.com/${ data.md5 }`
        setStore('paotui_photoUrl', photoUrl, 'session')
      } else {
        Toast.info('图片上传失败 !', 2, null, false)
        this.setState({
          files: [],
        })
        setStore('paotui_imgSrc', [], 'session')
      }
      const { changeText } = this.props
      changeText()
      handleClose()
    })
    .catch(error => {
      console.log('request failed: ', error)
      handleClose()
    })
  }
  handleImgshow(v) {
    // console.log('handleImgshow我点击了', v)
    this.setState({
      files: v,
    })
    this.ImgHandle(v[0].file)
    setStore('paotui_imgSrc', v, 'session')
  }
  onChangeImg(ref) {
    this.setState({
      files: ref,
    })
    setStore('paotui_imgSrc', ref, 'session')
    if (ref.length !== 0) {
      console.log('aaaa-', ref)
      this.ImgHandle(ref[0].file)
    }
  }
  handleChooseImg(index, fs, files) {
    const { changeText } = this.props
    const maskStyle = {
      opacity: 0.7,
    }
    changeText()
    Mask(
      <ChangeImg
        imgSrc={ fs }
        files={ files }
        onChange={ this.onChangeImg }
      />
      , { maskStyle, maskClosable: false })
  }
  handleChange(e) {
    const { changeText } = this.props
    const elW = document.querySelector('.am-textarea-control')
    elW.scrollTop = elW.scrollHeight
    this.setState({
      textareaStr: e,
    })
    setStore('paotui_textarea', e, 'session')
    changeText()
  }
  render() {
    const { files = [], textareaStr = '', focused } = this.state
    return (
      <div className='textareaWrap'>
        <div className='main'>
          <TextareaItem
            className='text'
            cols placeholder='输入商品名和数量'
            rows={ 2 }
            defaultValue={ textareaStr }
            value={ textareaStr }
            onChange={ this.handleChange }
            focused={ focused }
            onFocus={ () => {
              this.setState({
                focused: true,
              })
            } }
            onBlur={ () => {
              this.setState({
                focused: false,
              })
            } }
          />
          <div className='photo_icon'>
            <ImagePicker
              files={ files }
              onChange={ v => this.handleImgshow(v) }
              onImageClick={ (index, fs) => this.handleChooseImg(index, fs[0].url, files) }
            />
          </div>
        </div>
      </div>
    )
  }
}

export default TextareaCom
// <div className='photo_icon'>
//   <input id='rId' type='file' onChange={ e => this.handleImgshow(e.target.files) } />
//   <label htmlFor='rId' onClick={ (index, fs) => this.handleChooseImg(index, fs[0].url) }>ss</label>
// </div>

// // 图片处理
// ImgHandle(imgUrl) {
//   console.log('ImgHandle---', imgUrl)
//   const img = new Image()
//   img.src = imgUrl[0].url
//   img.onload = () => {
//     // 默认按比例压缩
//     const w = img.width
//     const h = img.height
//     // const scale = w / h
//     const quality = 0.7  // 默认图片质量为0.7
//     // 生成canvas
//     const canvas = document.createElement('canvas')
//     const ctx = canvas.getContext('2d')
//     // 创建属性节点
//     const anw = document.createAttribute('width')
//     anw.nodeValue = w
//     const anh = document.createAttribute('height')
//     anh.nodeValue = h
//     canvas.setAttributeNode(anw)
//     canvas.setAttributeNode(anh)
//     ctx.drawImage(img, 0, 0, w, h)
//     // quality值越小，所绘制出的图像越模糊
//     const base64 = canvas.toDataURL('image/jpeg', quality)
//     // 回调函数返回base64的值
//     return base64
//   }
// }

// const ChangeImg = ({ imgSrc, handleCloseMask, handleFireImg, handleOk, files, handleImgshow, handleResectImg }) => {
//   return (
//     <div className='imgItem'>
//       <div className='backBtn'>
//         <Icon className='oto_s1' onClick={ () => { handleCloseMask() } } type={ back } />
//         <Icon className='oto_s2' onClick={ () => { handleFireImg() } } type={ deleteIcon } />
//       </div>
//       <div className='imgMain'>
//         <img src={ imgSrc } alt='' />
//       </div>
//       <div className='btnWrap'>
//         <span className='oto_s1'>
//           重新选择
//           <ImagePicker
//             files={ files }
//             onChange={ v => handleImgshow(v) }
//             selectable={ files.length < 2 }
//             onImageClick={ (index, fs) => handleResectImg(index, fs[0].url) }
//           />
//         </span>
//         <span className='oto_s2' onClick={ () => { handleOk() } }>确定</span>
//       </div>
//     </div>
//   )
// }
