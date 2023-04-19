import { Args, AssertType, ReturnType } from '../../../../gcli.types'
import { File, logError, Path, String } from '../../../../gcli.utils'
import {
  guirNestedComponentDirName,
  guirScreenDirName,
  guirScreenOrder,
  guirScreens,
} from '../../guir.config'
import store from '../../guir.store'
import { GuirNS } from '../../guir.types'
import { Component, getMatchedArg, GuirMap, Template } from '../../guir.utils'
import { guirAddOptionShortHand, guirAddRegex } from './guir-add.config'
import { GuirAddNS } from './guir-add.types'

/**
 * Gets standalone options
 */
export class Options {
  args: Args = []

  constructor(args: Args) {
    this.args = args
  }

  /**
   * Returns the start and end index of the given screen range.
   */
  static getScreenIndices(screenRange: string) {
    const splitter = (screenRange.match(/(:|&)/) as any)[0]
    const [startRange, endRange] = screenRange.split(splitter) as [string, string]
    const startRangeIndex = guirScreens.findIndex((screen) => screen === startRange)
    const endRangeIndex = guirScreens.findIndex((screen) => screen === endRange)

    return [startRangeIndex, endRangeIndex, splitter]
  }

  /**
   * Returns an array of unique, screens
   */
  static getSelectiveScreens(screenSelective: GuirAddNS.ValueOptionMap['screenSelective']) {
    return Array.from(new Set(screenSelective.split(',').map((screen) => String.trim(screen))))
  }
  /**
   * Gets the standalone options
   */
  getBoolOption() {
    return this.args.reduce(
      (options, arg) => {
        if (getMatchedArg(arg, guirAddRegex.boolOptions.bare).match) options.bare = true
        if (getMatchedArg(arg, guirAddRegex.boolOptions.override).match) options.override = true
        return options
      },
      {
        bare: false,
        override: false,
      } as GuirAddNS.BoolOptionsMap
    )
  }

  /**
   * Gets the options with values
   */
  getValueOptions() {
    try {
      const options = this.args.reduce((options, arg, index) => {
        Object.keys(guirAddRegex.valueOptions).forEach((optionkey) => {
          const option =
            guirAddRegex.valueOptions[optionkey as keyof typeof guirAddRegex.valueOptions]

          // Match flag
          if (getMatchedArg(arg, option.flag).match) {
            // Check value validity
            const { error: valueError, match: value } = getMatchedArg(
              this.args[index + 1],
              option.value
            )

            if (valueError) throw new Error(`Invalid value supplied to ${arg} option.`)
            else options[optionkey as keyof typeof options] = value as string
          }
        })

        return options
      }, {} as GuirAddNS.ValueOptionMap)

      return {
        options,
      }
    } catch (error) {
      logError(error.message)
      return {
        error: true,
      }
    }
  }

  /**
   * Gets the bool and value options
   */
  getOptions(): ReturnType<{
    boolOptions: GuirAddNS.BoolOptionsMap
    valueOptions: GuirAddNS.ValueOptionMap
  }> {
    const boolOptions = this.getBoolOption()
    const { error, options: valueOptions } = this.getValueOptions()

    return {
      error,
      boolOptions,
      valueOptions,
    }
  }

  /**
   * Validate invalid options
   */
  validateInvalidOptions(
    {
      boolOptions,
      valueOptions,
    }: // _options
    {
      boolOptions: GuirAddNS.BoolOptionsMap
      valueOptions: GuirAddNS.ValueOptionMap
    },
    allArgs: Args
  ): ReturnType {
    const invalidOptions = allArgs
      // Get all options keys
      .filter((arg) => arg.match(/^\-/))
      // Remove the hyphens
      .map((arg) => arg.replace(/\-/g, ''))
      // // Get invalid args
      .filter(
        (arg) =>
          !Object.keys(boolOptions).includes(arg) &&
          !Object.keys(valueOptions).includes(arg) &&
          !guirAddOptionShortHand.includes(arg)
      )

    if (invalidOptions.length) {
      logError(`Invalid options supplied: ${invalidOptions.join(', ')}`)

      return {
        error: true,
      }
    }

    return {
      error: false,
    }
    // const validOptions = Object.keys(boolOptions).length + Object.keys(valueOptions).length * 2
    // const error = allArgs.length > validOptions

    // if (error) {
    //   logError()
    // }

    // return {
    //   error: allArgs.length > validOptions,
    // }
  }

  /**
   * Validates all boolean options
   */
  validateBoolOptions({
    boolOptions,
    valueOptions,
  }: {
    boolOptions: GuirAddNS.BoolOptionsMap
    valueOptions: GuirAddNS.ValueOptionMap
  }): ReturnType {
    if (boolOptions.bare && (valueOptions.screens || valueOptions.screenSelective)) {
      logError(
        `Options collision: -b | --${GuirAddNS.OptionKeysEnum.bare} options cannot be passed with -s | --${GuirAddNS.OptionKeysEnum.screens} options or with -ss | --${GuirAddNS.OptionKeysEnum.screenSelective} options. `
      )

      return {
        error: true,
      }
    }
    return {
      error: false,
    }
  }

