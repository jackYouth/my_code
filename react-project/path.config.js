import path from 'path'

export const ROOT_PATH   = path.resolve(__dirname)
export const SRC_PATH    = path.resolve(ROOT_PATH, 'src')
export const SVC_PATH    = path.resolve(SRC_PATH , 'services')
export const DIST_PATH   = path.resolve(ROOT_PATH, 'dist')
export const IMG_PATH    = path.resolve(SRC_PATH, 'images')
export const SVG_PATH    = path.resolve(IMG_PATH, 'svg')
export const ASSET_PATH  = path.resolve(ROOT_PATH, 'assets')
export const MODULE_PATH = path.resolve(ROOT_PATH, 'node_modules')
