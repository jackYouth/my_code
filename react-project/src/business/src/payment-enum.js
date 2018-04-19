
import iconAlipay   from 'images/icon/ic_alipay.png'
import iconWx       from 'images/icon/ic_wechat.png'
import iconBlm      from 'images/icon.jpg'
// 支付渠道
export default {
  alipay: {
    name:    '支付宝钱包',
    code:    'alipay',
    icon:    iconAlipay,
    handler: 'pingpp',
    // effective: false,
    // remark: '暂不支持'
  },
  alipay_wap: {
    name:    '支付宝网页支付',
    code:    'alipay_wap',
    icon:    iconAlipay,
    handler: 'pingpp',
  },
  wx: {
    name:    '微信支付',
    code:    'wx',
    icon:    iconWx,
    handler: 'pingpp',
  },
  wx_pub: {
    name:    '微信公众号支付',
    code:    'wx_pub',
    icon:    iconWx,
    handler: 'pingpp',
  },
  allinpay_qianbao: {
    name:    '通联钱包',
    code:    'allinpay_qianbao',
    icon:    'http://ody9f2hax.bkt.clouddn.com/icon/payment/channel/allinpay_qianbao.jpg',
    handler: 'allinpay',
  },
  chubao_pay: {
    name:    '触宝钱包',
    code:    'chubao_pay',
    icon:    'http://app.static.boluomeet.com/icon/payment/channel/chubao_pay.png',
    handler: 'chubao',
  },
  jst_qianbao: {
    name:    '支付宝钱包',
    code:    'jst_qianbao',
    icon:    iconAlipay,
    handler: 'jst',
  },
  bosc: {
    name:    '上海银行',
    code:    'bosc',
    icon:    'http://app.static.boluomeet.com/icon/payment/channel/bosc.jpg',
    handler: 'mybosc',
  },
  '91ala': {
    name:    '51返呗',
    code:    '91ala',
    icon:    'http://app.static.boluomeet.com/icon/payment/channel/91ala.png',
    handler: 'ala',
  },
  blmsdk: {
    name:    '菠萝觅支付',
    code:    'blmsdk',
    icon:    iconBlm,
    handler: 'blmsdk',
  },
  'pingan-one': {
    name:    '平安一账通',
    code:    'pingan-one',
    icon:    '',
    handler: 'pinganOne',
  },
  autohome: {
    name:    '汽车之家',
    code:    'autohome',
    icon:    '',
    handler: 'autohome',
  },
  beebill: {
    name:   '蜜蜂管账',
    code:   'beebill',
    icon:   '',
    handle: 'beebill',
  },
}
