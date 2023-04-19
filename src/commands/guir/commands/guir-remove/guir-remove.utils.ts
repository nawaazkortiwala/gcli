import { AssertType, ReturnType } from '../../../../gcli.types'
import { File, Path, Prompt, log, logError } from '../../../../gcli.utils'
import { GuirNS } from '../../guir.types'
import { GuirMap } from '../../guir.utils'
import { GuirRemoveNS } from './guir-remove.types'

export class RemoveComponent {
  componentName: string = ''
  path: string = ''

  constructor(componentName: string) {
    this.componentName = componentName
  }

  setComponentPath() {
    const { error, path: partialPath } = GuirMap.getComponentAbsPath(
      this.componentName
    ) as AssertType<{ path: string }>

    if (error) {
      throw new Error("Could not get component's path.")
    }

    this.path = Path.getPath(partialPath)
  }

  validateComponentPath() {
    const pathValid = File.doesFileExist(this.path)

    if (!pathValid) {
      throw new Error('Could not locate component. Seems like it was manually deleted.')
    }
  }

  getMap(): ReturnType<{
    map: GuirNS.GuirMapConfig
  }> {
    const { error: getMapError, map } = GuirMap.getMap() as AssertType<{
      map: GuirNS.GuirMapConfig
    }>

    if (getMapError) {
      throw new Error('Could not update map file')
    }

    return {
      map,
    }
  }

  removeComponentDirectory() {
    const { error } = File.rmDir(this.path)

    if (error) {
      throw new Error('Failed to remove component directory and files.')
    }
  }

  removeRecursivelySubComponents(map: GuirNS.GuirMapConfig, componentName: string): ReturnType {
    const removables = Object.values(map).reduce((acc, componentObj) => {
      if (componentObj.component === componentName) acc.push(componentObj.name)
      return acc
    }, [] as Array<string>)

    if (removables.length === 0) {
      delete map[componentName]
    }

    if (removables.length) {
      removables.forEach((componentName) => {
        this.removeRecursivelySubComponents(map, componentName)
      })
      delete map[componentName]
    }

    return {
      error: false,
    }
  }

  updateMapFile(map: GuirNS.GuirMapConfig) {
    const { error } = this.removeRecursivelySubComponents(map, this.componentName)

    if (error) {
      throw new Error('Could not update map file.')
    }

    const { error: writeMapError } = GuirMap.writeMap(map)

    if (writeMapError) {
      throw new Error('Could not update map file.')
    }
  }

  remove(): ReturnType {
    try {
      /**
       * Sets component path from map
       */
      this.setComponentPath()

      /**
       * Validates the path of the component
       */
      this.validateComponentPath()

      /**
       * Get the map file
       */
      const { map } = this.getMap() as AssertType<{ map: GuirNS.GuirMapConfig }>

      /**
       * Remove component folder from fs
       */
      this.removeComponentDirectory()

      /**
       * Remove component from map file
       */
      this.updateMapFile(map)

      return { error: false }
    } catch (error) {
      logError(error.message)

      return { error: true }
    }
  }
}

export const getRemoveConfirmation = (): ReturnType<{
  shouldRemove: boolean
}> => {
  const decision = Prompt.prompt(
    'Are you sure you want to remove this component? This will remove all the files and directories under it. (Choose Y|y to continue, N|n to cancel): '
  )

  /**
   * When user enters a value
   */
  if (typeof decision === 'string') {
    switch (decision.toLowerCase() as GuirRemoveNS.PrompDecision) {
      case 'y':
        return {
          shouldRemove: true,
        }
      case 'n': {
        return {
          shouldRemove: false,
        }
      }
      default:
        logError('Invalid selection. Please retry with a valid choice.')

        return {
          error: true,
        }
    }
  } else {
    /**
     * When the user kills the prompt
     */
    log('Aborted')

    return {
      error: true,
    }
  }
}
