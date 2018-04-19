import React, { Component } from 'react'
import { ImagePicker } from 'antd-mobile'


export default class ImagePickerExample extends Component {
  constructor(props) {
    super(props)
    this.state = {
      files: [],
    }
    this.onChange = this.onChange.bind(this)
  }
  onChange(files) {
    const { handleImgsChange } = this.props
    this.setState({
      files,
    })
    handleImgsChange(files.map(item => item.url))
  }
  render() {
    const { files } = this.state
    return (
      <div>
        <ImagePicker
          files={ files }
          onChange={ this.onChange }
          onImageClick={ (index, fs) => console.log(index, fs) }
          selectable={ files.length < 9 }
          className='img-list'
        />
      </div>
    )
  }
}
