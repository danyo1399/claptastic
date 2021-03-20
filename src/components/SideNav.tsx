import React, { useState, useEffect } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import CloseIcon from './CloseIcon'
import MenuIcon from './MenuIcon'
import { ClapperCard } from './ClapperCard'

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

const SideNavContainer = styled.div`
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
    section {
        margin-bottom: 2rem;
    }
    ${(props) =>
        props.expanded &&
        css`
            margin-left: 0px;
        `}
`

export default function SideNav() {
    const version = process.env.version
    const expanded = useRecoilValue(expandedAtom)
    return (
        <SideNavContainer
            className="min-height-hide"
            expanded={expanded}
            data-testid="side-nav"
        >
            <section>
                <div className="version-header">
                    Version:
                    <span id="version" className="version">
                        {version}
                    </span>
                </div>
            </section>
            <section>
                <ClapperCard></ClapperCard>
            </section>
        </SideNavContainer>
    )
}
