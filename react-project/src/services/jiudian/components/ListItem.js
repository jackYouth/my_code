import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import '../style/listItem.scss'
import empty from '../image/movie_empty_img.png'

// 单个显示商家组件
class ListItem extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    // console.log('ListItem props', this.props)
    const { handleScrollTop, data = {} } = this.props
    const { name, pic, type, recommend, landmark, districtName, distance, price, id } = data
    return (
      <div className='listItem-container' onClick={ () => { browserHistory.push(`/jiudian/details?id=${ id }`); handleScrollTop() } }>
        <div className='img-box'>
          <span style={{ backgroundImage: !pic ? `url(${ empty })` : `url(${ pic })` }} />
        </div>
        <div className='info-box'>
          <h2>{ name }</h2>
          <p className='line-one'>
            <span>{ type }</span>
            <span>{ `推荐度${ recommend }` }</span>
          </p>
          <p className='line-two'>
            <span>{ districtName }</span>
            <span>{ landmark }</span>
          </p>
          <p className='line-three'>
            <span>{ distance }</span>
          </p>
          <div className='price-box'>
            <span>¥</span>
            <span>{ price }</span>
            <span>起</span>
          </div>
        </div>
      </div>
    )
  }
}

export default ListItem
