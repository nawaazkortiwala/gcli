import { guirCommandKeys, guirComponentMapFilename, guirScreenDirName } from './guir.config'
import { GuirNS } from './guir.types'
import { globalConfigFilename } from '../../gcli.config'
import { File, logError, Path, String } from '../../gcli.utils'
import { Args, AssertType, GlobalConfig, ReturnType } from '../../gcli.types'
import store from './guir.store'

/**
 * Returns the "guir" config from the global file at root.
 */
export const getGuirGlobalConfig = (): ReturnType<{
  globalConfig: GlobalConfig['guir']
}> => {
  try {
    const globalConfigFilePath = Path.getPath(globalConfigFilename)

    if (File.doesFileExist(globalConfigFilePath)) {
      const globalConfig = require(globalConfigFilePath)

      return {
        globalConfig: globalConfig.guir,
      }
    } else return { error: true }
  } catch (error) {
    logError(error.message as string)

    return { error: true }
  }
}

/**
 * Prints help text
 */
export const guirHelper = ({
  template,
  isEmpty,
  isError,
}: {
  template: string
  isEmpty?: boolean
  isError?: boolean
}) => {
  console.log(template, isEmpty, isError)
}

/**
 * Return the commands supplied to guir and follwing values.
 */
export const getGuirCommand: GuirNS.GetCommand = (args) => {
  return args.reduce((baseCommand, baseCommandKey) => {
    const keyIndex = guirCommandKeys.findIndex((arg) => arg === baseCommandKey)
    if (keyIndex !== -1) baseCommand[baseCommandKey] = args.slice(1) // assign arguments after the base command
    return baseCommand
  }, {} as Partial<GuirNS.Command>)
}

/**
 * Checks arguments length
 */
export const isArgsEmpty = (args: Args): boolean => {
  return !args.length
}

/**
 * Matches the given argument against a regex
 */
export const getMatchedArg = (
  arg: string,
  regex: RegExp | string
): ReturnType<{
  match: string
}> => {
  if (arg) {
    const match = arg.match(regex)

    if (match) return { match: match[0] }
  }

  return {
    error: true,
  }
}

/**
 * Contains utility methods for working with a component
 */
export class Component {
  /**
   * Returns the component name in pascal case
   */
  static getComponentName(componentName: string) {
    return String.toPascalCase(componentName)
  }

  /**
   * Returns component's screen component name
   */
  static getScreenComponentName(componentName: string, screen: GuirNS.ScreenType) {
    return `${Component.getComponentName(componentName)}${String.toPascalCase(screen)}`
  }

  /**
   * Returns component's screen file name
   */
  static getScreenFilename(componentName: string, screen: GuirNS.ScreenType, extension = true) {
    return `${componentName}-${screen}${extension ? '.tsx' : ''}`
  }

  /**
   * Returns component's file name
   */
  static getComponentFilename(componentName: string, extension = true) {
    return `${componentName}${extension ? '.tsx' : ''}`
  }
}

/**
 * For generating component and subcomponent templates
 */
export class Template {
  static getIndexFileTemplate(componentName: string) {
    const ComponentName = Component.getComponentName(componentName)
    const template = `
export { default as ${ComponentName} } from './${Component.getComponentFilename(
      componentName,
      false
    )}'
    `
    return String.trim(template) + '\n'
  }
  /**
   * Generates and returns the component's file content
   */
  static getComponentTemplate(componentName: string, screens: Array<GuirNS.ScreenType>) {
    const ComponentName = Component.getComponentName(componentName)
    const template = `
import React, { FC } from 'react'
import { Render } from '@geoiq_io/components.responsive'
${
  screens.length
    ? `import { ${screens
        .map((screen) => `${Component.getScreenComponentName(componentName, screen)}`)
        .join(', ')} } from './${guirScreenDirName}'
`
    : ''
}
const ${ComponentName}: FC = () => {

  return <Render base={<></>}${screens
    .map((screen) => ` ${screen}={<${Component.getScreenComponentName(componentName, screen)} />}`)
    .join('')} />
}

export default ${ComponentName}
    `
    return String.trim(template) + '\n'
  }

