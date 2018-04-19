import React from 'react'
import { Carousel } from 'antd-mobile'
import { Mask, PicHandle } from '@boluome/oto_saas_web_app_component'

import '../style/picshow.scss'

const PicshowCom = props => {
  // const { children } = props
  const { PicshowData, width, height } = props
  const maskStyle = {
    opacity: '0.8',
  }
  const handleShowImg = index => {
    Mask(<CarouselImg PicshowData={ PicshowData } PicshowIndex={ index } />, { maskStyle })
  }
  if (PicshowData) {
    return (
      <div className='picWrap'>
        <div className='picShow'>
          {
            PicshowData.map((item, index) => (
              <div className='picitemDemo' key={ `${ index + item }` } onClick={ () => { handleShowImg(index) } }>
                <PicHandle picSrc={ item } sw={ width } sh={ height } />
              </div>
            ))
          }
        </div>
      </div>
    )
  }
  return (<div />)
}

export default PicshowCom

const CarouselImg = ({ PicshowData, PicshowIndex }) => {
  return (
    <div className='pic'>
      <div className='carouselWrap'>
        <Carousel
          dots={ false }
          className='my-carousel' autoplay={ false } infinite selectedIndex={ PicshowIndex }
          beforeChange={ (from, to) => console.log(`slide from ${ from } to ${ to }`) }
          afterChange={ index => console.log('slide to', index) }
        >
          {
            PicshowData.map((item, index) => (
              <div className='picitembig' key={ `${ index + item }` }>
                <img alt='加载中' style={{ height: '6rem' }} src={ item }
                  onLoad={ () => {
                    // fire window resize event to change height
                    window.dispatchEvent(new Event('resize'))
                  } }
                />
                {
                  PicshowData && PicshowData.length > 0 ? (<div className='picIndex'>{ `${ index + 1 }/${ PicshowData.length }` }</div>) : ('')
                }
              </div>
            ))
          }
        </Carousel>
      </div>
    </div>
  )
}


// handleContainerClose();
