import { connect } from 'react-redux'
import { wrap, Mask } from '@boluome/oto_saas_web_app_component'
import PicshowCom from '../components/picshow'

const mapStateToProps = state => {
  const { Picshow, details } = state
  console.log('PIC----', state, Picshow)
  const { PicshowData, PicshowIndex, isorno } = details
  const { width, height } = Picshow
  // console.log('width----', width)
  return {
    PicshowData,
    PicshowIndex,
    isorno,
    width,
    height,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleIndex: PicshowIndex => { // console.log(PicshowIndex)
      dispatch({
        type: 'CHOOSE_IMGINDEX',
        PicshowIndex,
      })
    },

  }
}

const mapFunToComponent  = dispatch => ({
  componentDidMount: () => {
    // console.log('dispatch', dispatch)
  },
  componentDidUpdate: () => {
    const obj1 = document.getElementsByClassName('picitemDemo')[0]
    if (obj1) {
      dispatch({ type: 'DIV_WIDTH', width: obj1.clientWidth })
      dispatch({ type: 'DIV_HEIGHT', height: obj1.clientHeight })
      console.log('wwwww---------obj1.clientWidth=', obj1.clientWidth)
    }
  },
  componentWillUnmount() {
    Mask.closeAll()
    const num = document.getElementsByClassName('mask-container').length
    for (let i = 0; i < num; i++) {
      document.getElementsByClassName('mask-container')[0].parentNode.remove()
    }
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(PicshowCom)
)
