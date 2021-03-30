import React, { useState, useEffect, HTMLAttributes } from 'react'
import styled, { css, keyframes } from 'styled-components'
import ClapSvg from './ClapSvg'
import InfoSvg from './svg/InfoSvg'

const Container = styled.div`
    height: 80px;

    border-top: white solid 1px;
    button {
        height: 80px;

        width: 80px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }
    button:focus {
        outline: none;
    }
    .button-label {
        font-size: 0.8rem;
    }
    svg {
        fill: white;
        width: 35px;
        height: 35px;
    }
    .wrapper {
        display: flex;
        justify-content: flex-start;
        width: 100%;
        height: 100%;
        padding: 5px 10px;
    }
`

export interface SideNavMenuProps extends HTMLAttributes<HTMLDivElement> {
    click: (pageId: number) => void
}

export function SideNavMenu({ click, ...props }: SideNavMenuProps) {
    return (
        <Container {...props}>
            <div className="wrapper">
                <button onClick={() => click(1)}>
                    <div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24"
                            viewBox="0 0 24 24"
                            width="24"
                        >
                            <path d="M0 0h24v24H0V0z" fill="none" />
                            <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" />
                        </svg>
                    </div>
                    <div className="button-label">clappers</div>
                </button>
                <button onClick={() => click(2)}>
                    <InfoSvg></InfoSvg>
                    <div className="button-label">Info</div>
                </button>
            </div>
        </Container>
    )
}
