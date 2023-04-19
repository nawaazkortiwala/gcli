import { getMatchedArg } from '../../guir.utils'
import { guirAddRegex } from './guir-add.config'
import { Options } from './guir-add.utils'

describe('Guir Add: Component name spec', () => {
  it('valid component names', () => {
    expect(getMatchedArg('component-name', guirAddRegex.component)).toMatchObject({
      match: 'component-name',
    })
    expect(getMatchedArg('_component-name', guirAddRegex.component)).toMatchObject({
      match: '_component-name',
    })
    expect(getMatchedArg('_13component-name', guirAddRegex.component)).toMatchObject({
      match: '_13component-name',
    })
    expect(getMatchedArg('_13component_name.componet', guirAddRegex.component)).toMatchObject({
      match: '_13component_name.componet',
    })
  })

  it('invalid component names', () => {
    expect(getMatchedArg('', guirAddRegex.component)).toMatchObject({
      error: true,
    })
    expect(getMatchedArg('123component-name', guirAddRegex.component)).toMatchObject({
      error: true,
    })
    expect(getMatchedArg('-_component-name', guirAddRegex.component)).toMatchObject({
      error: true,
    })
    expect(getMatchedArg('._13component-name', guirAddRegex.component)).toMatchObject({
      error: true,
    })
  })
})

describe('Guir Add: Path option spec', () => {
  it('valid path value', () => {
    expect(
      getMatchedArg('./src/_component-name', guirAddRegex.valueOptions.path.value)
    ).toMatchObject({
      match: './src/_component-name',
    })
  })

  it('valid path value', () => {
    expect(
      getMatchedArg('src/_component-name', guirAddRegex.valueOptions.path.value)
    ).toMatchObject({
      match: 'src/_component-name',
    })
  })

  it('valid path value', () => {
    expect(
      getMatchedArg('./src/_component-name', guirAddRegex.valueOptions.path.value)
    ).toMatchObject({
      match: './src/_component-name',
    })
  })

  it('invalid path value', () => {
    expect(
      getMatchedArg('./src/123component-name', guirAddRegex.valueOptions.path.value)
    ).toMatchObject({
      error: true,
    })
  })

  it('invalid path value', () => {
    expect(
      getMatchedArg('./src/../123component-name', guirAddRegex.valueOptions.path.value)
    ).toMatchObject({
      error: true,
    })
  })
})

describe('Guir Add: Screens option spec - value supplied', () => {
  it('valid screen value', () => {
    expect(getMatchedArg('xs:lg', guirAddRegex.valueOptions.screens.value)).toMatchObject({
      match: 'xs:lg',
    })
  })

  it('valid screen value', () => {
    expect(getMatchedArg('md:md', guirAddRegex.valueOptions.screens.value)).toMatchObject({
      match: 'md:md',
    })
  })

  it('valid screen value', () => {
    expect(getMatchedArg('lg:md', guirAddRegex.valueOptions.screens.value)).toMatchObject({
      match: 'lg:md',
    })
  })

  it('invalid screen value', () => {
    expect(getMatchedArg('lg', guirAddRegex.valueOptions.screens.value)).toMatchObject({
      error: true,
    })
  })

  it('invalid screen value', () => {
    expect(getMatchedArg(':md', guirAddRegex.valueOptions.screens.value)).toMatchObject({
      error: true,
    })
  })
})

describe('Guir Add: screenSelective flag check', () => {
  it('valid screen value', () => {
    console.log(guirAddRegex.valueOptions.screenSelective.value, '***')
    // Single value
    expect(getMatchedArg('xs', guirAddRegex.valueOptions.screenSelective.value)).toMatchObject({
      match: 'xs',
    })
    // Multi, comma-separated values
    expect(getMatchedArg('xs,lg', guirAddRegex.valueOptions.screenSelective.value)).toMatchObject({
      match: 'xs,lg',
    })
    // Multi, comma-separated values with spaces
    expect(
      getMatchedArg('xs  ,   lg, md', guirAddRegex.valueOptions.screenSelective.value)
    ).toMatchObject({
      match: 'xs  ,   lg, md',
    })
  })
})

describe('Guir Add: boolean flags check', () => {
  it('valid bare value', () => {
    expect(getMatchedArg('-b', guirAddRegex.boolOptions.bare)).toMatchObject({
      match: '-b',
    })
  })

  it('valid override value', () => {
    expect(getMatchedArg('-o', guirAddRegex.boolOptions.override)).toMatchObject({
      match: '-o',
    })
  })
})
