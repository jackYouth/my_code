import { connect } from 'react-redux'
import { wrap, Loading }    from '@boluome/oto_saas_web_app_component'
import { login, customerCode, customerConfig, get } from 'business'
import { setServerUrl, log }  from '@boluome/common-lib'
import App         from '../components/app'

const mapStateToProps = ({ app }) => ({ ...app })

const mapDispatchToProps = dispatch => ({ dispatch })

const mapFunToComponent  = () => ({
  componentDidMount: () => {
    const handleClose = Loading()
    setServerUrl(/192.168.|localhost/.test(location.hostname) ? 'https://dev-api.otosaas.com' : `${ location.origin }/api`)
    customerConfig(customerCode, err => {
      if (err) {
        log('customer config err', err)
      }
      login((err2, { customerUserId, userPhone }) => {
        if (err2) {
          console.log(err2)
        } else {
          const appCode = customerCode
          get('/medicine/v1/indexUrl', { customerUserId, userPhone, appCode })
          .then(({ code, data = {}, message }) => {
            if (code === 0) {
              location.replace(data)
              console.log(data)
            } else {
              handleClose()
              console.log(message)
            }
          }).catch(err3 => {
            console.log(err3)
          })
        }
      })
    })
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(App)
)
