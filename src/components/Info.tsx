import React, { useState, useEffect, HTMLAttributes } from 'react'
import styled, { css, keyframes } from 'styled-components'

const Container = styled.div`
    position: fixed;
    bottom: 20px;
    left: 15px;
    color: white;
    font-weight: 300;
`

export interface InfoProps extends HTMLAttributes<HTMLDivElement> {}

export function Info({ ...props }: InfoProps) {
    return (
        <Container {...props}>
            <a href="https://claptastic.tty.nz">https://claptastic.tty.nz</a>
        </Container>
    )
}
