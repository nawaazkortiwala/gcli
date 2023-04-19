import { Args } from '../../gcli.types'
import { guirAdd } from './commands/guir-add'
import guirRemove from './commands/guir-remove/guir-remove'
import store from './guir.store'
import { GuirNS } from './guir.types'
import { getGuirCommand, getGuirGlobalConfig, guirHelper } from './guir.utils'

function guir(args: Args) {
  /**
   * Acquire global config or quit
   */
  const { error, globalConfig } = getGuirGlobalConfig()
  if (error) return guirHelper({ template: 'Could not load config file', isError: true })

  /**
   * Set global config to store
   */
  store.setState({ globalConfig })

  const command = getGuirCommand(args as Array<GuirNS.CommandKey>)
  const commandArgs = args.slice(1)

  switch (Object.keys(command)[0] as GuirNS.CommandKey) {
    case 'add':
      guirAdd(commandArgs)
      break
    case 'remove':
      guirRemove(commandArgs)
      break
    default:
      return guirHelper({ template: 'Show help', isEmpty: true })
  }
}

export default guir
