import React, { Component } from 'react'
import { get }  from 'business'
import { Mask, Loading } from '@boluome/oto_saas_web_app_component'
import '../style/shaixuan.scss'

// 单个显示商家组件
class Shaixuan extends Component {
  constructor(props) {
    super(props)
    this.state = {
      BrandId:    this.props.data.BrandId || [],
      Facilities: this.props.data.Facilities || [],
      ThemeIds:   this.props.data.ThemeIds || [],
    }
  }

  handleClose() {
    const { handleContainerClose } = this.props
    handleContainerClose()
    Mask.closeAll()
  }

  componentWillMount() {
    this.fetchData()
  }

  chooseBrandId(id) {
    let { BrandId = [] } = this.state
    if (BrandId.indexOf(id) === -1) {
      BrandId.push(id)
    } else {
      BrandId = BrandId.filter(i => i !== id)
    }
    this.setState({ BrandId })
  }

  chooseFacilities(id) {
    let { Facilities = [] } = this.state
    if (Facilities.indexOf(id) === -1) {
      Facilities.push(id)
    } else {
      Facilities = Facilities.filter(i => i !== id)
    }
    this.setState({ Facilities })
  }

  chooseThemeIds(id) {
    let { ThemeIds = [] } = this.state
    if (ThemeIds.indexOf(id) === -1) {
      ThemeIds.push(id)
    } else {
      ThemeIds = ThemeIds.filter(i => i !== id)
    }
    this.setState({ ThemeIds })
  }

  cleanArr() {
    this.setState({ BrandId: [], ThemeIds: [], Facilities: [] })
  }

  confirmArr() {
    const { shaiuxuanChange } = this.props
    const { BrandId = [], ThemeIds = [], Facilities = [] } = this.state
    shaiuxuanChange({ BrandId, ThemeIds, Facilities })
    this.handleClose()
  }

  fetchData() {
    const { api, postData } = this.props
    const handleClose = Loading()
    get(api, postData).then(({ code, data = {}, message }) => {
      if (code === 0) {
        this.setState({ info: data })
      } else {
        console.log(message)
      }
      handleClose()
    }).catch(err => {
      handleClose()
      console.log(err)
    })
  }

  render() {
    const { ThemeIds = [], Facilities = [], BrandId = [], info = {} } = this.state
    const { brands = [], facilities = [], themes = [] } = info
    let { showIndex } = this.state
    // console.log('info---------->', info)
    if (!showIndex) {
      if (brands.length) {
        showIndex = 1
      } else if (facilities.length) {
        showIndex = 2
      } else {
        showIndex = 3
      }
    }
    return (
      <div className='shaixuan-container'>
        <div className='list-container'>
          {
            brands.length > 0 ?
              <div className='brands-box main-container'>
                <div className={ showIndex === 1 ? 'choosen main-title' : 'main-title' } onClick={ () => this.setState({ showIndex: 1 }) }>品牌</div>
                <div className='main-list-box' style={{ display: showIndex === 1 ? 'block' : 'none' }}>
                  {
                    brands.map(({ id, name }) => {
                      return (
                        <div className={ BrandId.filter(i => { return i === id })[0] ? 'choosenBox main-box' : 'main-box' } onClick={ () => this.chooseBrandId(id) } key={ id }>{ name }</div>
                      )
                    })
                  }
                </div>
              </div>
            : ''
          }
          {
            facilities.length > 0 ?
              <div className='facilities-box main-container'>
                <div className={ showIndex === 2 ? 'choosen main-title' : 'main-title' } onClick={ () => this.setState({ showIndex: 2 }) }>设施</div>
                <div className='main-list-box' style={{ display: showIndex === 2 ? 'block' : 'none' }}>
                  {
                    facilities.map(({ id, name }) => {
                      return (
                        <div className={ Facilities.filter(i => { return i === id })[0] ? 'choosenBox main-box' : 'main-box' } onClick={ () => this.chooseFacilities(id) } key={ id }>{ name }</div>
                      )
                    })
                  }
                </div>
              </div>
            : ''
          }
          {
            themes.length > 0 ?
              <div className='facilities-box main-container'>
                <div className={ showIndex === 3 ? 'choosen main-title' : 'main-title' } onClick={ () => this.setState({ showIndex: 3 }) }>主题</div>
                <div className='main-list-box' style={{ display: showIndex === 3 ? 'block' : 'none' }}>
                  {
                    themes.map(({ id, name }) => {
                      return (
                        <div className={ ThemeIds.filter(i => { return i === id })[0] ? 'choosenBox main-box' : 'main-box' } onClick={ () => this.chooseThemeIds(id) } key={ id }>{ name }</div>
                      )
                    })
                  }
                </div>
              </div>
            : ''
          }
        </div>
        <div className='btn-container'>
          <span onClick={ () => this.cleanArr() }>清空</span>
          <span onClick={ () => this.confirmArr() }>确定</span>
        </div>
      </div>
    )
  }
}

export default Shaixuan
