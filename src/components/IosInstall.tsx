import React, { useState, useEffect, HTMLAttributes } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { SlideUpPanel } from './toolkit/SlideUpPanel'
import { atom } from 'recoil'
import { useImmerRecoilState } from '../state/immerRecoil'

export const iosInstallState = atom({
    key: 'iosInstallState',
    default: { show: false },
})

const Image = styled.img`
    max-height: 30px;
`
export interface IosInstallProps extends HTMLAttributes<HTMLElement> {}

export function IosInstall(props: IosInstallProps) {
    const [state, setState] = useImmerRecoilState(iosInstallState)
    function close() {
        setState((x) => {
            x.show = false
        })
    }

    if (!state.show) {
        return null
    }
    return (
        <SlideUpPanel close={close}>
            <h1 className="text-xl font-semibold my-6">
                How to install on your Apple device?
            </h1>
            <p className="mb-4">Tap on the share button</p>
            <Image className="mb-6" src="screenshots/share-button.png" />

            <p className="mb-4">Tap on the Add to Home Screen button</p>
            <Image src="screenshots/add-to-homescreen.png" />
        </SlideUpPanel>
    )
}
