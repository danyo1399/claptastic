import React, { useState, useEffect, HTMLAttributes } from 'react'
import styled, { css, keyframes } from 'styled-components'

const openAnimation = keyframes`
from {top: 100vh;}
to {top:5px; }
`

const Container = styled.div`
    position: fixed;
    right: 5px;
    left: 5px;
    bottom: -3px;
    border-radius: 5px;
    background-color: #000000eb;
    color: white;
    z-index: 200;

    display: flex;
    flex-direction: column;
    row-gap: 1rem;
    padding: 1rem 0.5rem;

    animation-name: ${openAnimation};
    animation-duration: 0.5s;
    animation-fill-mode: forwards;
    animation-timing-function: cubic-bezier();
`

const CloseButton = styled.button`
    border: 1px solid white;
    border-radius: 0.2rem;
    padding: 0.5rem;
`

const Content = styled.div`
    overflow: auto;
    padding: 0 0.5rem;
`

export interface SlidUpPanelProps extends HTMLAttributes<HTMLElement> {
    close?: () => void
}

export function SlideUpPanel({ children, close, ...props }: SlidUpPanelProps) {
    return (
        <Container {...props}>
            {close && <CloseButton onClick={close}>Close</CloseButton>}
            <Content>{children}</Content>
        </Container>
    )
}
