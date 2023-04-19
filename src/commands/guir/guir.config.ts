import { GuirNS } from './guir.types'

export const guirCommandKeys: Array<GuirNS.CommandKey> = [
  'add',
  'desc',
  'list',
  'move',
  'remove',
  'rename',
]

export const guirComponentMapFilename = '.guir-map'

export const guirScreens: Array<GuirNS.ScreenType> = ['xs', 'sm', 'md', 'lg', 'xl']

export const guirScreenDirName = 'screens'

export const guirNestedComponentDirName = 'components'

export const guirRegex = {
  component: /^[a-zA-z_]+[\w\W.-]*$/,
}

export const guirScreenOrder: Record<GuirNS.ScreenType, number> = {
  xs: 0,
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
}