  /**
   * Generates and returns the component's screen component's file content
   */
  static getScreenTemplate(componentName: string, screen: GuirNS.ScreenType) {
    const ComponentName = Component.getScreenComponentName(componentName, screen)
    const template = `
import React, { FC } from 'react'

const ${ComponentName}: FC = () => {
  return null
}

export default ${ComponentName}
    `
    return String.trim(template) + '\n'
  }

  /**
   * Generate screen directory's index file
   */
  static getScreenIndexTemplate(componentName: string, screens: Array<GuirNS.ScreenType>) {
    const template = `
${screens
  .map(
    (screen) =>
      `export { default as ${Component.getScreenComponentName(
        componentName,
        screen
      )} } from './${Component.getScreenFilename(componentName, screen, false)}'`
  )
  .join('\n')}
    `
    return String.trim(template) + '\n'
  }
}

/**
 * CRUD operation on the component map.
 * 1. Add a component
 * 2. Remove a component
 * 3. Updates name
 * 4. Update path
 */

export class GuirMap {
  /**
   * Gets the file path
   */
  static getFilePath() {
    return Path.getPath(guirComponentMapFilename)
  }

  /**
   * Creates the map file
   */
  static createFile(path: string): ReturnType {
    const { error } = File.writeFile(path, '{}')

    if (error) {
      logError('Failed to create map file.')
    }

    return { error }
  }

  /**
   * Reads and return the map config (parsed).
   * Create a new file if not present.
   */
  static getMap(): ReturnType<{
    map: GuirNS.GuirMapConfig
  }> {
    const path = GuirMap.getFilePath()
    if (!File.doesFileExist(path)) {
      GuirMap.createFile(path)
    }

    const { error, file } = File.readFile(path)

    if (error) {
      logError('Failed to read map file.')
      return { error }
    }

    try {
      return {
        map: JSON.parse(file as string) as GuirNS.GuirMapConfig,
      }
    } catch (error) {
      logError('Failed to parse map file.')

      return { error: true }
    }
  }

  /**
   * Creates map-specific config
   */
  static pushToMap(map: GuirNS.GuirMapConfig, config: GuirNS.GuirMapConfigNode) {
    return Object.assign(map, {
      [config.name]: config,
    })
  }

  /**
   * Pushes the config to the map file
   */
  static writeMap(map: GuirNS.GuirMapConfig): ReturnType {
    const path = GuirMap.getFilePath()
    const { error } = File.writeFile(path, JSON.stringify(map, null, 2))

    if (error) {
      logError('Failed to write to map file.')
    }

    return { error }
  }

  static addComponent(config: GuirNS.GuirMapConfigNode): ReturnType {
    const { error: mapAcquireError, map } = GuirMap.getMap()

    if (mapAcquireError) return { error: true }

    const { error: mapWriteError } = GuirMap.writeMap(
      GuirMap.pushToMap(map as GuirNS.GuirMapConfig, config)
    )

    if (mapWriteError) return { error: true }

    return { error: false }
  }

  static hasComponent(component: string): ReturnType {
    const { error, map } = GuirMap.getMap()

    if (error) {
      return {
        error: true,
      }
    }

    return {
      error: !(map as GuirNS.GuirMapConfig)[component],
    }
  }

  static getComponentPath(component: string): ReturnType<{
    path: string
  }> {
    const { error, map } = GuirMap.getMap() as AssertType<{ map: GuirNS.GuirMapConfig }>

    if (error) {
      return { error: true }
    }

    if (!map[component]) {
      logError('Component not found.')
      return {
        error: true,
      }
    }

    return {
      path: map[component].path,
    }
  }

  static getComponentAbsPath(component: string): ReturnType<{
    path: string
  }> {
    const { error, path: relativePath } = GuirMap.getComponentPath(component) as AssertType<{
      path: string
    }>

    if (error) {
      return { error: true }
    }

    return {
      path: Path.getPath(store.getState().globalConfig.rootDir, relativePath),
    }
  }
}
