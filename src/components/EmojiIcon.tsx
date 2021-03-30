import React, { useState, useEffect, HTMLAttributes } from 'react'
import styled, { css, keyframes } from 'styled-components'

const fullSize = css`
    font-size: 45vw;
    @media (min-width: 500px) {
        font-size: 224px;
    }
`
const Container = styled.div`
    font-size: 3rem;
    ${(props: any) => (props.full ? fullSize : null)}
`

export interface EmojiIconProps extends HTMLAttributes<HTMLDivElement> {
    full?: boolean
}

export function EmojiIcon({ ...props }: EmojiIconProps) {
    return <Container {...props}></Container>
}
