import { getBaseCommand } from './gcli.utils'
import guir from './commands/guir/guir'
import { Args, BaseCommandKey } from './gcli.types'

function gcli() {
  const baseCommand = getBaseCommand()

  switch (Object.keys(baseCommand)[0] as BaseCommandKey) {
    case 'guir':
      guir(baseCommand.guir as Args)
      break
    case 'gpm':
    default:
      return (function helper() {
        console.log('[gcli]: Show help')
      })()
  }
}

export default gcli
