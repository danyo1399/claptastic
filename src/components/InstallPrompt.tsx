import React, { useState, useEffect } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { useRecoilState } from 'recoil'
import installPromptState from '../state/installPromptState'

import { log } from '../utils/logger'
import { isIosSafari } from '../utils/iosPwa'
import { installedAppLastUsed, usingInstalledApp } from '../utils/pwa'
import { useImmerRecoilSetState } from '../state/immerRecoil'
import { iosInstallState } from './IosInstall'

const installKeyFrames = keyframes`
  from {
    margin-right: -50px;
    transform: none;
  }

  50% {
    margin-right: 0px;
    transform: none;
  }
  40% {
    margin-right: 0px;
    transform: none;
  }
  70% {
    transform:rotate3d(0, 1, 0, 180deg);
    background-color: white !important;
  }
  100% {
    margin-right: 0px;
    transform: rotate3d(0);
  }

`
const Container = styled.div`
    display: contents;
    color: black;
    margin: -50px;
    fill: black;
    //background-color: rgba(255, 255, 255, 0.1);
    align-items: center;
    padding: 5px 50px 5px 10px;
    height: 32px;
    button {
        position: fixed;
        bottom: 15px;
        right: 15px;
        margin-right: -50px;
        animation-name: ${installKeyFrames};
        animation-duration: 1000ms;
        animation-delay: 1s;
        animation-fill-mode: forwards;
        animation-timing-function: cubic-bezier(0.22, 0.61, 0.36, 1);
    }
`
const ios = isIosSafari()
const isUsingInstalledApp = usingInstalledApp()
export default function InstallPrompt() {
    const [installState, setInstallState] = useRecoilState(installPromptState)
    const [dismissed, setDismissed] = useState(false)
    const setIosInstallState = useImmerRecoilSetState(iosInstallState)
    async function showPwaPrompt() {
        // Show the install prompt
        if (installState) {
            installState.prompt()
            // // Wait for the user to respond to the prompt
            const { outcome } = await installState.userChoice
            // Optionally, send analytics event with outcome of user choice
            log(`User response to the install prompt: ${outcome}`)
            // We've used the prompt, and can't use it again, throw it away
            setInstallState(null)
            setDismissed(true)
        }
    }
    async function click() {
        if (ios) {
            setIosInstallState((x) => {
                x.show = true
            })
        } else {
            if (showPwaPrompt) {
                await showPwaPrompt()
            }
            return
        }
    }

    if (ios) {
        if (isUsingInstalledApp) {
            return null
        }
    } else {
        if (!installState || dismissed) {
            return null
        }
    }

    return (
        <Container>
            <button
                id="install-button"
                className="update text-black border-0 bg-yellow-500 rounded ml-2 flex flex-col items-center p-1"
                onClick={click}
            >
                <svg
                    className="fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24"
                >
                    <path d="M0 .5h24v24H0z" fill="none" />
                    <path d="M12 16.5l4-4h-3v-9h-2v9H8l4 4zm9-13h-6v1.99h6v14.03H3V5.49h6V3.5H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2v-14c0-1.1-.9-2-2-2z" />
                </svg>
            </button>
        </Container>
    )
}