  /**
   * Validates screen range
   */
  validateScreensOption({ screens }: GuirAddNS.ValueOptionMap): ReturnType {
    if (screens) {
      const [startRangeIndex, endRangeIndex] = Options.getScreenIndices(screens)

      if (startRangeIndex > endRangeIndex) {
        logError('Invalid range provided for -s | --screen option.')
        return {
          error: true,
        }
      }
    }

    return {
      error: false,
    }
  }

  /**
   * Validates screen specific option
   */
  validscreenSelectiveOption({ screenSelective, screens }: GuirAddNS.ValueOptionMap) {
    if (screenSelective) {
      if (screens) {
        logError(
          `Options collision: Either pass the -s | --${GuirAddNS.OptionKeysEnum.screens} option or the -ss | --${GuirAddNS.OptionKeysEnum.screenSelective} option. Got both.`
        )

        return { error: true }
      }

      return {
        error: !Options.getSelectiveScreens(screenSelective).length,
      }
    }

    return {
      error: false,
    }
  }

  /**
   * Validates path option
   */
  validatePathOption(valueOptions: GuirAddNS.ValueOptionMap) {
    /**
     * Only as any one from path and component options.
     */
    if (valueOptions.component && valueOptions.path) {
      logError(
        'Options collision: Either pass the -p | --path options or the -c | --component option. Got both.'
      )
      return {
        error: true,
      }
    }
    return {
      error: false,
    }
  }

  /**
   * Validates component option
   */
  validateComponentOption({ component }: GuirAddNS.ValueOptionMap) {
    if (component) {
      /**
       * Check if component exists in .guirmap
       */
      const { error } = GuirMap.hasComponent(component)

      if (error) {
        logError(
          `Invalid value provided for -c | --component options. Component named "${component}" does not exist.`
        )
        return { error: true }
      }
    }

    return { error: false }
  }

  validateValueOptions(valueOptions: GuirAddNS.ValueOptionMap) {
    return {
      error:
        this.validatePathOption(valueOptions).error ||
        this.validateScreensOption(valueOptions).error ||
        this.validscreenSelectiveOption(valueOptions).error ||
        this.validateComponentOption(valueOptions).error,
    }
  }

  validateOptions(
    options: {
      boolOptions: GuirAddNS.BoolOptionsMap
      valueOptions: GuirAddNS.ValueOptionMap
    },
    allArgs: Args
  ) {
    const { error: invalidOptionsError } = this.validateInvalidOptions(options, allArgs)
    const { error: boolOptionsError } = this.validateBoolOptions(options)
    const { error: valueOptionsError } = this.validateValueOptions(options.valueOptions)

    return {
      error: invalidOptionsError || boolOptionsError || valueOptionsError,
    }
  }
}

export const getGuirAddBoolOptions = (args: Array<string>): GuirAddNS.BoolOptionsMap => {
  return args.reduce(
    (options, arg) => {
      if (getMatchedArg(arg, guirAddRegex.boolOptions.bare).match) options.bare = true
      if (getMatchedArg(arg, guirAddRegex.boolOptions.override).match) options.override = true
      return options
    },
    {
      bare: false,
      override: false,
    } as GuirAddNS.BoolOptionsMap
  )
}

/**
 * Gets the options with values
 */
export const getGuirAddValueOptions = (
  args: Array<string>
): ReturnType<{
  options: GuirAddNS.ValueOptionMap
}> => {
  try {
    const options = args.reduce(
      (options, arg, index) => {
        Object.keys(guirAddRegex.valueOptions).forEach((optionkey) => {
          const option =
            guirAddRegex.valueOptions[optionkey as keyof typeof guirAddRegex.valueOptions]

          // Match flag
          if (getMatchedArg(arg, option.flag).match) {
            // Check value validity
            const { error: valueError, match: value } = getMatchedArg(args[index + 1], option.value)

            if (valueError) throw new Error(`Invalid value supplied to ${arg} option.`)
            else options[optionkey as keyof typeof options] = value as string
          }
        })
        return options
      },
      {
        path: '',
        screens: '',
      } as GuirAddNS.ValueOptionMap
    )

    return {
      options,
    }
  } catch (error) {
    logError(error.message)
    return {
      error: true,
    }
  }
}

/**
 * Builds the component and it's respective files.
 */
export class BuildComponent {
  componentName = ''
  relativeComponentDirPath = ''
  absoluteComponentDirPath = ''
  boolOptions: GuirAddNS.BoolOptionsMap = {
    bare: false,
    override: false,
  }
  valueOptions: GuirAddNS.ValueOptionMap = {
    path: '',
    screens: '',
    screenSelective: '',
    component: '',
  }

  constructor(componentName: string, options: GuirAddNS.OptionMap) {
    this.componentName = componentName
    this.boolOptions = options.boolOptions
    this.valueOptions = options.valueOptions
    this.setPaths(componentName)
    // console.log(this.absoluteComponentDirPath)
    // console.log(this, this.relativeComponentDirPath)
  }

