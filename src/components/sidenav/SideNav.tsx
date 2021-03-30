import React, { useState, useEffect, ReactNode } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import CloseIcon from '../toolkit/CloseIcon'
import MenuIcon from '../toolkit/MenuIcon'
import { ClapperCard } from '../ClapperCard'

import { AddButton } from '../AddButton'
import { clapperCreated, clapperRemoved, ClappersState } from '../../claps'
import { RemoveButton } from '../RemoveButton'
import { SideNavMenu } from '../SideNavMenu'
import { maxClappers } from '../../constants'
import { Clappers } from './Clappers'
import {
    useImmerRecoilSetState,
    useImmerRecoilState,
} from '../../state/immerRecoil'
import { sidenavState } from './state'
import { About } from './About'
import { isIosSafari } from '../../utils/iosPwa'

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
const bodyHeight = isIosSafari() ? '75px' : '55px'
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
        height: calc(100% - ${bodyHeight});
        width: 100%;
        overflow-y: auto;
    }
    ${(props) =>
        props.expanded &&
        css`
            margin-left: 0px;
        `}
    .sidenav-footer {
        margin-left: -10px;
        margin-right: -10px;
    }
`

export default function SideNav() {
    const expanded = useRecoilValue(expandedAtom)
    const [state, setState] = useImmerRecoilState(sidenavState)
    function click(pageId: number) {
        setState((x) => {
            x.currentPage = pageId
        })
    }
    return (
        <StyledSideNavContainer
            className="min-height-hide"
            expanded={expanded}
            data-testid="side-nav"
        >
            <div className="sidenav-body">
                {state.currentPage === 1 ? <Clappers></Clappers> : null}
                {state.currentPage === 2 ? <About></About> : null}
            </div>
            <div className="sidenav-footer">
                <SideNavMenu click={click}></SideNavMenu>
            </div>
        </StyledSideNavContainer>
    )
}
