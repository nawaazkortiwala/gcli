export namespace GuirAddNS {
  export enum OptionKeysEnum {
    bare = 'bare',
    override = 'override',
    path = 'path',
    screens = 'screens',
    screenSelective = 'screenSelective',
    component = 'component',
  }
  export type BoolOptionsMap = {
    [OptionKeysEnum.bare]: boolean
    [OptionKeysEnum.override]: boolean
  }
  export type ValueOptionMap = {
    [OptionKeysEnum.path]: string
    [OptionKeysEnum.screens]: string
    [OptionKeysEnum.screenSelective]: string
    [OptionKeysEnum.component]: string
  }
  export type OptionMap = {
    boolOptions: GuirAddNS.BoolOptionsMap
    valueOptions: GuirAddNS.ValueOptionMap
  }
}
