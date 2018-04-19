import React from 'react'
import { Mask, SlidePage } from '@boluome/oto_saas_web_app_component'
import { Carousel } from 'antd-mobile'
import '../style/picture.scss'

const Picture = picture => {
  const { pic = [] } = picture
  if (pic.length > 0) {
    return (
      <div className='picture'>
        {
          pic.map((o, i) => {
            return (<img key={ `pic${ i * Math.random() }` } alt='img' src={ o } onClick={
                () => { Mask(<SlidePage><CarouselImg PicshowData={ pic } PicshowIndex={ i } /></SlidePage>, { selfClass: 'juzhao', maskStyle: { zIndex: 0 } }) }
              }
            />)
          })
        }
      </div>
    )
  }
  return (
    <div />
  )
}

export const CarouselImg = ({ PicshowData, PicshowIndex, handleContainerClose }) => {
  return (
    <div className='carouselWrap'>
      <Carousel
        dots={ false }
        className='my-carousel' autoplay={ false } selectedIndex={ PicshowIndex }
        beforeChange={ (from, to) => console.log(`slide from ${ from } to ${ to }`) }
        afterChange={ index => console.log('slide to', index) }
      >
        {
          PicshowData.map((item, index) => (
            <div key={ `${ index + item }` }>
              <div className='imgWrap' onClick={ () => { handleContainerClose() } } style={{ height: `${ document.documentElement.clientHeight }px`, width: '100%' }}>
                <img onClick={ e => { e.stopPropagation() } } style={{ width: '100%' }} alt='加载中' src={ item } />
              </div>
            </div>
          ))
        }
      </Carousel>
    </div>
  )
}

export default Picture
