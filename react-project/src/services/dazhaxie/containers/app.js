import { connect } from 'react-redux'
import { wrap }    from '@boluome/oto_saas_web_app_component'
import { login, customerCode, customerConfig } from 'business'
import { setServerUrl, log }  from '@boluome/common-lib'
import App         from '../components/app'

const mapStateToProps = ({ app }) => ({ ...app })

const mapDispatchToProps = dispatch => ({ dispatch })

const mapFunToComponent  = () => ({
  componentDidMount: () => {
    setServerUrl(/192.168.|localhost/.test(location.hostname) ? 'https://dev-api.otosaas.com' : `${ location.origin }/api`)
    customerConfig(customerCode, err => {
      if (err) {
        log('customer config err', err)
      }
      login((err2, { customerUserId }) => {
        if (err2) {
          console.log(err2)
        } else {
          const code = customerCode
          console.log(customerUserId, code)
          location.replace(`http://wx.ychp.cn/dazhaxie/SaaS/?customerUserId=${ customerUserId }&appCode=${ code }`)
        }
      })
    })
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(App)
)
