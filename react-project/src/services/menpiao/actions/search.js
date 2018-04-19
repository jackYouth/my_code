import { getStore } from '@boluome/common-lib' // get ,send ,
import { Loading } from '@boluome/oto_saas_web_app_component'
import { get, send } from 'business'

// 城市地址的请求

export const CityData = () => dispatch => {
  const handleClose = Loading()
  const cityUrl = '/menpiao/v1/city'
  const sendData = {
    channel : 'lvmama'
  }
  get( cityUrl , sendData ).then( reply => {
     const { code , data , message } = reply
     if( code == 0 ){//console.log('datacity-----',data);
          let cityarr = [];
          for(let i = 0 ; i < data.length ; i++){
              let obj = {};
              obj.name = data[i].city
              obj.py = data[i].pinyin
              obj.prov = data[i].province

              cityarr.push(obj);
          }
         dispatch({
             type: 'KJIN_CITY_DATA',
             citydata: cityarr
         })
     } else{
         console.log('数据请求失败');
     }
     handleClose()
  } )

}

export const fetchScenics = (data, cb) => {
  const handleClose = Loading()
  send('/menpiao/v1/scenics', data).then(reply => {
    const { code, data, message } = reply
    if(0 === code) {console.log('app_data1',data);
      cb(data)
    } else {
      console.log(message)
    }
    handleClose()
  })
}

// export const fetchScenicsTest = (data, cb) => {
//   const handleClose = Loading()
//   send('/menpiao/v1/scenics', data).then(reply => {
//     const { code, data, message } = reply
//     if(0 === code) {console.log('app_data2',data);
//       cb(data)
//     } else {
//       console.log(message)
//     }
//     handleClose()
//   })
// }


// 主题的数据请求

export const ThemeData = (city, item) => dispatch => {
     const handleClose = Loading()
     const themeUrl = '/menpiao/v1/'+ city +'/themes'
     const sendData = {
         channel : 'lvmama',
         city : city
     }
     get( themeUrl ,sendData ).then( reply => {
         const { code , data , message } = reply
         if( code == 0 ){// console.log('data-----',data);
             dispatch({
                 type: 'KJIN_THEMEDATA',
                 themeDatas: data
             })
         } else{
             console.log('数据请求失败');
         }
         handleClose()
     } )
}
