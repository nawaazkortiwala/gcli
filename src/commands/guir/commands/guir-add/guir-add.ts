import { log, logError } from '../../../../gcli.utils'
import { GuirNS } from '../../guir.types'
import { getMatchedArg, guirHelper, GuirMap, isArgsEmpty } from '../../guir.utils'
import { guirAddRegex } from './guir-add.config'
import { GuirAddNS } from './guir-add.types'
import { BuildComponent, Options } from './guir-add.utils'

const guirAdd: GuirNS.GuirAdd = (args) => {
  // const guirGlobalConfig = getGuirGlobalConfig()
  try {
    if (isArgsEmpty(args)) {
      throw new Error('argsEmpty')
    }

    /**
     * Gets the component name
     */
    const { error: componentNameError, match: componentName } = getMatchedArg(
      args[0],
      guirAddRegex.component
    )

    if (componentNameError) {
      throw new Error('componentNameInvalid')
    }

    const optionsObj = new Options(args)
    /**
     * Gets the options
     */
    const { error: optionError, ...options } = optionsObj.getOptions()
    console.log(options)

    if (optionError) {
      throw new Error('optionsInvalid')
    }

    /**
     * Validate options
     */
    const { error: optionValidationError } = optionsObj.validateOptions(
      options as GuirAddNS.OptionMap,
      args.slice(1)
    )

    if (optionValidationError) {
      throw new Error('optionsValidationError')
    }
    /**
     * Add component to FS
     */
    const buildComponent = new BuildComponent(
      componentName as string,
      options as GuirAddNS.OptionMap
    )
    // buildComponent.build
    // const { error: buildError } = { error: false }

    const { error: buildError, buildConfig } = buildComponent.build()

    if (buildError) {
      throw new Error('buildError')
    }

    /**
     * Adding component to map file.
     */
    const { error: mapAdditionError } = GuirMap.addComponent(
      buildConfig as GuirNS.GuirMapConfigNode
    )

    if (mapAdditionError) {
      throw new Error('mapAdditionError')
    }

    log(`✅ Component "${componentName}" created!`)

    return {
      error: false,
    }
  } catch (error) {
    logError('Failed to create component.')
    guirHelper({ template: error.message, isError: true })

    return { error: true }
  }
}

export default guirAdd
