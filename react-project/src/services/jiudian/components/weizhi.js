import React, { Component } from 'react'
import { get }  from 'business'
import { Loading, Mask } from '@boluome/oto_saas_web_app_component'
import '../style/weizhi.scss'

class Weizhi extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Zone:       this.props.data.Zone,
      DistrictId: this.props.data.DistrictId,
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

  chooseZone(id) {
    // let { Zone = [] } = this.state
    // if (Zone.indexOf(id) === -1) {
    //   Zone.push(id)
    // } else {
    //   Zone = Zone.filter(i => i !== id)
    // }
    this.setState({ Zone: id })
  }

  chooseDistrictId(id) {
    // let { DistrictId = [] } = this.state
    // if (DistrictId.indexOf(id) === -1) {
    //   DistrictId.push(id)
    // } else {
    //   DistrictId = DistrictId.filter(i => i !== id)
    // }
    this.setState({ DistrictId: id })
  }

  cleanArr() {
    this.setState({ Zone: '', DistrictId: '' })
  }

  confirmArr() {
    const { weizhiChange } = this.props
    const { Zone = '', DistrictId = '' } = this.state
    weizhiChange({ Zone, DistrictId })
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
    const { info = {}, Zone = '', DistrictId = '', showIndex = 1 } = this.state
    const { commericalLocations = [], districts = [] } = info

    return (
      <div className='weizhi-container'>
        <div className='list-container'>
          {
            districts.length > 0 ?
              <div className='districts-box main-container'>
                <div className={ showIndex === 1 ? 'choosen main-title' : 'main-title' } onClick={ () => this.setState({ showIndex: 1 }) }>行政区</div>
                <div className='main-list-box' style={{ display: showIndex === 1 ? 'block' : 'none' }}>
                  {
                    districts.map(({ id, name }) => {
                      return (
                        <div className={ DistrictId === id ? 'choosenBox main-box' : 'main-box' } onClick={ () => this.chooseDistrictId(id) } key={ id }>{ name }</div>
                      )
                    })
                  }
                </div>
              </div>
            : ''
          }
          {
            commericalLocations.length > 0 ?
              <div className='commericalLocations-box main-container'>
                <div className={ showIndex === 2 ? 'choosen main-title' : 'main-title' } onClick={ () => this.setState({ showIndex: 2 }) }>商业区</div>
                <div className='main-list-box' style={{ display: showIndex === 2 ? 'block' : 'none' }}>
                  {
                    commericalLocations.map(({ id, name }) => {
                      return (
                        <div className={ Zone === id ? 'choosenBox main-box' : 'main-box' } onClick={ () => this.chooseZone(id) } key={ id }>{ name }</div>
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

export default Weizhi
