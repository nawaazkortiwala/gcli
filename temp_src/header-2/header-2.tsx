import React, { FC } from 'react'
import { Render } from '@geoiq_io/components.responsive'
import { Header2Xs, Header2Lg } from './screens'

const Header2: FC = () => {

  return <Render base={<></>} xs={<Header2Xs />} lg={<Header2Lg />} />
}

export default Header2
