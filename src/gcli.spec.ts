import { String } from './gcli.utils'

describe('Gcli: String util', () => {
  it('toPascalCase returns valid', () => {
    expect(String.toPascalCase('component-name')).toBe('ComponentName')
    expect(String.toPascalCase('_component-name')).toBe('ComponentName')
  })
})
