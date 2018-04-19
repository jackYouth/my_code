import React from 'react'
import { browserHistory } from 'react-router'
import { Carousel } from 'antd-mobile'
import { Mask } from '@boluome/oto_saas_web_app_component'
import { setStore } from '@boluome/common-lib'

import '../style/Carousel.scss'
// import back from '../img/back.svg'
// import deleteIcon from '../img/delete.svg'

class CarouselCom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ...props,
    }
    this.handleFireImg = this.handleFireImg.bind(this)
  }
  handleFireImg() {
    Mask.closeAll()
  }
  handleOk() {
    Mask.closeAll()
  }
  handleChooseTips(o) {
    const { displayTag } = o
    setStore('paotui_displayTag', displayTag, 'session')
    // const textarea = document.querySelector('.text').value
    // setStore('paotui_textarea', textarea, 'session')
    setStore('paotui_productName', [], 'session')
    browserHistory.push('/paotui/order')
  }
  render() {
    console.log(this.state)
    const { quickItem } = this.state
    const dataarr = []
    const len2 = Math.ceil(quickItem.length / 12)
    for (let k = 0; k < len2; k++) {
      const arr = []
      for (let i = (k * 12); i < ((k + 1) * 12); i++) {
        if (quickItem[i]) {
          arr.push(quickItem[i])
        }
      }
      dataarr.push(arr)
    }
    return (
      <div className='carouselWrap'>
        <Carousel
          className='my-carousel'
          autoplay={ false }
          infinite={ false }
          selectedIndex={ 0 }
          swipeSpeed={ 35 }
        >
          {
            dataarr.map(el => (
              <div className='itemlist' key={ el }>
                {
                  el.map(o => (
                    <div className='item' key={ o.displayTag } onClick={ () => this.handleChooseTips(o) }>
                      <img src={ o.iconUrl } alt='' />
                      <span>{ o.displayTag }</span>
                    </div>
                  ))
                }
              </div>
            ))
          }
        </Carousel>
      </div>
    )
  }
}

export default CarouselCom

// const ItemList = ({ data }) => {
//   console.log(data)
//   return (
//     <div className='carouselWrap'>
//       {
//         data.map(el => (
//           <ul className='item' key={ `${ Math.round() }` }>
//             {
//               el.map(o => (
//                 <li key={ `${ Math.round() }` }>
//                   <img src={ o.iconUrl } alt='' />
//                   <span>{ o.displayTag }</span>
//                 </li>
//               ))
//             }
//           </ul>
//         ))
//       }
//     </div>
//   )
// }
