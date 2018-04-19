import React from 'react'
import { WhiteSpace } from 'antd-mobile'
// import { Mask } from '@boluome/oto_saas_web_app_component'

class UserTips extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ...props,
    }
  }
  render() {
    return (
      <div className='userInfo'>
        <h4>1、随意购是什么？（随意买)</h4>
        <WhiteSpace />
        <p>随意购是一个您可以通过购买邻趣小邻哥的时间和配送能力来帮助您购买任何物品的平台。您可以使用随意购买任何东西，不论是您不知道哪里有卖的物品、没有时间购买的物品，还是您不便亲自配送的物品、急需的物品，统统都可以买。例 如：烟酒、姨妈巾、感冒药、路边小吃、早餐、情趣用品、隐形眼镜、生鲜、扑克牌等。只要在线下有卖的东西，您都可以购买。</p>
        <WhiteSpace size='lg' />
        <h4>2、随意购可以同时购买两样或多样商品吗？</h4>
        <WhiteSpace />
        <p>可以。例如：一包七星蓝莓爆珠和1个打火机；一个扫把和一个拖把。</p>
        <WhiteSpace size='lg' />
        <h4>3、随意购可以替他人购买商品吗？</h4>
        <WhiteSpace />
        <p>可以。只要更改一下收货人地址、姓名、手机号码即可。</p>
        <WhiteSpace size='lg' />
        <h4>4、随意购的服务时间？（随时买)</h4>
        <WhiteSpace />
        <p>24小时服务，全年无休。</p>
        <WhiteSpace size='lg' />
        <h4>5、随意购可以预约吗？</h4>
        <WhiteSpace />
        <p>可以，随意购支持当日订单和预约第二天订单。</p>
        <WhiteSpace size='lg' />
        <h4>6、不知道在哪里买怎么办？（随地买)</h4>
        <WhiteSpace />
        <p>(1) 知道购买地点可直接填写您希望小邻哥去的详细购买地点。</p>
        <p>(2) 不知道购买地址可以直接不填。如果您不知道商品的地址或者您不在乎哪里购买，您可以选择不填购买地址。机智的小邻哥会帮你找到合适的地方购买哟。</p>
        <WhiteSpace size='lg' />
        <h4>7、随意购可以购买异地的东西？</h4>
        <WhiteSpace />
        <p>不可以。随意购仅提供同城内的服务，目前仅支持上海、北
        京、广州、杭州四个城市，不支持跨城服务。</p>
        <WhiteSpace size='lg' />
        <h4>8、随意购服务费如何计算？</h4>
        <WhiteSpace />
        <p className='tit'>选择指定地址购买：</p>
        <p className='tit'>0-2公里：12元</p>
        <p className='tit'>2公里以上：每增加1公里增加2元，不满1公里按1公里计算</p>
        <p className='indent'>不知道或无所谓哪里购买：</p>
        <p className='indent'>默认16元（购买香烟默认12元）</p>
        <p className='indent'>跨江订单增加6元配送费。</p>
        <p className='tit'>夜间配送费：</p>
        <p className='indent'>21点-24点配送费上调1.2倍</p>
        <p className='indent'>0点-6点配送费上调1.4倍</p>
      </div>
    )
  }
}

export default UserTips
