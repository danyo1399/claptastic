import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { ContainerColor } from '../claps'

const Wrapper = styled.div`
    width: 100%;

    animation-name: loadButton;
    animation-duration: 500ms;
    animation-fill-mode: both;
    animation-timing-function: cubic-bezier();
    @media (max-height: 480px) {
        max-width: 300px;
    }

    @media (max-height: 360px) {
        max-width: 200px;
    }

    .svg-wrapper {
        color: black;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }

    .button-wrapper {
        position: relative;
        padding-bottom: 100%;
        height: 0;
        width: 100%;
    }
`

interface ButtonIconProps extends React.HTMLAttributes<HTMLElement> {
    color1: string
    color2: string
    type: 'button' | 'div'
    children: ReactNode
}

function ButtonIcon({ type, ...props }: ButtonIconProps) {
    if (type === 'button') {
        return <button {...props}>{props.children}</button>
    } else {
        return <div {...props}>{props.children}</div>
    }
}

const StyledButtonIcon = styled(ButtonIcon)`
    outline: none !important;

    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 999px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
        circle at bottom center,
        ${(props) => props.color1} 15px,
        ${(props) => props.color2}
    );
    box-shadow: 0 10px 10px -5px rgba(0, 0, 0, 0.2);
`

export const containerColors: ContainerColor[] = [
    { id: 'yellow', color1: '#ffc837', color2: '#ff8008' },
    { id: 'blue', color1: '#37afff', color2: '#0863ff' },
    { id: 'green', color1: '#84ff37', color2: '#09a045' },
    { id: 'red', color1: '#fc7b7b', color2: '#e70000' },
]

export function ClapIconContainer({ onClick, children, colorId }: any) {
    const color =
        containerColors.find((x) => x.id === colorId) || containerColors[0]

    const type = onClick ? 'button' : 'div'
    return (
        <Wrapper>
            <div className="button-wrapper">
                <StyledButtonIcon
                    color1={color.color1}
                    color2={color.color2}
                    type={type}
                    onClick={onClick}
                >
                    <div className="svg-wrapper">{children}</div>
                </StyledButtonIcon>
            </div>
        </Wrapper>
    )
}
