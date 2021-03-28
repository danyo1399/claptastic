import React, { useState, useEffect, HTMLAttributes } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { SlideUpPanel } from './toolkit/SlideUpPanel'
import { isUsingObsoleteUrl } from '../utils/browser.utils'

const Container = styled.div``

export interface MovingHouseProps extends HTMLAttributes<HTMLDivElement> {}

export function MovingHouse({ ...props }: MovingHouseProps) {
    return (
        <Container {...props}>
            {isUsingObsoleteUrl() && (
                <SlideUpPanel>
                    <h1 className="mb-6 text-xl">Claptastic has moved!</h1>
                    <p className="mb-4">
                        The new web address for Claptastic is &nbsp;
                        <a
                            className="text-green-500"
                            href="https://claptastic.tty.nz"
                        >
                            https://claptastic.tty.nz
                        </a>
                    </p>
                    <p className="mb-4">
                        If you installed our app, you will need to uninstall and
                        reinstall from the new website
                    </p>
                    <p className="mb-4">
                        The latest version has many new features such as support
                        for multiple clap buttons and swipe support.
                    </p>
                    <p className="mb-4">Hope to see you there</p>
                </SlideUpPanel>
            )}
        </Container>
    )
}
