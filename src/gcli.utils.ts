import * as path from 'path'
import * as fs from 'fs'
import { baseCommandsKeys } from './gcli.config'
import {
  BaseCommandKey,
  BaseCommands,
  GetBaseCommands,
  Log,
  LogError,
  ReturnType,
} from './gcli.types'

const promptSync = require('prompt-sync')()

/**
 * Gets the base command from the process.argv
 */
export const getBaseCommand: GetBaseCommands = () => {
  const args = process.argv.slice(2) as Array<BaseCommandKey>
  return args.reduce((baseCommand, baseCommandKey) => {
    const keyIndex = baseCommandsKeys.findIndex((arg) => arg === baseCommandKey)
    if (keyIndex !== -1) baseCommand[baseCommandKey] = args.slice(1) // assign arguments after the base command
    return baseCommand
  }, {} as Partial<BaseCommands>)
}

export const log: Log = (message) => {
  console.log(`[guir]: ${message}`)
}

export const logError: LogError = (error) => {
  console.error(`[guir]: ❌ ERROR: ${error}`)
}

/**
 * Provides methods to work with _path_
 */
export class Path {
  /**
   * Returns a path-resolved path
   */
  static getPath(...partial: Array<string>) {
    return path.resolve(...partial)
  }

  static joinPath(...partial: Array<string>) {
    return path.join(...partial)
  }
}

/**
 * Provides methods to work with _fs_
 */
export class File {
  /**
   * Read a given file and returns the content in string
   */
  static readFile(filePath: string): ReturnType<{ file: string }> {
    try {
      return {
        file: fs.readFileSync(filePath, {
          encoding: 'utf-8',
        }),
      }
    } catch (error) {
      logError(`Unable to read file from: ${path.basename(filePath)} at ${filePath}`)

      return {
        error: true,
      }
    }
  }

  /**
   * Checks if the file exists and return bool
   */
  static doesFileExist(path: string) {
    return fs.existsSync(path)
  }

  // /**
  //  * Checks if the file exits.
  //  * Returns file content in string is does, else and object with error bool
  //  */
  // static getFile(path: string): ReturnType<{
  //   file: string
  // }> {
  //   if (File.doesFileExist(path)) return
  //   return {
  //     file: File.readFile(path),
  //   }
  //   return {
  //     error: true,
  //   }
  // }

  /**
   * Parses string to JSON and return either the json or an error bool
   */
  static parseJsonFile<T = unknown>(
    fileString: string
  ): ReturnType<{
    json?: T
  }> {
    try {
      return {
        json: JSON.parse(fileString),
      }
    } catch (error) {
      logError(error.message)
      return { error: true }
    }
  }

  /**
   * Create a directory/folder in the file system or returns an error bool
   */
  static mkdir(
    dirPath: string,
    options?: {
      force?: boolean
    }
  ): ReturnType {
    try {
      /**
       * Do not create component dir if component already exists
       * and --override option is not provided.
       */
      if (File.doesFileExist(dirPath)) {
        if (!options?.force) {
          throw new Error(
            `Component at ${dirPath} already exists. If you wish to override the existing component, use the --override option.`
          )
        }
        /**
         * Remove the existing component directory and all it's content
         */
        fs.rmdirSync(dirPath, { recursive: true })
      }

      /**
       * Create component directory, recursively
       */
      fs.mkdirSync(dirPath, { recursive: true })

      return {
        error: false,
      }
    } catch (error) {
      logError(error.message)

      return {
        error: true,
      }
    }
  }

  /**
   * Write a file to file system or return an error bool
   */
  static writeFile(filePath: string, data: string): ReturnType {
    try {
      fs.writeFileSync(filePath, data)

      return { error: false }
    } catch (error) {
      logError(error.message)

      return { error: true }
    }
  }

  /**
   * Deletes directory recursively
   */
  static rmDir(dirPath: string) {
    try {
      fs.rmdirSync(dirPath, {
        recursive: true,
      })

      return { error: false }
    } catch (error) {
      logError(error.message)

      return { error: true }
    }
  }
}

export class String {
  /**
   * Converts string to  Pascal case format and returns.
   */
  static toPascalCase(value: string) {
    return value
      .split(/[_\-.]/)
      .filter((entry) => entry)
      .map((entry) => {
        const lowerCased = entry.toLowerCase()
        return lowerCased[0].toUpperCase() + lowerCased.slice(1)
      })
      .join('')
  }

  /**
   * Trims white-spaces and newlines from string and returns.
   */
  static trim(value: string) {
    return value.trim()
  }
}

export class Prompt {
  /**
   * Opens up a prompt
   */
  static prompt(message: string) {
    return promptSync(message)
  }
}
