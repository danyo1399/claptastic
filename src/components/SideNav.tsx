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
    ${(props) =>
        props.expanded &&
        css`
            margin-left: 0px;
        `}

    section {
        margin-bottom: 2rem;
    }
`

interface VersionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    version: string
}
function VersionHeader({ version, ...props }: VersionHeaderProps) {
    return (
        <section {...props}>
            Version:
            <span id="version" className="version">
                {version}
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

export default function SideNav() {
    const version = Config.version
    const expanded = useRecoilValue(expandedAtom)
    const clappers = useRecoilValue(ClappersState)

    function addClapper() {
        clapperCreated.raiseEvent({})
    }
    function removeClapper() {
        clapperRemoved.raiseEvent({
            clapperId: clappers[clappers.length - 1].id,
        })
    }

    return (
        <StyledSideNavContainer
            className="min-height-hide"
            expanded={expanded}
            data-testid="side-nav"
        >
            <StyledVersionHeader version={version}></StyledVersionHeader>

            <section>
                {clappers.map((c) => (
                    <div className="mb-3" key={c.id}>
                        <ClapperCard clapperId={c.id}></ClapperCard>
                    </div>
                ))}
                <div className="flex mt-2">
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
        </StyledSideNavContainer>
    )
}
