const fs   = require('fs')
const path = require('path')
const pkg  = require('../package.json')


const {
  existsSync    : exists,
  mkdirSync     : mkdir,
  writeFileSync : write,
  readdirSync   : readDir ,
  readFileSync  : read,
  statSync      : stat
} = fs

const { resolve } = path
//定义log方法
const log = (...args) => console.log(...args)
//获取传入的参数
const SERVICE_NAME = process.argv[2]
const PORT         = process.argv[3]
//判断是否指定服务名
if(!!!SERVICE_NAME) {
  log('service name is undefined')
  return
}

log(process)

//路径配置
const ROOT_PATH = resolve('./')
const MAIN_PATH = resolve(ROOT_PATH, 'src', 'services', SERVICE_NAME)
const CONF_PATH = resolve(ROOT_PATH, 'config', SERVICE_NAME)
const CONF_FILE = resolve(CONF_PATH, 'webpack.config.babel.js').replace(__dirname.replace('/creator', ''), '.')
const PKG_FILE  = resolve(ROOT_PATH, 'package.json')
const TMP_PATH  = resolve(__dirname, 'template')
//判断服务是否已被创建
if(exists(MAIN_PATH) || exists(CONF_PATH)) {
  log('已经创建过', SERVICE_NAME)
  return
}
log('-----配置webpack-----')
//创建服务的webpack config文件夹
mkdir(CONF_PATH)

//配置服务的webpack config
if(!!PORT && !isNaN(PORT = parseInt(PORT))) {
  write(CONF_FILE,
`
import { define } from "../"
const config = define('${ SERVICE_NAME }')
config.devServer.port = ${ PORT }
export default config
`)
} else {
  write(CONF_FILE,
`
import { define } from "../"
export default define('${ SERVICE_NAME }')
`)
}

log(`webpack 配置成功\r\n\r\n-----配置package.json-----`)
//配置服务启动测试命令
pkg.scripts[SERVICE_NAME] =
`webpack-dev-server --config ${ CONF_FILE }`

//配置服务启动编译命令
pkg.scripts[`${ SERVICE_NAME }_build`] =
`NODE_ENV=production webpack --config ${ CONF_FILE } --progress --hide-modules`

//覆盖package.json
write(PKG_FILE, JSON.stringify(pkg, null, 4))
log(`package.json 配置成功\r\n\r\n-----配置开发目录-----\r\n`)

//创建开发目录及相关文件夹
mkdir(MAIN_PATH)

const isDir  = path     => stat(path).isDirectory()
const isFile = path     => stat(path).isFile()
const tmpRep = contents => contents.replace('{{ service }}', SERVICE_NAME)

const creator = (input, output) => {
  const files = readDir(input)
  files.forEach(file => {
    const inPath  = resolve(input, file)
    const outPath = resolve(output, file)
    if(isDir(inPath)) {
      mkdir(outPath)
      creator(inPath, outPath)
    } else if(isFile(inPath)) {
      write(outPath, tmpRep(read(inPath, { encoding: 'utf8' })))
    }
    console.log(`${ outPath.replace(ROOT_PATH, '') } 创建成功\r\n`)
  })
}

creator(TMP_PATH, MAIN_PATH)

log('开发目录创建成功\r\n')

log(
`-----开发目录-----
/src/services/${ SERVICE_NAME }\r\n
-----输出目录-----
/dist/${ SERVICE_NAME }\r\n
-----启动测试-----
npm run ${ SERVICE_NAME }\r\n
-----编译服务-----
npm run ${ SERVICE_NAME }_build\r\n
创建成功
`)
