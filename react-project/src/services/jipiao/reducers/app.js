import { mergeState } from '@boluome/common-lib'

const n = new Date()
const y = n.getFullYear()
const m = n.getMonth()
const d = n.getDate()
const initialState = {
  fromCity: '上海',
  toCity:   '北京',
  cabin:    ['ALL'],
  date:     `${ y }-${ m + 1 }-${ d }`,
  cityHot:  [
    { code: 'PEK', name: '北京', py: 'bj', airport: '首都国际机场', jp: 'sdgjjc' },
    { code: 'SHA', name: '上海', py: 'sh', airport: '虹桥机场', jp: 'hqjc' },
    { code: 'CKG', name: '重庆', py: 'cq', airport: '江北国际机场', jp: 'jbgjjc' },
    { code: 'KMG', name: '昆明', py: 'km', airport: '长水机场', jp: 'csjc' },
    { code: 'CTU', name: '成都', py: 'cd', airport: '双流国际机场', jp: 'slgjjc' },
    { code: 'XIY', name: '西安', py: 'xa', airport: '咸阳国际机场', jp: 'xygjjc' },
    { code: 'SZX', name: '深圳', py: 'sz', airport: '宝安国际机场', jp: 'bagjjc' },
    { code: 'XMN', name: '厦门', py: 'xm', airport: '高崎国际机场', jp: 'gqgjjc' },
    { code: 'HGH', name: '杭州', py: 'hz', airport: '萧山国际机场', jp: 'xsgjjc' },
    { code: 'TAO', name: '青岛', py: 'qd', airport: '流亭国际机场', jp: 'ltgjjc' },
    { code: 'HRB', name: '哈尔滨', py: 'heb', airport: '太平国际机场', jp: 'tpgjjc' },
    { code: 'CGO', name: '郑州', py: 'zz', airport: '新郑国际机场', jp: 'xzgjjc' },
    { code: 'CAN', name: '广州', py: 'gz', airport: '新白云国际机场', jp: 'xbygjjc' },
    { code: 'HAK', name: '海口', py: 'hk', airport: '美兰国际机场', jp: 'mlgjjc' },
    { code: 'KWE', name: '贵阳', py: 'gy', airport: '龙洞堡国际机场', jp: 'ldbgjjc' },
    { code: 'CSX', name: '长沙', py: 'cs', airport: '黄花国际机场', jp: 'hhgjjc' },
    { code: 'URC', name: '乌鲁木齐', py: 'wlmq', airport: '地窝堡机场', jp: 'dwbjc' },
    { code: 'TNA', name: '济南', py: 'jn', airport: '遥墙国际机场', jp: 'yqgjjc' },
    { code: 'TSN', name: '天津', py: 'tj', airport: '滨海国际机场', jp: 'bhgjjc' },
    { code: 'NKG', name: '南京', py: 'nj', airport: '禄口国际机场', jp: 'lkgjjc' },
  ],
}

const app = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_RESET':
      return mergeState(state, action)
    default: return state
  }
}

export default app
