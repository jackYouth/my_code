import { Loading } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { get } from 'business'

//  当服务改变时，获取当前的orgs
export const changeServer = ({ cityId, categoryId }) => dispatch => {
  // 全品类时，如果没有categoryId，默认shuifei
  if (categoryId === '') categoryId = '1001'
  const handleClose = Loading()
  const getUrl = `/shenghuojiaofei/v1/${ cityId }/categorie/${ categoryId }/orgs`
  get(getUrl, { channel: 'chinaums' }).then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'CHANGE_SERVER_DATA', orgs: data })
      handleClose()
    } else {
      handleClose()
      Toast.fail(message, 1)
    }
  }).catch(({ message }) => {
    console.log(message)
    handleClose()
  })
}
