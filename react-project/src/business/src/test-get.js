import api from './test-api'
import stringifyQuery from './stringify-query'

let realResponse
export default (
  (url, data, headers = {}, realFetch = false) => {
    const setCacheArr = ['waimai']
    if ('caches' in window && location.pathname.indexOf('lite-list') === -1 && setCacheArr.some(e => location.pathname.indexOf(e) > -1)) {
      // console.log('------support caches------')

      const fetchThem = () => {
        return caches.open(`${ location.pathname }`).then(cache => {
          return fetch(api(`${ url }${ data !== 'undefined' && stringifyQuery(data) }`), { headers })
          .then(response => {
            const resp = response.clone().json()
            realResponse = response.clone()
            return resp
          })
          .then(jsonR => {
            if (realResponse.status === 200 && jsonR.code === 0) {
              cache.put(api(`${ url }${ data !== 'undefined' && stringifyQuery(data) }`), realResponse)
            }
            return jsonR
          })
        })
      }

      return new Promise(resolve => {
        caches.open(`${ location.pathname }`).then(cache => {
          cache.matchAll().then(list => {
            if (list.length > 0) {
              const Arr = list.filter(e => {
                // console.log('timer----->', e.url, e.url === api(`${ url }${ data !== 'undefined' && stringifyQuery(data) }`), !realFetch, new Date().getTime() - (new Date(e.headers.get('Date')).getTime()) < 300000)
                if (e.url === api(`${ url }${ data !== 'undefined' && stringifyQuery(data) }`) && !realFetch && new Date().getTime() - (new Date(e.headers.get('Date')).getTime()) < 300000) {
                  return e
                }
                return false
              })
              if (Arr.length > 0) {
                return Arr[0].json().then(reply => resolve(reply))
              }
              return fetchThem().then(reply => resolve(reply))
            }
            fetchThem().then(reply => {
              resolve(reply)
            })
          })
        })
      })
    }
    console.log('------not support caches------')
    return fetch(
      api(`${ url }${ data !== 'undefined' && stringifyQuery(data) }`),
      { headers }
    ).then(resp => resp.json())
  }
)
