import React, { useState, useEffect, HTMLAttributes } from 'react'
import styled, { css, keyframes } from 'styled-components'

const Container = styled.div`
    position: absolute;
    top: 5px;
    left: 10px;
    color: white;
    font-weight: 300;
    @media (max-height: 300px) {
        display: none;
    }
`

export interface InfoProps extends HTMLAttributes<HTMLDivElement> {}

export function Info({ ...props }: InfoProps) {
    return (
        <Container {...props}>
            <span>https://claptastic.tty.nz</span>
        </Container>
    )
}
