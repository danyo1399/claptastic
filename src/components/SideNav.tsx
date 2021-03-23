import React, { useState, useEffect } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import CloseIcon from './CloseIcon'
import MenuIcon from './MenuIcon'
import { ClapperCard } from './ClapperCard'
import Config from '../config'
import { AddButton } from './AddButton'
import { clapperCreated, ClappersState } from '../claps'
import { DivWithAnyProps } from './DivWithAnyProps'

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

const SideNavContainer = styled(DivWithAnyProps)`
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

    .version-header {
        font-weight: normal;
        font-size: 0.8rem;
        .version {
            padding-left: 0.5rem;
        }
    }
    .sidenav-content {
        height: calc(100% - 60px);
        overflow: auto;
        margin-bottom: 1.2rem;
    }
    .sidenav-footer {
        border-top: 1px solid white;
        height: 60px;
    }
    ${(props) =>
        props.expanded &&
        css`
            margin-left: 0px;
        `}
`

export default function SideNav() {
    const version = Config.version
    const expanded = useRecoilValue(expandedAtom)
    const clappers = useRecoilValue(ClappersState)

    function addClapper() {
        clapperCreated.raiseEvent({})
    }

    return (
        <SideNavContainer
            className="min-height-hide"
            expanded={expanded}
            data-testid="side-nav"
        >
            <div className="sidenav-content">
                <section className="mb-2">
                    <div className="version-header">
                        Version:
                        <span id="version" className="version">
                            {version}
                        </span>
                    </div>
                </section>
                {clappers.map((c) => (
                    <div className="mb-3" key={c.id}>
                        <ClapperCard clapperId={c.id}></ClapperCard>
                    </div>
                ))}

                {clappers.length < 2 ? (
                    <div>
                        <AddButton onClick={addClapper}></AddButton>
                    </div>
                ) : null}
            </div>
            <div className="sidenav-footer"></div>
        </SideNavContainer>
    )
}
