const { hostname } = window.location

export default (
  () => (/^dev-|test|localhost|192.168/.test(hostname))
)