  /**
   * Path name with the following:
   * - root-dir from the config
   * - the optional path
   * - component name
   */
  setPaths(componentName: string) {
    let dirPath: string

    /**
     * Assign component option path from map
     */
    if (this.valueOptions.component) {
      const { error: componentOptionPathError, path } = GuirMap.getComponentPath(
        this.valueOptions.component
      ) as AssertType<{ path: string }>

      if (componentOptionPathError) {
        throw new Error(`Failed to get component ${this.valueOptions.component} path.`)
      }

      /**
       * Add the sub-component directory name
       */
      dirPath = Path.joinPath(path, guirNestedComponentDirName, componentName)
    } else {
      /**
       * Assigning path from config and component name
       */
      dirPath = Path.joinPath(this.valueOptions.path || '', componentName)
    }
    this.relativeComponentDirPath = dirPath
    this.absoluteComponentDirPath = Path.getPath(store.getState().globalConfig.rootDir, dirPath)
  }

  /**
   * Creating the directory recursively.
   * Overrides (by removing and re-creating) existing if override option provided.
   */
  makeComponentDir() {
    const { error: createDirError } = File.mkdir(this.absoluteComponentDirPath, {
      force: this.boolOptions.override,
    })

    if (createDirError) {
      throw new Error('Failed to create directory.')
    }
  }

  /**
   * Creates the directory for storing screen files.
   */
  makeScreenDir() {
    const screenDirPath = Path.joinPath(this.absoluteComponentDirPath, guirScreenDirName)
    const { error: createDirError } = File.mkdir(screenDirPath)

    if (createDirError) {
      throw new Error('Failed to create sub-directories.')
    }
  }

  /**
   * Gets a list of screen sizes to add to the component based on the supplied options
   */
  getScreens() {
    // For screen range
    if (this.valueOptions.screens) {
      const [startRangeIndex, endRangeIndex] = Options.getScreenIndices(this.valueOptions.screens)

      return guirScreens.slice(startRangeIndex, endRangeIndex + 1)
    }
    // For specific screens
    if (this.valueOptions.screenSelective) {
      const screens = Options.getSelectiveScreens(this.valueOptions.screenSelective)

      // Order the screens as per the defined screen order
      screens.sort((a, b) => {
        return guirScreenOrder[a as GuirNS.ScreenType] > guirScreenOrder[b as GuirNS.ScreenType]
          ? 1
          : -1
      })

      return screens as Array<GuirNS.ScreenType>
    }

    return guirScreens
  }

  /**
   * Creates the screen files
   */
  makeScreenDirFiles(screens: Array<GuirNS.ScreenType>) {
    screens.forEach((screen) => {
      const screenFilePath = Path.joinPath(
        this.absoluteComponentDirPath,
        guirScreenDirName,
        Component.getScreenFilename(this.componentName, screen)
      )

      const { error: createDirError } = File.writeFile(
        screenFilePath,
        Template.getScreenTemplate(this.componentName, screen)
      )

      if (createDirError) {
        throw new Error('Failed to create files.')
      }
    })

    const screenIndexFilePath = Path.joinPath(
      this.absoluteComponentDirPath,
      guirScreenDirName,
      'index.ts'
    )

    // console.log(Template.getScreenIndexTemplate(this.componentName, screens))

    const { error: writeIndexFileError } = File.writeFile(
      screenIndexFilePath,
      Template.getScreenIndexTemplate(this.componentName, screens)
    )

    if (writeIndexFileError) {
      throw new Error('Failed to create files.')
    }
  }

  /**
   * Creates the component file
   */
  makeComponentFiles(screens: Array<GuirNS.ScreenType>) {
    const componentFilePath = Path.joinPath(
      this.absoluteComponentDirPath,
      Component.getComponentFilename(this.componentName)
    )

    const { error: createDirError } = File.writeFile(
      componentFilePath,
      Template.getComponentTemplate(this.componentName, screens)
    )

    if (createDirError) {
      throw new Error('Failed to create files.')
    }
  }

  /**
   * Create index file for exports
   */
  makeIndexFile() {
    const componentFilePath = Path.joinPath(this.absoluteComponentDirPath, 'index.ts')

    const { error: writeIndexFileError } = File.writeFile(
      componentFilePath,
      Template.getIndexFileTemplate(this.componentName)
    )

    if (writeIndexFileError) {
      throw new Error('Failed to create files.')
    }
  }

  /**
   * Builds the directories and files for the component
   */
  build(): ReturnType<{
    buildConfig: GuirNS.GuirMapConfigNode
  }> {
    try {
      // Make component dir
      this.makeComponentDir()

      // No screens if bare option is passed
      if (!this.boolOptions.bare) {
        // Make sub dir
        this.makeScreenDir()
        // Make sub dir files
        const screens = this.getScreens()
        this.makeScreenDirFiles(screens)
        // Make component file
        this.makeComponentFiles(screens)
      } else {
        // Make component file
        this.makeComponentFiles([])
      }

      // Make index file
      this.makeIndexFile()
      return {
        error: false,
        buildConfig: {
          name: this.componentName,
          path: this.relativeComponentDirPath,
          component: this.valueOptions.component,
        },
      }
    } catch (error) {
      logError(error.message)
      return {
        error: true,
      }
    }
  }
}
