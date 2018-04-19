import React from 'react'
import { browserHistory } from 'react-router'
import { Icon } from 'antd-mobile'
import { splitEvery } from 'ramda'
import LazyLoad from 'react-lazyload'

import '../../styles/activity/year-activity.scss'

import testImg1 from '../../img/activity/test1.png'

const YearActivity = ({
  activities, currentActivityIndex = 0, handleTitleClick,
  handleScroll,
  showSubTitles = false,
}) => {
  if (!activities) return <div />
  // activities = ([clone(activities[0]), clone(activities[0]), clone(activities[0]), clone(activities[0]), clone(activities[0]), clone(activities[0]), clone(activities[0]), clone(activities[0])]).map((o, i) => {
  //   o.activityId += i
  //   return o
  // })
  const subTitles = activities.map(o => ({ title: o.activityName, id: o.activityId }))
  return (
    <div className='year-activity' onScroll={ e => { handleScroll(e) } }>
      <SubTitles { ...{ subTitles, currentActivityIndex, handleTitleClick, showSubTitles } } />
      <Banner />
      {
        activities.map(o => <Item { ...{ activityData: o } } key={ o.activityId } />)
      }
      <div className='footer-bg' />
    </div>
  )
}

export default YearActivity

class Banner extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentIndex: 0,
    }
  }
  handleScroll(e) {
    const { scrollLeft, offsetWidth } = e.target
    this.setState({ currentIndex: Math.floor((scrollLeft + 100) / offsetWidth) })
  }
  render() {
    const { currentIndex } = this.state
    const length = 1
    const testImgs = [testImg1]
    // 这一版不做的
    const canDo = false
    return (
      <div className='banner'>
        <div className='scroll-contaienr' onScroll={ e => this.handleScroll(e) }>
          <img src={ require('../../img/activity/banner_bg.png') } alt='banner' />
        </div>
        {
          canDo &&
          <div className='scroll-contaienr' onScroll={ e => this.handleScroll(e) }>
            <p>
              {
                Array.from(new Array(length)).map((o, i) => `${ o }${ i }`).map(o => <img src={ require('../../img/activity/banner_bg.png') } alt='banner' key={ o } />)
              }
            </p>
          </div>
        }
        {
          canDo &&
          Array.from(new Array(length)).map((o, i) => `${ o }${ i }`).map((o, i) => <img className={ currentIndex === i ? 'active' : '' } src={ testImgs[i] } alt='test' key={ o } />)
        }
      </div>
    )
  }
}

const SubTitles = ({ subTitles, currentActivityIndex, handleTitleClick, showSubTitles }) => {
  return (
    <ul className={ showSubTitles ? 'sub-titles active' : 'sub-titles' } onScroll={ () => {} }>
      {
        subTitles.map((o, i) => (
          <li className={ currentActivityIndex === i ? 'active' : '' } key={ o.id } onClick={ () => handleTitleClick(i) }>
            {
              currentActivityIndex === i &&
              <Icon type={ require('svg/location.svg') } size='md' />
            }
            { o.title }
          </li>
        ))
      }
    </ul>
  )
}

const Item = ({ activityData }) => {
  const { activityName, commodities } = activityData
  return (
    <div className='year-activity-item'>
      <SubTitle { ...{ content: activityName } } />
      {
        (splitEvery(2)(commodities)).map(data => <CommodityItem { ...{ data } } key={ data[0].commodityId } />)
      }
    </div>
  )
}


const SubTitle = ({ content }) => {
  return (
    <div className='sub-title'>
      <img src={ require('../../img/activity/label_l.png') } alt='label_l' />
      <p>{ content }</p>
      <img src={ require('../../img/activity/label_r.png') } alt='label_r' />
    </div>
  )
}

const CommodityItem = ({ data }) => {
  return (
    <ul className='year-commodity-item'>
      {
        data.map((o, i) => {
          const { iconUrl, commodityName, sellPrice, commodityId, commodityDescription } = o
          return (
            <li className={ i === 0 ? 'year-commodity-item-left' : 'year-commodity-item-right' } key={ commodityId } onClick={ () => browserHistory.push(`/shangcheng/commodity?commodityId=${ commodityId }`) }>
              <p className='img-container'>
                <LazyLoad
                  height='100%'
                  once
                  throttle={ 200 }
                  placeholder={ <img style={{ height: '100%', width: '100%', border: '1px solid #f5f5f6' }} alt='' /> }
                >
                  <img src={ `${ iconUrl }?image&action=format:t_jpeg|resize:w_400` } alt={ commodityName } />
                </LazyLoad>
              </p>
              <div className='commodity-describe'>
                <p className='commodity-name line-2'>{ commodityName }{ commodityDescription }</p>
                <p className='sell-price'>年货价：<span>¥</span><span>{ sellPrice }</span></p>
              </div>
            </li>
          )
        })
      }
    </ul>
  )
}
