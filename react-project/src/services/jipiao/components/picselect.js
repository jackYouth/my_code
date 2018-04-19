import React from 'react'
import { ImagePicker, Toast } from 'antd-mobile'
import { Loading, Mask, SlidePage } from '@boluome/oto_saas_web_app_component'
import { setStore, getStore } from '@boluome/common-lib'
// import ChangeImg from './changeimg.js'
// import '../style/textarea.scss'
import ImageListMask from './image-list-mask'

class Picselect extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ...props,
    }
    this.ImgHandle = this.ImgHandle.bind(this)
    this.ImgUpload = this.ImgUpload.bind(this)
    this.CreateCanvas = this.CreateCanvas.bind(this)
    this.canvertToBinary = this.canvertToBinary.bind(this)
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps,
    })
  }
  componentDidUpdate() {
  }
  // 判断大小
  ImgHandle(v, o, i) {
    console.log(v, o, i)
    if (o === 'add') {
      const file = v[v.length ? v.length - 1 : 0].file
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
            const a = this.canvertToBinary(base64)
            this.ImgUpload(a)
          }
        } else {
          Toast.info('图片不能超过8MB !', 2, null, false)
        }
      }
    } else if (o === 'remove') {
      const { files = [] } = this.state
      files.splice(i, 1)
      const { onChangeimg } = this.props
      if (onChangeimg) { onChangeimg(files) }
      this.setState({
        files,
      })
    }
  }
  // 图片处理
  CreateCanvas(img, fileType) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const quality = 0.7  // 默认图片质量为0.7
    const width = img.width * 1
    const height = img.height * 1

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
    return bb
  }
  ImgUpload(imgUrl) {
    const userid = getStore('customerUserId', 'session')
    const token = getStore('accessToken', 'session')
    const appcode = getStore('customerCode', 'session')
    const handleClose = Loading()
    const getUrl = 'https://upload.otosaas.com/new'
    const headers = {
      appcode,
      userid,
      token,
    }
    fetch(getUrl, { body: imgUrl, method: 'post', headers })
    .then(response => response.json())
    .then(json => {
      const { code, data } = json
      if (code === 0) {
        Toast.info('上传成功 !', 2, null, false)
        const photoUrl = { url: `https://f2.otosaas.com/${ data.md5 }` }
        const { files = [] } = this.state
        this.setState({
          files: [...files, photoUrl],
        })
        const { onChangeimg } = this.props
        if (onChangeimg) { onChangeimg([...files, photoUrl]) }
      } else {
        Toast.info('图片上传失败 !', 2, null, false)
        setStore('paotui_imgSrc', [], 'session')
      }
      handleClose()
    })
    .catch(error => {
      console.log('request failed: ', error)
      handleClose()
    })
  }
  handleImageClick(defaultIndex) {
    const { onChangeimg, files } = this.props
    Mask(
      <SlidePage target='right' showClose={ false } >
        <ImageListMask { ...{ defaultIndex, imgs: files, handleIconClick: onChangeimg } } />
      </SlidePage>,
      { mask: false, style: { position: 'absolute' } }
    )
  }
  render() {
    const { files = [] } = this.state
    console.log(files)
    return (
      <div className='picselect'>
        <ImagePicker
          files={ files }
          selectable={ files.length < 6 }
          onChange={ (v, o, i) => this.ImgHandle(v, o, i) }
          onImageClick={ index => this.handleImageClick(index) }
        />
      </div>
    )
  }
}

export default Picselect
