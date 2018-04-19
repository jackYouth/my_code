const fs = require('fs')
const path = require('path')

const {
  existsSync: exists,
  writeFileSync: write,
  readdirSync: readDir,
  readFileSync: read,
  statSync: stat,
  mkdirSync: mkdir,
} = fs

const { resolve } = path

const serviceName = process.argv[2]

const ROOT_PATH = resolve('./')
const inputPath = resolve(ROOT_PATH, 'src', 'services', serviceName)
const filePath = resolve(ROOT_PATH, 'copyCode', `${ serviceName }.txt`)
write(filePath, '')

const isDir = path => stat(path).isDirectory()
const isFile = path => stat(path).isFile()
const tmpRep = (inPathContents, outPathContents, inPath) => `${ outPathContents }         \n \n \n \n ${ inPath } \n \n${ inPathContents }`

const creator = input => {
  const files = readDir(input)
  files.forEach(file => {
    const inPath = resolve(input, file)
    if (isDir(inPath)) {
      creator(inPath)
    } else if (isFile(inPath) && inPath.indexOf('DS_Store') < 0 && inPath.indexOf('.png') < 0 && inPath.indexOf('.jpg') < 0 && inPath.indexOf('.jqeg') < 0) {
      write(filePath, tmpRep(read(inPath, { encoding: 'utf8' }), read(filePath, { encoding: 'utf8' }), inPath.substr(inPath.indexOf(serviceName))))
    }
  })
  console.log('service creator complete')
}

creator(inputPath)
