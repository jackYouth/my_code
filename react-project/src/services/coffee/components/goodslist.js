import React from 'react'
import BScroll from 'better-scroll'
import { Icon } from 'antd-mobile'
import { getStore } from '@boluome/common-lib'
import { Mask } from '@boluome/oto_saas_web_app_component'
import ListAddDown from './listadddown.js'
import '../style/goodslist.scss'

import pnglogo from '../img/logobig.png'
import iconcha from '../img/cha.svg'

class GoodslistMain extends React.Component {
  constructor(props) {
    super(props)
    // console.log('GoodslistMain--f----', props)
    this.state = {
      ...props,
      tagsIndex: 0,
    }
    // console.log('goods', props)
    this.listHeight = []
    this.scrollY = 0
    this.isScroll = false
    this.mypos = 0
    this.tagsIndex = 0
    this.changeHeight = 0
    this.calculateHeight = this.calculateHeight.bind(this)
    this.currentIndex = this.currentIndex.bind(this)
    this.handleTagsMark = this.handleTagsMark.bind(this)
    this.initScroll = this.initScroll.bind(this)
    this.handleGoDetails = this.handleGoDetails.bind(this)
    this.ChooseContactFn = this.ChooseContactFn.bind(this)
    this.toggleActiveTag = this.toggleActiveTag.bind(this)
  }
  componentWillMount() {
    // console.log(this.state)
  }
  componentWillUnmount() {
    Mask.closeAll()
    const tagsmark = getStore('tagsmark', 'session')
    const tagsIndex = getStore('tagsIndex', 'session')
    if (tagsIndex && tagsmark) {
      this.setState({
        tagsmark,
        tagsIndex,
      })
    }
  }
  componentDidMount() {
    this.initScroll()
    this.calculateHeight()
    this.imageHeight = document.querySelector('.indexBanner').clientHeight
    this.mainWrap = document.querySelector('.mainWrap')
    this.minTranslateY = -this.imageHeight
    this.mainHeight = this.indexMainWrap.clientHeight
    document.querySelector('.coffee_kong').style.height = this.mainWrap.clientHeight // this.imageHeight // 2017-10-25 天津银行
    // this.t = document.querySelectorAll('.tagsitem')
    // console.log('test---', this.mainWrap.clientHeight)
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps,
    })
  }
  calculateHeight() {
    const listHeight = this.listHeight
    const foodList = document.getElementsByClassName('foodlist')
    let height = 0
    listHeight.push(height)
    for (let i = 0; i < foodList.length; i++) {
      const item = foodList[i]
      height += item.clientHeight
      listHeight.push(height)
    }
  }
  currentIndex(i = 0, els = document.querySelectorAll('.foodList')) {
    const { scrollY } = this
    for (; i < els.length; i++) {
      const { offsetTop } = els[i]
      // console.log(offsetTop, scrollY)
      if (scrollY < offsetTop) break
    }
    this.followScroll(i)

    return i - 1
  }
  initScroll() {
    // const toggleActiveTag = () => {
    //   const tags = document.querySelectorAll('.tagsitem')
    //   for (let i = 0; i < tags.length; i++) {
    //     tags[i].className = tags[i].className.replace(/tagsmark/g, '')
    //   }
    //   tags[this.currentIndex()].className += ' tagsmark'
    // }
    this.mainTitleScroll = new BScroll(this.mainTitle, {
      click:  true,
      bounce: false,
    })
    this.mainListScroll = new BScroll(this.mainList, {
      click:        true,
      probeType:    2,
      bounce:       false,
      deceleration: 0.003,
    })
    this.mainListScroll.on('scrollStart', () => {
      this.indexMainWrap.style.webkitTransition = ''
      this.isScroll = true
    })
    this.mainListScroll.on('scrollEnd', pos => {
      this.scrollY = Math.abs(Math.round(pos.y))
      // console.log(this.scrollY)
      this.toggleActiveTag(this.currentIndex())
      if (!this.isScroll) {
        this.mainWrap.style.webkitTransition = 'all .3s ease'
        this.ListeningScroll(pos.y)
      }
      if (this.isScroll && this.scrollY === 0) { // 这里修改的是 高度不准 下不去的现象
        this.mainWrap.style.webkitTransition = 'all .1s ease'
        this.ListeningScroll(pos.y)
      }
      this.mainListScroll.refresh()
    })
    this.mainListScroll.on('scroll', pos => {
      if (!pos.y) {
        return
      }
      if (this.isScroll) {
        this.mypos = pos.y
        this.ListeningScroll(this.mypos)
      }
      this.scrollY = Math.abs(Math.round(pos.y))
      this.toggleActiveTag(this.currentIndex())
    })
  }
  followScroll(index) {
    const el = document.querySelectorAll('.tagsitem')[index]
    this.mainTitleScroll.scrollToElement(el, 100, 0, -200)
  }
  // className切换
  toggleActiveTag(index) {
    const tags = document.querySelectorAll('.tagsitem')
    for (let i = 0; i < tags.length; i++) {
      tags[i].className = tags[i].className.replace(/tagsmark/g, '')
    }
    tags[index].className += ' tagsmark'
  }
  // banner 距离判断
  ListeningScroll(newVal) {
    const translateY = Math.max(this.minTranslateY, newVal)
    const height = Math.abs(translateY)
    this.changeHeight = height
    this.mainWrap.style.transform = `translate3d(0,${ translateY }px, 0)`
    this.mainWrap.style.webkitTransform = `translate3d(0,${ translateY }px, 0)`
    this.indexMainWrap.style.height = `${ this.mainHeight + height }`
  }
  // 选择tags，即改变商品类别
  handleTagsMark(item, index) {
    // console.log('qqqq', item, index)
    this.toggleActiveTag(index)
    this.isScroll = false
    this.mypos = 0
    const mainListScroll = this.mainListScroll
    const el = document.querySelectorAll('.foodlist')[index]
    mainListScroll.scrollToElement(el, 400)
    this.mainListScroll.refresh()
  }
  ChooseContactFn() {
    const { contactData = [], handleChangeContact, goContactList } = this.state
    console.log('dddd', handleChangeContact)
    Mask(<ChooseContact contactData={ contactData } handleChangeContact={ handleChangeContact } goContactList={ goContactList } />)
  }
  handleGoDetails(item) {
    const { OptimalContact, goDetailsShow } = this.state
    console.log('handleGoDetails---', OptimalContact)
    if (OptimalContact) {
      goDetailsShow(item)
    } else {
      this.ChooseContactFn()
    }
  }
  render() {
    const { goodslist,
      goodsCartarr, addCartFn, ReduceCartListNum, ReduceCartNum,
      goDetailsShow, tagsIndex, name,
    } = this.state
    if (goodslist) {
      return (
        <div className='mainWrap'>
          <div className='indexBanner'>
            <div className='banner_l'>
              <img alt='' src={ pnglogo } />
            </div>
            <div className='banner_r'>
              <div className='banner_title oto'>{ name }</div>
              <div className='banner_yu oto'>欢迎来到星巴克</div>
              <div className='banner_tips oto'>公告: *代购服务由邻趣提供*</div>
            </div>
          </div>
          <div className='indexMainWrap' ref={ c => { this.indexMainWrap = c } }>
            <div className='mainTitle' ref={ c => { this.mainTitle = c } }>
              <TagListshow goodslist={ goodslist }
                tagsIndex={ tagsIndex }
                handleTagsMark={ this.handleTagsMark }
              />
            </div>
            <div className='mainList' ref={ c => { this.mainList = c } }>
              <FoodslistMain
                goDetailsShow={ goDetailsShow }
                goodsCartarr={ goodsCartarr }
                addCartFn={ addCartFn }
                ReduceCartNum={ ReduceCartNum }
                ReduceCartListNum={ ReduceCartListNum }
                ChooseContactFn={ this.ChooseContactFn }
                handleGoDetails={ this.handleGoDetails }
                goodslist={ goodslist }
              />
            </div>
          </div>
        </div>
      )
    }
    return (<div />)
  }
}

