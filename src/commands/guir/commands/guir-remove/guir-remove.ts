import { AssertType } from '../../../../gcli.types'
import { log, logError } from '../../../../gcli.utils'
import { GuirNS } from '../../guir.types'
import { getMatchedArg, isArgsEmpty } from '../../guir.utils'
import { guirRemoveRegex } from './guir-remove.config'
import { RemoveComponent, getRemoveConfirmation } from './guir-remove.utils'

const guirRemove: GuirNS.GuirRemove = (args) => {
  try {
    if (isArgsEmpty(args)) {
      throw new Error('argsEmpty')
    }

    /**
     * Gets the component name
     */
    const { error: componentNameError, match: componentName } = getMatchedArg(
      args[0],
      guirRemoveRegex.component
    ) as AssertType<{ match: string }>

    if (componentNameError) {
      throw new Error('componentNameInvalid')
    }

    /**
     * Show confirmation prompt
     */
    const { error: removeConfirmationError, shouldRemove } = getRemoveConfirmation()

    if (removeConfirmationError) throw new Error('confirmationError')

    if (shouldRemove) {
      /**
       * Remove component
       */
      const removeComponentObj = new RemoveComponent(componentName)
      const { error: removeComponentError } = removeComponentObj.remove()

      if (removeComponentError) throw new Error('removeError')

      log(`✅ Component "${componentName}" removed!`)
    }

    return {
      error: false,
    }
  } catch (error) {
    // guirHelper({ template: error.message, isError: true })
    logError('Failed to remove component.')

    return { error: true }
  }
}

export default guirRemove
