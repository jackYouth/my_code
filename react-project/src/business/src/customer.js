/*
 * 根据 type 来获取 bridge 或 customize 或 process 对象
 */
export default (
  type => {
    const { OTO_SAAS = {} } = window
    const { customer = {} } = OTO_SAAS
    const { bridge = {}, customize = {}, process = {} } = customer
    return typeof type === 'string' ? { bridge, customize, process }[type] : customer
  }
)
