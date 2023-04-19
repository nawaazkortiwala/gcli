export type GlobalConfig = {
  guir?: {
    rootDir: string
  }
}

export type Args = Array<string>
export type BaseCommandKey = 'gpm' | 'guir'
export type BaseCommands = {
  [key in BaseCommandKey]: Args
}
export type GetBaseCommands = () => Partial<BaseCommands>
export type Log = (message: any) => void
export type LogError = (error: string | Error) => void
export type ReturnType<T extends object = {}> = {
  error?: boolean
} & Partial<T>
export type AssertType<T> = { error?: boolean } & T
