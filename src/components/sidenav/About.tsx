import React, { useState, useEffect, HTMLAttributes } from 'react'
import styled, { css, keyframes } from 'styled-components'
import Config from '../../config'
const Container = styled.div``

interface VersionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    version: string
}
function VersionHeader({ version, ...props }: VersionHeaderProps) {
    return (
        <section {...props}>
            <span id="version" className="version">
                V{version}
            </span>
        </section>
    )
}
const StyledVersionHeader = styled(VersionHeader)`
    font-weight: normal;
    font-size: 0.8rem;
    margin-bottom: 0.2rem;
`



export interface AboutProps extends HTMLAttributes<HTMLDivElement> {}
const version = Config.version
export function About({ ...props }: AboutProps) {
    return (
        <Container {...props}>
            <StyledVersionHeader version={version} />
            <span>https://claptastic.tty.nz</span>

            <p className="mt-4">
                Have you ever tried clapping on with your phone in your hand.
                Well now you can.
            </p>
        </Container>
    )
}
