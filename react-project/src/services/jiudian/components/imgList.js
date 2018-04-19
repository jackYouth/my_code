import React, { Component } from 'react'
import { get }  from 'business'
import { parseQuery, getStore }  from '@boluome/common-lib'
import { Loading, Mask }          from '@boluome/oto_saas_web_app_component'
import { Tabs, Carousel }   from 'antd-mobile'
import closeMask from './closeMask'
import '../style/imgList.scss'
import noRoom from '../image/notFound.png'

const TabPane = Tabs.TabPane
class ImgList extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  fetchImgData() {
    const handleClose = Loading()
    const search = parseQuery(location.search)
    const { hotelId } = search
    let { cityId } = search
    if (cityId === 'undefined' || !cityId) {
      cityId = getStore('currentCityId')
    }
    get(`/jiudian/v1/hotel/${ hotelId }/images`, { hotelId, channel: getStore('channel'), cityId })
    .then(({ code, data = {}, message }) => {
      if (code === 0) {
        // console.log('data', data)
        this.setState({ imgData: data })
      } else {
        console.log(message)
      }
      handleClose()
    }).catch(err => {
      handleClose()
      console.log(err)
    })
  }

  showBigPic(num, images) {
    console.log('num', num, images)
    Mask(
      <div className='pic-layer-container'>
        <Carousel autoplay={ false } selectedIndex={ num - 1 } dots={ false }>
          {
            images.map(i => {
              return (
                <div key={ `hotelImg${ Math.random() }` } className='hotel-img-box'>
                  <img src={ i } alt='img' onClick={ () => { closeMask() } } />
                </div>
              )
            })
          }
        </Carousel>
      </div>
      , { mask: true, style: { backgroundColor: '#262626' } }
    )
  }

  componentWillMount() {
    this.fetchImgData()
  }

  componentWillUnmount() {
    closeMask()
  }

  render() {
    const { imgData = [] } = this.state
    return (
      <div className='imgList-container'>
        <Tabs defaultActiveKey='1'>
          {
            imgData.map(({ group, images }, index) => {
              return (
                <TabPane tab={ group } key={ `${ index + 1 }` }>
                  {
                    images.length > 0 ?
                      <div>
                        {
                          images.map((item, idx) => {
                            return (
                              <img src={ item } alt='图片不见了～' key={ `${ idx + 1 }` } onClick={ () => this.showBigPic(idx + 1, images) } />
                            )
                          })
                        }
                      </div>
                    :
                      <div style={{ height: 'calc(100% - 0.87rem)' }} className='ImgList-nodata-box'>
                        <div className='noRoom-container'>
                          <div className='noRoom-main'>
                            <img src={ noRoom } alt='没房间了.jpg' />
                            <p>暂无相关图片～</p>
                          </div>
                        </div>
                      </div>
                  }
                </TabPane>
              )
            })
          }
        </Tabs>
      </div>
    )
  }
}

export default ImgList
