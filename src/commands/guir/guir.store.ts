import { create } from 'zustand'
import { GuirNS } from './guir.types'

const store = create<GuirNS.Store>(() => ({
  globalConfig: {
    rootDir: '',
  },
}))

export default store
