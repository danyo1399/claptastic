import React, { useState, useEffect, ReactNode } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import CloseIcon from './toolkit/CloseIcon'
import MenuIcon from './toolkit/MenuIcon'
import { ClapperCard } from './ClapperCard'
import Config from '../config'
import { AddButton } from './AddButton'
import { clapperCreated, clapperRemoved, ClappersState } from '../claps'
import { RemoveButton } from './RemoveButton'
import { SideNavMenu } from './SideNavMenu'

const StyledButton = styled.button`
    color: white;
    outline: none !important;
`
const expandedAtom = atom({ key: 'sidenav-expanded', default: false })
export function ExpandIconButton() {
    const [expanded, setExpanded] = useRecoilState(expandedAtom)

    function onClick() {
        setExpanded((value) => {
            return !value
        })
    }
    return (
        <StyledButton
            onClick={onClick}
            className="min-height-hide"
            data-testid="side-nav-button"
        >
            {expanded ? <CloseIcon></CloseIcon> : <MenuIcon></MenuIcon>}
        </StyledButton>
    )
}

interface SideNavContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    expanded: boolean
}

function SideNavContainer({ expanded, ...props }: SideNavContainerProps) {
    return <div {...props}></div>
}
const StyledSideNavContainer = styled(SideNavContainer)`
    position: fixed;
    overflow: hidden;
    width: 100vw;
    top: 50px;
    left: 0px;
    background-color: rgb(82 79 79);
    bottom: 0;
    margin-left: -100vw;
    padding: 10px;
    color: white;
    z-index: 20;
    transition-property: all;
    transition-duration: 200ms;
    transition-timing-function: ease-out;
    .sidenav-body {
        height: calc(100% - 75px);
        width: 100%;
        overflow-y: auto;
    }
    ${(props) =>
        props.expanded &&
        css`
            margin-left: 0px;
        `}

    section {
        margin-bottom: 1.5rem;
    }
    .version {
        position: absolute;
        right: 10px;
        top: 10px;
    }
    .sidenav-footer {
        margin-left: -10px;
        margin-right: -10px;
    }
`

interface VersionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    version: string
}
function VersionHeader({ version, ...props }: VersionHeaderProps) {
    return (
        <section {...props}>
            <span id="version" className="version">
                V{version}
            </span>
        </section>
    )
}
const StyledVersionHeader = styled(VersionHeader)`
    font-weight: normal;
    font-size: 0.8rem;
    .version {
        padding-left: 0.5rem;
    }
`

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

export default function SideNav() {
    const version = Config.version
    const expanded = useRecoilValue(expandedAtom)
    const clappers = useRecoilValue(ClappersState)

    const [removed, setRemoved] = useState<any>(null)
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
        <StyledSideNavContainer
            className="min-height-hide"
            expanded={expanded}
            data-testid="side-nav"
        >
            <div className="sidenav-body">
                <span>https://claptastic.tty.nz</span>
                <StyledVersionHeader version={version}></StyledVersionHeader>

                <section>
                    {clappers.map((c) => (
                        <StyledClapperCardWrapper
                            key={c.id}
                            remove={removed === c.id}
                            clapperId={c.id}
                        ></StyledClapperCardWrapper>
                    ))}
                    <div className="flex mt-4">
                        {clappers.length < 3 ? (
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
            </div>
            <div className="sidenav-footer">
                <SideNavMenu></SideNavMenu>
            </div>
        </StyledSideNavContainer>
    )
}
