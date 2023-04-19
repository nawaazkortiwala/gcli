import { Args, ReturnType } from '../../gcli.types'

export namespace GuirNS {
  export type GlobalConfig = {
    rootDir: string
  }
  export type GuirMapConfigNode = {
    name: string
    path: string
    component: string
  }

  export type GuirMapConfig = Record<string, GuirMapConfigNode>
  export type CommandKey = 'add' | 'list' | 'desc' | 'move' | 'remove' | 'rename'
  export type Command = Record<CommandKey, Args>
  export type GetCommand = (args: Array<CommandKey>) => Partial<Command>
  export type Store = {
    globalConfig: GlobalConfig
  }
  export enum ScreenTypeEnum {
    xs = 'xs',
    sm = 'sm',
    md = 'md',
    lg = 'lg',
    xl = 'xl',
  }
  export type ScreenType = `${GuirNS.ScreenTypeEnum}`

  export type GuirAdd = (args: Args) => ReturnType
  export type GuirRemove = (args: Args) => ReturnType
}
