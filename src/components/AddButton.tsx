import React, { useState, useEffect } from 'react'
import styled, { css, keyframes } from 'styled-components'

const Button = styled.button`
    outline: none;
    :focus {
        outline: none;
    }
`
const StyledPlus = styled(Plus)`
    width: ${(props: any) => props.size || '3rem'};
    height: ${(props: any) => props.size || '3rem'};
    position: relative;
    :before {
        content: '';
        position: absolute;
        bottom: 0;
        top: 0;
        left: 0;
        width: 50%;
        border-right: 1px solid white;
    }
    :after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 50%;
        border-top: 1px solid white;
    }
`

function Plus(props: any) {
    return <div {...props}></div>
}
export interface AddButtonProps {
    onClick?: any
}

export function AddButton({ onClick }: AddButtonProps) {
    return (
        <Button
            onClick={onClick}
            className="border p-3 flex items-center justify-center"
        >
            <StyledPlus size="1.5rem"></StyledPlus>
        </Button>
    )
}
