const { hostname } = window.location

export default (
  () => (/^stg-/.test(hostname))
)
