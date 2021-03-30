import React, { useState, useEffect, HTMLAttributes } from 'react'
import styled, { css, keyframes } from 'styled-components'

const keyframe = keyframes`
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.2);
  }`

const animationCss = css`
    animation-name: ${keyframe};
    animation-duration: 100ms;
    animation-direction: alternate;
    animation-iteration-count: infinite;
`
const Container = styled.div`
    ${(props: any) => (props.enabled ? animationCss : undefined)}
`

export interface ThrobberProps extends HTMLAttributes<HTMLDivElement> {
    enabled?: boolean
}

export function Throbber({ ...props }: ThrobberProps) {
    return <Container {...props}></Container>
}