export default GoodslistMain

// { goodslist, handleGoDetails,
//   goodsCartarr, addCartFn, ReduceCartListNum, ReduceCartNum,
//   ChooseContactFn,
//  }
const FoodslistMain = props => {
  const { goodslist } = props
  const { productItem, tags } = goodslist
  // console.log('xuanrang', props)
  return (
    <div className='productlist'>
      {
        tags.map(tag => (
          <div className='foodlist' key={ tag }>
            <p className='title'>{ tag }</p>
            {
              productItem[tag].map(item => {
                return (
                  <Food { ...{ item, ...props } } key={ item.productId } />
                )
              })
            }
          </div>
        ))
      }
      <div className='coffee_kong' />
    </div>
  )
}

const Food = ({ item, handleGoDetails, goodsCartarr, addCartFn, ReduceCartListNum, ReduceCartNum, ChooseContactFn }) => (
  <div className='item' >
    <div className='item_pic' onClick={ () => handleGoDetails(item) }>
      <img alt='' src={ item.photoUrl } />
    </div>
    <div className='item_main'>
      <div className='name' onClick={ () => handleGoDetails(item) }>
        <span className='name_l'>{ item.productName }</span>
        {
          item.attribute ? (<span className='name_r'>多规格</span>) : ('')
        }
      </div>
      <div className='Introduced' onClick={ () => handleGoDetails(item) }>
        { item.description }
      </div>
      <div className='price'>
        <span className='price_span price_l'>¥</span>
        <span className='price_span price_c'>{ item.price }</span>
        <ListAddDown
          productId={ item.productId }
          goodsCartarr={ goodsCartarr }
          data={ item }
          addCartFn={ addCartFn }
          ReduceCartNum={ ReduceCartNum }
          ReduceCartListNum={ ReduceCartListNum }
          ChooseContactFn={ ChooseContactFn }
        />
      </div>
    </div>
    <div className='line' />
  </div>
)

const TagListshow = ({ goodslist, handleTagsMark, tagsIndex }) => {
  const { tags } = goodslist
  return (
    <div className='taglist'>
      {
        tags.map((item, index) => (
          <div className={ `tagsitem ${ tagsIndex === index ? 'tagsmark' : '' }` } key={ item } onClick={ () => handleTagsMark(item, index) }>{ item }</div>
        ))
      }
    </div>
  )
}

// 请选择收货地址
const ChooseContact = ({ contactData, handleChangeContact, goContactList, handleContainerClose }) => {
  return (
    <div className='ChooseContact'>
      <div className='title'>请选择收货地址<span className='close'><Icon onClick={ () => handleContainerClose() } type={ iconcha } /></span></div>
      <div className='contactList'>
        {
          contactData.length > 0 ? (contactData.map(i => (
            <div className='item' key={ i.contactId } onClick={ () => handleChangeContact(i, handleContainerClose) }>
              { i.detail }
            </div>
          ))) : (<div className='no_contact'><img alt='' src={ require('../img/Noaddress.png') } /></div>)
        }
        {
          contactData.length > 0 ? ('') : (<p className='otherTip'>你还没有收货地址</p>)
        }
      </div>
      {
        contactData.length > 0 ? (<div className='other' onClick={ () => goContactList() }>其他地址</div>) : (<div className='other otherOrg' onClick={ () => goContactList() }>新增地址</div>)
      }
    </div>
  )
}
