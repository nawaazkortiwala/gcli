import React, { FC } from 'react'
import { Render } from '@geoiq_io/components.responsive'
import { Header2Xs, Header2Md, Header2Lg } from './screens'


const Header2: FC = () => {
  const Base: FC = () => {
    return null
  }

  return <Render base={<Base />} xs={<Header2Xs />} md={<Header2Md />} lg={<Header2Lg />} />
}

export default Header2
