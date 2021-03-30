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
`

export interface AboutProps extends HTMLAttributes<HTMLDivElement> {}
const version = Config.version
export function About({ ...props }: AboutProps) {
    return (
        <Container {...props}>
            <span>https://claptastic.tty.nz</span>
            <StyledVersionHeader version={version} />
        </Container>
    )
}
