import { resolve } from 'path'

import { SRC_PATH, SVC_PATH, MODULE_PATH, IMG_PATH, SVG_PATH } from '../../path.config'

export default (
  {
   'images'   : IMG_PATH,
   'svg'      : SVG_PATH,
   'services' : SVC_PATH,
   'business' : resolve(SRC_PATH, 'business'),
   'customize': resolve(SRC_PATH, 'common', 'customize'),
   'styles'   : resolve(SRC_PATH, 'styles')
 }
)
