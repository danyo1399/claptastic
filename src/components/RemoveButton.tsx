import React, { useState, useEffect, HTMLAttributes } from 'react'
import styled, { css, keyframes } from 'styled-components'

const Container = styled.button`
    .inner {
        width: 1.5rem;
        height: 1.5rem;
        position: relative;
        :after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 50%;
            border-top: 1px solid white;
        }
    }
`

export interface RemoveButtonProps extends HTMLAttributes<HTMLButtonElement> {}

export function RemoveButton({ ...props }: RemoveButtonProps) {
    return (
        <Container
            {...props}
            className="border p-3 flex items-center justify-center"
        >
            <div className="inner"></div>
        </Container>
    )
}
