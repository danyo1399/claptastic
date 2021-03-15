import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import getLogger from '../utils/logger'
import ClapSvg from './ClapSvg'

import { clapped } from '../claps/clap.events'
import { ClapIconContainer } from './ClapIconContainer'
import { useRecoilValue } from 'recoil'
import { clappersSelector } from '../claps/clap.state'
import { defaultAudioUrlPromise } from '../claps/audio'
import { blobs } from '../claps/clap.db'
import { queueProcessor } from '../utils/queue-processor'

const logger = getLogger('clap-button')
const Wrapper = styled.div`
    width: 80vw;
    max-width: 400px;
    max-height: 80vh;

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

    @keyframes loadButton {
        from {
            transform: rotate(180deg) scale(0.1);
            opacity: 0.1;
        }
        to {
            transform: none;
            opacity: 1;
        }
    } ;
`

const queue = queueProcessor()
export default function ClapButton() {
    const [playing, setPlaying] = useState<boolean>(false)
    const clapper = useRecoilValue(clappersSelector)[0]
    const intervalRef = useRef<NodeJS.Timeout>()
    const audioRef = useRef<HTMLAudioElement>()
    const currentAudioBlobRef = useRef<string>()

    const svgRef = useRef(null)

    function stopPlaying() {
        audioRef.current.load()
        stopAnim()
        setPlaying(false)
    }
    async function play() {
        if (!playing) {
            try {
                logger.log('Playing audio')
                await audioRef.current.play()
            } catch (err) {
                logger.error('Failed to call play', err)
            }
        } else {
            stopPlaying()
        }
    }

    useEffect(() => {
        const fn = async () => {
            if (!audioRef.current) {
                return
            }
            if (currentAudioBlobRef.current == clapper.userAudioBlobKey) {
                return
            }

            const defaultAudioUrl = await defaultAudioUrlPromise

            stopPlaying()
            const existingUrl = audioRef.current.src
            if (existingUrl && existingUrl !== defaultAudioUrl) {
                URL.revokeObjectURL(existingUrl)
                audioRef.current.src = defaultAudioUrl
                logger.log(
                    'removing custom audio file, and deleting blob doc',
                    [existingUrl, currentAudioBlobRef.current],
                )
                await blobs.deleteItem(currentAudioBlobRef.current)
            }

            if (clapper.userAudioBlobKey) {
                const blob = await blobs.getItem(clapper.userAudioBlobKey)
                if (blob) {
                    audioRef.current.src = URL.createObjectURL(blob)
                    logger.log('setting audio to custom blob file', [
                        audioRef.current.src,
                        clapper.userAudioBlobKey,
                    ])
                } else {
                    logger.log(
                        'No blob file found for docid',
                        clapper.userAudioBlobKey,
                    )
                }
            }

            if (!audioRef.current.src) {
                currentAudioBlobRef.current = null
                logger.log('Setting audio to default file', defaultAudioUrl)
                audioRef.current.src = defaultAudioUrl
            }
            currentAudioBlobRef.current = clapper.userAudioBlobKey
            return async () => {
                const existingUrl = audioRef.current.src
                if (existingUrl && existingUrl !== defaultAudioUrl) {
                    URL.revokeObjectURL(existingUrl)
                    audioRef.current.src = defaultAudioUrl
                }
            }
        }
        queue.add(fn)
    }, [clapper?.userAudioBlobKey, audioRef.current])

    // TODO: Replace this with a css animation
    function startAnim() {
        if (intervalRef.current != null) {
            return
        }
        const ele = svgRef.current
        let toggle = false
        intervalRef.current = setInterval(() => {
            if (!toggle) {
                ele.style.transform = 'scale(1.2)'
                toggle = true
            } else {
                ele.style.transform = 'scale(1)'
                toggle = false
            }
        }, 100)
    }
    function stopAnim() {
        if (intervalRef.current == null) {
            return
        }
        clearInterval(intervalRef.current)
        intervalRef.current = null

        svgRef.current.style.transform = undefined
    }

    useEffect(() => {
        const audio = new Audio()
        audioRef.current = audio
        ;(async () => {
            audio.src = await defaultAudioUrlPromise
            logger.log('setting default audio')
        })()

        const onStop = () => {
            stopPlaying()
        }
        const onStart = async () => {
            startAnim()
            setPlaying(true)
            await clapped.raiseEvent({})
        }

        audio.addEventListener('ended', onStop)
        audio.addEventListener('play', onStart)

        return () => {
            audio.removeEventListener('ended', onStop)
            audio.removeEventListener('play', onStart)
        }
    }, [])

    // visibility change
    useEffect(() => {
        let hidden, visibilityChange
        const anyDoc = document as any
        if (typeof anyDoc.hidden !== 'undefined') {
            // Opera 12.10 and Firefox 18 and later support
            hidden = 'hidden'
            visibilityChange = 'visibilitychange'
        } else if (typeof anyDoc.msHidden !== 'undefined') {
            hidden = 'msHidden'
            visibilityChange = 'msvisibilitychange'
        } else if (typeof anyDoc.webkitHidden !== 'undefined') {
            hidden = 'webkitHidden'
            visibilityChange = 'webkitvisibilitychange'
        }
        async function handleVisibilityChange() {
            if (document[hidden]) {
                stopAnim()
                audioRef.current.load()
                setPlaying(false)
            }
        }

        document.addEventListener(
            visibilityChange,
            handleVisibilityChange,
            false,
        )
        return () =>
            document.removeEventListener(
                visibilityChange,
                handleVisibilityChange,
            )
    }, [])
    return (
        <Wrapper>
            <ClapIconContainer onClick={play}>
                <ClapSvg clapping={playing} ref={svgRef} />
            </ClapIconContainer>
        </Wrapper>
    )
}
