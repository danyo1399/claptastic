import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import getLogger from '../utils/logger'
import ClapSvg from './ClapSvg'
import { clappedEvent } from '../claps'
import { ClapIconContainer } from './ClapIconContainer'
import { playAudio } from '../claps'
import { Clap } from '../../apps/server/src/models'
import hammer from 'hammerjs'

const logger = getLogger('clap-button')

const Wrapper = styled.div`
    width: 80vw;
    max-width: 400px;
    max-height: 80vh;
    transition: left;
    transition-duration: 50ms;

    position: relative;
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
    pan?: (x: any) => void
    swipe?: (x: any) => void
}

export default function ClapButton({ pan, clapperId, swipe }: ClapButtonProps) {
    const [playing, setPlaying] = useState<boolean>(false)
    const audioRef = useRef<HTMLAudioElement>()
    const eleRef = useRef<HTMLDivElement>()
    if (!audioRef.current) {
        const audio = new Audio()
        audioRef.current = audio
    }

    function stopPlayingAndReload() {
        audioRef.current.load()
        setPlaying(false)
    }

    async function play() {
        // TODO: trying to figure out bug ios playing audio
        if (!playing) {
            try {
                await playAudio(clapperId, audioRef.current)
            } catch (err) {
                logger.error('Error playing audio', err)
            }
        } else {
            stopPlayingAndReload()
        }
    }

    useEffect(() => {
        const manager = new hammer.Manager(eleRef.current)
        const swiper = new hammer.Swipe({
            direction: hammer.DIRECTION_HORIZONTAL,
        })
        const panner = new hammer.Pan({
            direction: Hammer.DIRECTION_HORIZONTAL,
        })

        manager.add(swiper)
        manager.add(panner).recognizeWith(swiper)

        function pannerFn(event) {
            event.clapperId = this.clapperId
            pan && pan(event)
        }
        function swipperFn(event) {
            event.clapperId = clapperId
            swipe && swipe(event)
        }
        manager.on('pan', pannerFn)
        manager.on('swipe', swipperFn)
        return () => {
            pan && manager.off('pan', pannerFn)
            swipe && manager.off('swipe', swipperFn)
            manager.destroy()
        }
    }, [swipe, pan])

    useEffect(() => {
        const onStop = () => {
            setPlaying(false)
        }
        const onStart = async () => {
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
        <Wrapper ref={eleRef}>
            <ClapIconContainer onClick={play} clapperId={clapperId}>
                <ClapSvg clapping={playing} />
            </ClapIconContainer>
        </Wrapper>
    )
}
