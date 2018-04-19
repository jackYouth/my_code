/*
  使用说明：
    1，handleChangeImg：Function(newImgs){}，当图片内容改变时，将改变后的图片对象返回出去
    2，imgs：Array，当前选中的图片列表
    3，imgsLength：Number，非必传默认九图，上传图片的最大数量（现支持3，6，9图）
    (注：1，2返回的图片列表，都是上传后返回的服务器中的图片地址)
*/

import React from 'react'
import { getStore } from '@boluome/common-lib'
import { Mask, Loading } from '@boluome/oto_saas_web_app_component'
import { ImagePicker, Toast } from 'antd-mobile'

import ImageListMask from './image-list-mask'

import './style/index.scss'

export default class PicSelect extends React.Component {
  constructor(props) {
    super(props)
    const { imgs } = props
    this.state = {
      imgs,
    }
    this.imgUpload = this.imgUpload.bind(this)
    this.createCanvas = this.createCanvas.bind(this)
    this.canvertToBinary = this.canvertToBinary.bind(this)
  }
  componentWillUnmount() {
    if (this.closeMask) this.closeMask()
  }

  // 判断大小
  handleChangeImg(v, o, i, imgs) {
    const { handleChangeImg } = this.props
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
            const base64 = this.createCanvas(img, fileType)
            const a = this.canvertToBinary(base64)
            this.imgUpload(a, imgs)
          }
        } else {
          Toast.info('图片不能超过8MB !', 2, null, false)
        }
      }
    } else if (o === 'remove') {
      imgs.splice(i, 1)
      const { onChangeimg } = this.props
      if (onChangeimg) { onChangeimg(imgs) }
      handleChangeImg(imgs)
    }
  }
  // 图片处理
  createCanvas(img, fileType) {
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
  imgUpload(imgUrl, imgs) {
    const closeLoading = Loading()
    const { handleChangeImg } = this.props
    const userid = getStore('customerUserId', 'session')
    const token = getStore('accessToken', 'session')
    const appcode = getStore('customerCode', 'session')
    const headers = {
      appcode,
      userid,
      token,
    }
    fetch('https://upload.otosaas.com/new', { body: imgUrl, method: 'post', headers })
    .then(response => response.json())
    .then(json => {
      const { code, data } = json
      if (code === 0) {
        Toast.info('上传成功 !', 2, null, false)
        imgs.push({ url: `https://f2.otosaas.com/${ data.md5 }` })
        handleChangeImg(imgs)
      } else {
        Toast.info('图片上传失败 !', 2, null, false)
      }
      closeLoading()
    })
    .catch(error => {
      console.log('request failed: ', error)
      closeLoading()
    })
  }
  onImageClick(defaultIndex) {
    const { handleChangeImg, imgs } = this.props
    this.closeMask = Mask(<ImageListMask { ...{ defaultIndex, imgs, handleIconClick: handleChangeImg } } />)
  }

  render() {
    const { imgs, imgsLength = 9 } = this.props
    console.log('imgs', imgs)
    return (
      <div className='pic-img-container'>
        {
          imgs.length >= 0 && imgsLength >= 3 &&
          <ImagePicker
            files={ imgs.slice(0, 3) }
            onChange={ (changeFiles, type, index) => this.handleChangeImg(changeFiles, type, index, imgs) }
            onImageClick={ index => this.onImageClick(index) }
          />
        }
        {
          imgs.length >= 3 && imgsLength >= 6 &&
          <ImagePicker
            files={ imgs.slice(3, 6) }
            onChange={ (changeFiles, type, index) => this.handleChangeImg(changeFiles, type, index + 3, imgs) }
            onImageClick={ index => this.onImageClick(index + 3) }
          />
        }
        {
          imgs.length >= 6 && imgsLength >= 9 &&
          <ImagePicker
            files={ imgs.slice(6, 9) }
            onChange={ (changeFiles, type, index) => this.handleChangeImg(changeFiles, type, index + 6, imgs) }
            onImageClick={ index => this.onImageClick(index + 6) }
          />
        }
      </div>
    )
  }
}
