import React, { Component } from 'react'
import { Search, Empty, Loading } from '@boluome/oto_saas_web_app_component'
import { get, getStore, setStore } from '@boluome/common-lib'
import { Tabs } from 'antd-mobile'
import '../style/airportList.scss'
import img from '../image/noairport.png'

let search
let handleChooseAirport
const TabPane = Tabs.TabPane
class AirportList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabKey: 1,
    }
  }

  componentWillMount() {
    this.getAirportList()
  }
  componentDidMount() {
    search = this.search.bind(this)
    handleChooseAirport = this.handleChooseAirport.bind(this)
    // setTimeout(() => { document.querySelector('.letter-box').style.zIndex = '999' }, 100)
    setTimeout(() => { document.querySelector('#searchInput').focus() }, 500)
    // document.querySelectorAll('#searchInput').focus()
  }

  getAirportList() {
    const handleClose = Loading()
    const { props } = this.props
    const { channel } = props.props
    // console.log('this.props', this.props)
    const serverType = getStore('serverType', 'session')
    get('/dengjifuwu/v1/search/area/info', { serverType, channel })
    .then(({ code, data = [], message }) => {
      if (code === 0) {
        if (data.length > 0) {
          this.setState({ airportList: data })
        }
      } else {
        console.log(message)
      }
      handleClose()
    }).catch(err => {
      console.log(err)
      handleClose()
    })
  }

  mapData(data) {
    const reply = []
    const mapedData = data.sort((a, b) => { return a.py.substring(0, 1).charCodeAt() - b.py.substring(0, 1).charCodeAt() }).reduce((nameMap, current) => {
      const brandFl = current.py.substring(0, 1).toUpperCase()
      if (nameMap[brandFl]) {
        nameMap[brandFl].push(current)
      } else {
        nameMap[brandFl] = [current]
      }
      return nameMap
    }, {})
    const newKey = Object.keys(mapedData)
    const newVal = Object.values(mapedData)
    newKey.forEach((i, idx) => {
      if (newVal[idx][0].py.substring(0, 1).toUpperCase() === i) {
        reply.push({
          key:  i,
          data: mapedData[i],
        })
      }
    })
    return reply
  }

  search(keyWord, callback) {
    const { airportList = [] } = this.state
    console.log('airportList', airportList)
    const newArr = []
    airportList.forEach(i => {
      if (i.airportName.indexOf(keyWord) > -1) {
        newArr.push(i)
      }
    })
    callback(null, newArr)
    // console.log('newArr', newArr)
    // console.log(callback)
  }

  handleCityIndexClick(cityIndex) {
    console.log('llllllllllll', `letter${ cityIndex }`)
    document.getElementById(`letter${ cityIndex }`).scrollIntoView()
  }

  handleChooseAirport(item) {
    const Aprops = this.props.props
    const { handleContainerClose, props, chooseAirport } = Aprops
    let airportHistory = getStore('airportHistory', 'session')
    if (!airportHistory) {
      airportHistory = []
    }
    airportHistory.filter((i, idx) => {
      if (i.airportName === item.airportName) {
        airportHistory.splice(idx, 1)
      }
      return airportHistory
    })
    airportHistory.push(item)
    setStore('airportHistory', airportHistory, 'session')
    console.log('props', props)
    chooseAirport(item)
    handleContainerClose()
  }

  render() {
    const { airportList = [], tabKey = 1 } = this.state
    console.log('airportList', tabKey)
    const letterIndex = []
    // const airportInfo = gZetStore('localAirport', 'session')
    const airportHistory = getStore('airportHistory', 'session')
    console.log('airportHistory', airportHistory)
    // letterIndex.push('local')
    // letterIndex.push('history')
    const showList = this.mapData(airportList)
    return (
      <div>
        <div className='airportList-container' style={{ zIndex: '9', position: 'relative' }}>
          <Tabs defaultActiveKey='1' swipeable={ false } animated={ false } onChange={ v => { this.setState({ tabKey: v }) } }>
            <TabPane tab='国内' key='1'>
              <div className='list-main-container'>
                {
                  showList.length > 0 ?
                    <div className='list-main-box'>
                      {
                        showList.map(({ key, data }) => {
                          const letter = key
                          letterIndex.push(key)
                          return (
                            <div key={ `airKey${ Math.random() }` } id={ `letter${ letter }` } className='air-ontainer'>
                              <div className='airKey'>{ letter }</div>
                              <ul>
                                {
                                  data.map(item => (
                                    <li key={ `airIdKey${ Math.random() }` } className='airBox' onClick={ () => this.handleChooseAirport(item) }>{ item.airportName }</li>
                                  ))
                                }
                              </ul>
                            </div>
                          )
                        })
                      }
                    </div>
                  : ''
                }
              </div>
            </TabPane>
            <TabPane tab='国际' key='2'>
              <div style={{ height: '100%' }} className='internationalAir'>
                <Empty message='暂无数据' imgUrl={ img } />
              </div>
            </TabPane>
          </Tabs>
        </div>
        {
          showList.length > 0 && Number(tabKey) === 1 ?
            <div className='letter-box'>
              <ul className='letterIndex' style={{ zIndex: '999', position: 'relative' }}>
                {
                  letterIndex.map(item => {
                    return (
                      <li key={ `letterKey${ item }` } style={{ zIndex: '999', position: 'relative' }}>
                        <span style={{ zIndex: '99', position: 'relative' }}
                          onClick={ () => this.handleCityIndexClick(item) }
                        >{ item === 'local' ? '定位' : item === 'history' ? '历史' : item }</span>
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          : ''
        }
      </div>
    )
  }
}

export default (
  props => {
    return (
      <Search
        inputPlaceholder={ '请输入机场名称' }
        content={ <AirportList props={ props } /> }
        listItem={ <ListItem /> }
        noResult={ <Empty message='没有找到相关机场呢，请换个关键词试试吧~' imgUrl={ img } /> }
        onFeach={ (keyWord, callback) => search(keyWord, callback) }
        handleResult={ result => handleChooseAirport(result) }
        delayTime={ 1000 }
      />
    )
  }
)

const ListItem = ({ data, index, searchKey }) => {
  console.log('searchKey----', searchKey, index, data)
  const { airportName } = data
  return (
    <div className='itemBox'>
      <p>{ airportName }</p>
    </div>
  )
}

// <div className='local' id='letterlocal'>
//   <span>定位</span>
//   <p onClick={ () => this.handleChooseAirport(airportInfo) }>{ airportInfo.airportName }</p>
// </div>
// {
//   airportHistory ?
//     <div className='history' id='letterhistory'>
//       <span>历史</span>
//       {
//         airportHistory.map(i => {
//           return (
//             <p onClick={ () => this.handleChooseAirport(i) }>{ i.airportName }</p>
//           )
//         })
//       }
//     </div>
//   : ''
// }
