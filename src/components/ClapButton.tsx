import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import getLogger from '../utils/logger'
import ClapSvg from './ClapSvg'
import { clappedEvent } from '../claps'
import { ClapIconContainer } from './ClapIconContainer'
import { playAudio } from '../claps'
import { Clap } from '../../apps/server/src/models'

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
export interface ClapButtonProps {
    clapperId: number
}

export default function ClapButton({ clapperId }: ClapButtonProps) {
    const [playing, setPlaying] = useState<boolean>(false)
    const intervalRef = useRef<NodeJS.Timeout>()
    const audioRef = useRef<HTMLAudioElement>()

    const svgRef = useRef(null)

    if (!audioRef.current) {
        const audio = new Audio()
        audioRef.current = audio
    }

    function stopPlayingAndReload() {
        audioRef.current.load()
        stopAnim()
        setPlaying(false)
    }

    async function play() {
        // TODO: trying to figure out bug ios playing audio
        if (!playing) {
            try {
                await playAudio(0, audioRef.current)
            } catch (err) {
                logger.error('Error playing audio', err)
            }
        } else {
            stopPlayingAndReload()
        }
    }

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
        const onStop = () => {
            stopAnim()
            setPlaying(false)
        }
        const onStart = async () => {
            startAnim()
            setPlaying(true)
            await clappedEvent.raiseEvent({})
        }

        audioRef.current.addEventListener('ended', onStop)
        audioRef.current.addEventListener('play', onStart)

        return () => {
            audioRef.current.removeEventListener('ended', onStop)
            audioRef.current.removeEventListener('play', onStart)
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
                stopPlayingAndReload()
                logger.log('calling audio.load due to visibility change')
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
            <ClapIconContainer onClick={play} clapperId={clapperId}>
                <ClapSvg clapping={playing} ref={svgRef} />
            </ClapIconContainer>
        </Wrapper>
    )
}
