import { guirRegex, guirScreens } from '../../guir.config'

export const guirAddRegex = {
  ...guirRegex,
  boolOptions: {
    bare: /^(\-b|\-\-bare)$/,
    override: /^(\-o|\-\-override)$/,
  },
  valueOptions: {
    path: {
      flag: /^(\-p|\-\-path)$/,
      value: /^(\.\/)?(([a-zA-z_]+[0-9-.]*[a-zA-z_]*)(\/)?)+$/,
    },
    screens: {
      flag: /^(\-s|\-\-screens)$/,
      value: new RegExp(
        `^(${guirScreens.map((screen) => screen).join('|')}):(${guirScreens
          .map((screen) => screen)
          .join('|')})$`
      ), // basically -> /^(xs|sm|md|lg|xl):(xs|sm|md|lg|xl)$/
    },
    screenSelective: {
      flag: /^(\-ss|\-\-screenSelective)$/,
      value: `^(${guirScreens.map((screen) => screen).join('|')})\\s*(,\\s*(${guirScreens
        .map((screen) => screen)
        .join('|')}))*$`,
    },
    component: {
      flag: /^(\-c|\-\-component)$/,
      value: /^[a-zA-z_]+[\w\W.-]*$/,
    },
  },
}

export const guirAddOptionShortHand = ['b', 'o', 'p', 's', 'c', 'ss']
