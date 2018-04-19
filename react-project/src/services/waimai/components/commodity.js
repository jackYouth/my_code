import React, { Component } from 'react'
// import { getStore } from '@boluome/common-lib'
import BScroll from 'better-scroll'
import GoodsItem from './goodsItem'
import getCart from './getCart'
import '../style/restaurantDetail.scss'
import '../style/commodity.scss'
import fire from '../img/fire.png'

const FoodList = ({ data, foods, menuCategoryName }) => (
  <div className='food-in-box foodlist'>
    <h3>{ menuCategoryName }</h3>
    {
      foods.map(food => {
        return (
          <GoodsItem { ...{ key: food.foodName, data, menuCategoryName, ...food } } />
        )
      })
    }
  </div>
)


class Commodity extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
    this.listHeight = []
    this.scrollY = 0
    this.isScroll = false
    this.mypos = 0
    this.tagsIndex = 0
    this.changeHeight = 0
    this.tipsHeight = 0
    this.calculateHeight = this.calculateHeight.bind(this)
    this.currentIndex = this.currentIndex.bind(this)
    this.handleTagsMark = this.handleTagsMark.bind(this)
    this.initScroll = this.initScroll.bind(this)
    this.toggleActiveTag = this.toggleActiveTag.bind(this)
  }

  currentIndex(i = 0, els = document.querySelectorAll('.foodList')) {
    const { scrollY } = this
    // console.log('in currentIndex', els, scrollY)
    for (; i < els.length; i++) {
      const { offsetTop } = els[i]
      // console.log(offsetTop, scrollY)
      if (scrollY < offsetTop) break
    }
    this.followScroll(i)

    return i - 1 < 0 ? 0 : i - 1
  }

  initScroll() {
    this.mainTitleScroll = new BScroll(this.menuContainer, {
      click:  true,
      bounce: false,
    })
    this.mainListScroll = new BScroll(this.foodContainer, {
      click:        true,
      probeType:    2,
      bounce:       false,
      deceleration: 0.003,
    })

    this.mainListScroll.on('scrollStart', () => {
      this.mainListScroll.refresh()
      this.mainTitleScroll.refresh()
      this.indexMainWrap.style.webkitTransition = ''
      this.isScroll = true
      this.imageHeight = document.querySelector('.restaurantTopInfo').clientHeight
      this.minTranslateY = -this.imageHeight
    })
    this.mainListScroll.on('scrollEnd', pos => {
      // this.scrollY = Math.abs(Math.round(pos.y))
      // console.log('posy', pos.y)
      // const a = document.querySelector('.restaurantTopInfo').clientHeight
      // console.log('aaaaaaaa', a)
      this.scrollY = pos.y ? Math.abs(Math.round(pos.y)) + this.imageHeight + document.querySelector('.restaurantTopInfo').clientHeight : Math.abs(Math.round(pos.y))
      this.toggleActiveTag(this.currentIndex())
      if (!this.isScroll) {
        this.mainWrap.style.webkitTransition = 'all .3s ease'
        this.ListeningScroll(pos.y)
      }
      if (this.isScroll && this.scrollY === 0) { // 这里修改的是 高度不准 下不去的现象
        this.mainWrap.style.webkitTransition = 'all .1s ease'
        this.ListeningScroll(pos.y)
      }
    })
    this.mainListScroll.on('scroll', pos => {
      // console.log('scrolling~~~~~', pos)
      if (!pos.y) {
        return
      }
      if (this.isScroll) {
        this.mypos = pos.y
        this.ListeningScroll(this.mypos)
      }
      // console.log('this.imageHeight', this.imageHeight)
      this.scrollY = Math.abs(Math.round(pos.y)) + this.imageHeight + document.querySelector('.restaurantTopInfo').clientHeight
      this.tipsHeight = document.querySelector('.tip') ? document.querySelector('.tip').clientHeight : 0
      document.querySelectorAll('.coffee_kong')[0].style.height = '50%'
      this.toggleActiveTag(this.currentIndex())
    })
  }

  // 选择tags，即改变商品类别
  handleTagsMark(index) {
    this.imageHeight = document.querySelector('.restaurantTopInfo').clientHeight
    this.minTranslateY = -this.imageHeight
    this.tipsHeight = document.querySelector('.tip') ? document.querySelector('.tip').clientHeight : 0
    // console.log('in handleTagsMark------------->', index)
    this.toggleActiveTag(index)
    this.isScroll = false
    this.mypos = 0
    const mainListScroll = this.mainListScroll
    const el = document.querySelectorAll('.foodlist')[index]
    mainListScroll.scrollToElement(el, 400)
    // this.mainListScroll.refresh()
    // this.mainTitleScroll.refresh()
  }

  // className切换
  toggleActiveTag(index) {
    // console.log('in toggleActiveTag', index)
    const tags = document.querySelectorAll('.menu-categories')
    for (let i = 0; i < tags.length; i++) {
      tags[i].className = tags[i].className.replace(/tagsmark/g, '')
    }
    tags[index].className += ' tagsmark'
  }

  calculateHeight() {
    this.mainListScroll.refresh()
    // this.mainTitleScroll.refresh()
    const listHeight = this.listHeight
    const foodList = document.getElementsByClassName('foodlist')
    let height = 0
    listHeight.push(height)
    for (let i = 0; i < foodList.length; i++) {
      height += foodList[i].clientHeight
      listHeight.push(height)
    }
    // console.log('listHeight', listHeight)
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

  followScroll(index) {
    const el = document.querySelectorAll('.menu-categories')[index]
    // console.log('el----->', index, el)
    this.mainTitleScroll.scrollToElement(el, 100, 0, -200)
  }

  componentDidMount() {
    this.initScroll()
    this.mainHeight = this.indexMainWrap.clientHeight
    this.mainWrap = document.querySelector('.mainWrap')
    this.imageHeight = document.querySelector('.restaurantTopInfo').clientHeight
    this.tipsHeight = document.querySelector('.tip') ? document.querySelector('.tip').clientHeight : 0
    this.minTranslateY = -this.imageHeight
    document.querySelectorAll('.coffee_kong')[0].style.height = '50%'
  }

  componentWillReceiveProps() {
    setTimeout(() => this.calculateHeight(), 500)
    this.mainHeight = this.indexMainWrap.clientHeight
    this.mainTitleScroll.refresh()
    this.mainListScroll.refresh()
  }

  componentWillUnmount() {
    // Mask.closeAll()
    // const tagsmark = getStore('tagsmark', 'session')
    // const tagsIndex = getStore('tagsIndex', 'session')
    // if (tagsIndex && tagsmark) {
    //   this.setState({
    //     tagsmark,
    //     tagsIndex,
    //   })
    // }
  }

  render() {
    const { data = {} } = this.props
    // console.log('commodity data------------', data)
    const { restaurantInfo = {}, restaurantId,
            currIndex = 0, shoppingCarArray = [], allFoods = [],
          } = data
    const { isOpen = true, activities = [] } = restaurantInfo
    // const customerUserId = getStore('customerUserId', 'session')
    // if (!shoppingCarArray[customerUserId]) {
    //   shoppingCarArray[customerUserId] = {}
    // }
    // let restaurantCart = shoppingCarArray[customerUserId][restaurantId]
    let restaurantCart = shoppingCarArray[restaurantId]
    if (!restaurantCart) {
      restaurantCart = []
    }
    const shoppingCar = getCart(restaurantCart)

    return (
      <div className='commodity-container indexMainWrap' ref={ c => { this.indexMainWrap = c } }
        style={{ height: !isOpen ? 'calc(100% - 1rem)' : activities.length > 0 ? 'calc(100% - 4.9rem)' : 'calc(100% - 3.76rem)' }}
      >
        <div className='menu-container' ref={ v => this.menuContainer = v }
          style={{ overflowY: 'scroll', backgroundColor: '#f5f5f6' }}
        >
          <ul>
            {
              allFoods.map(({ menuCategoryId, menuCategoryName }, index) => {
                return (
                  <div key={ `restaurantMenu-key${ Math.random() }` } id={ menuCategoryId }
                    className={ currIndex === index ? 'menu-categories tagsmark' : 'menu-categories' }
                    onClick={ () => {
                      this.handleTagsMark(index)
                    } }
                  >
                    {
                      menuCategoryName === '热销' ? <div><img src={ fire } alt='热销榜' className='fire' />{ menuCategoryName }</div> : menuCategoryName
                    }
                    {
                      shoppingCar.length > 0 && shoppingCar.filter(o => o.menuCategoryName === menuCategoryName).length > 0 ?
                        <span className='numTip'>
                          {
                            shoppingCar.filter(o => o.menuCategoryName === menuCategoryName)
                            .reduce((count, curr) => { return count += curr.quantity }, 0)
                          }
                        </span>
                      : ''
                    }
                  </div>
                )
              })
            }
          </ul>
        </div>
        <div className='food-container' ref={ v => this.foodContainer = v }
          style={{ overflowY: 'hidden' }}
        >
          <ul>
            {
              allFoods.map(({ foods, menuCategoryName, menuCategoryId }) => {
                // console.log(foods)
                return (
                  <FoodList { ...{ menuCategoryName, foods, data } } key={ `food-in-box-${ menuCategoryId }` } />
                )
              })
            }
            <div className='coffee_kong' />
          </ul>
        </div>
      </div>
    )
  }
}

export default Commodity
