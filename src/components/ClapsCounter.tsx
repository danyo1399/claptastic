import ClapSvg from './ClapSvg'
import React, { memo } from 'react'
import { useRecoilValue } from 'recoil'
import { externalAtom } from '../external/external.state'

const ClapsCounter = memo((props: { count: number }) => {
    console.log('counter render')
    const externalState = useRecoilValue(externalAtom)
    return (
        <div className="flex items-center pr-1">
            <span className="px-2">{externalState.count}</span>
            <div className="counter-icon">
                <ClapSvg width="1.25rem"></ClapSvg>
            </div>
        </div>
    )
})

ClapsCounter.displayName = 'ClapsCounter'
export default ClapsCounter
