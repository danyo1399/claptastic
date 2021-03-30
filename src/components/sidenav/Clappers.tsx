import React, { useState, useEffect, HTMLAttributes } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { maxClappers } from '../../constants'
import { AddButton } from '../AddButton'
import { RemoveButton } from '../RemoveButton'
import { clapperCreated, clapperRemoved, ClappersState } from '../../claps'
import { useRecoilValue } from 'recoil'
import { ClapperCard } from '../ClapperCard'

const Container = styled.div``

interface ClapperCardWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
    clapperId: number
    remove?: boolean
}

function ClapperCardWrapper({
    clapperId,
    remove,
    ...props
}: ClapperCardWrapperProps) {
    return (
        <div {...props}>
            <ClapperCard clapperId={clapperId}></ClapperCard>
        </div>
    )
}
const StyledClapperCardWrapper = styled(ClapperCardWrapper)`
    transition-property: left;
    transition-duration: 300ms;
    position: relative;
    margin-bottom: 0.5rem;
    left: ${(props) => (props.remove ? '-500px' : '0px')}; ;
`

export interface ClappersProps extends HTMLAttributes<HTMLDivElement> {}

export function Clappers({ ...props }: ClappersProps) {
    const [removed, setRemoved] = useState<any>(null)
    const clappers = useRecoilValue(ClappersState)
    function addClapper() {
        clapperCreated.raiseEvent({})
    }
    function removeClapper() {
        const removedId = clappers[clappers.length - 1].id
        setRemoved(removedId)
        setTimeout(() => {
            clapperRemoved.raiseEvent({
                clapperId: clappers[clappers.length - 1].id,
            })
            setRemoved(null)
        }, 350)
    }
    return (
        <Container {...props}>
            <section>
                {clappers.map((c) => (
                    <StyledClapperCardWrapper
                        key={c.id}
                        remove={removed === c.id}
                        clapperId={c.id}
                    ></StyledClapperCardWrapper>
                ))}
                <div className="flex mt-4">
                    {clappers.length < maxClappers ? (
                        <div>
                            <AddButton onClick={addClapper}></AddButton>
                        </div>
                    ) : null}
                    {clappers.length > 1 ? (
                        <div className="ml-2">
                            <RemoveButton
                                onClick={removeClapper}
                            ></RemoveButton>
                        </div>
                    ) : null}
                </div>
            </section>
        </Container>
    )
}
