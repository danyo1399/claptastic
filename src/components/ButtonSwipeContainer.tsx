import React, { useState, useEffect, HTMLAttributes, useRef } from 'react'
import styled, { css, keyframes } from 'styled-components'
import ClapButton from './ClapButton'
import { useRecoilValue } from 'recoil'
import { ClappersState } from '../claps'

import hammer from 'hammerjs'
import { throttle } from '../utils/utils'
import getTimerCount = jest.getTimerCount
import { isTouchEnabled } from '../utils/browser.utils'

const Container = styled.div`
    display: flex;
    width: 100%;
    .wrapper {
        display: flex;
        position: relative;
        transition: left;
        transition-duration: 70ms;
        transform: translate3d(0, 0, 0);
    }
    .wrapper.swiping {
        transition-duration: 70ms;
    }
    .item-wrapper {
        min-width: 100vw;
        display: flex;
        justify-content: center;
    }

    .swipe-button {
        --arrow-color: #5353ff;
        padding: 0 0px;

        outline: none;
        outline:focus {
        }

        align-items: center;
        display: none;
    }
    .swipe-button:before {
        content: '';
        display: block;
        width: 2.5rem;
        height: 2.5rem;
        border-right: var(--arrow-color) solid 6px;
        border-top: var(--arrow-color) solid 6px;
        transform: rotateZ(45deg);
    }
    .swipe-button:first-of-type:before {
        border-right: none;
        border-top: none;
        transform: rotateZ(45deg);
        border-left: var(--arrow-color) solid 6px;
        border-bottom: var(--arrow-color) solid 6px;
    }

    @media (min-width: 600px) {
        .swipe-button {
            display: flex;
        }
        .wrapper {
            transition-duration: 200ms;
        }
    }
`

export interface ButtonSwipeContainerProps
    extends HTMLAttributes<HTMLDivElement> {}

export function ButtonSwipeContainer({ ...props }: ButtonSwipeContainerProps) {
    const clappers = useRecoilValue(ClappersState)
    const wrapperRef = useRef<HTMLDivElement>()
    const [index, setIndex] = useState(0)
    const currentLeft = `-${100 * index}vw`
    const { fn: swipeMove, getTimeout } = throttle(
        (value) => {
            wrapperRef.current.style.left = value
        },
        40,
        {},
    )
    const resetSwipe = () => {
        const timeout = getTimeout()
        clearTimeout(timeout)
        wrapperRef.current.style.left = currentLeft
    }

    function handleSwipe(direction: number) {
        if (direction == hammer.DIRECTION_LEFT) {
            if (index < clappers.length - 1) {
                setIndex((x) => x + 1)
            }
        } else if (hammer.DIRECTION_RIGHT) {
            if (index > 0) {
                setIndex((x) => x - 1)
            }
        }
    }

    const pan = (e) => {
        if (e.isFinal) {
            if (Math.abs(e.deltaX) > 100) {
                if (e.deltaX > 0) {
                    handleSwipe(hammer.DIRECTION_RIGHT)
                } else handleSwipe(hammer.DIRECTION_LEFT)
            }
            wrapperRef.current.classList.remove('swiping')
            resetSwipe()
        } else {
            wrapperRef.current.classList.add('swiping')
            swipeMove(`calc(${currentLeft}  + ${e.deltaX}px)`)
        }
    }

    useEffect(() => {
        setIndex(0)
    }, [clappers?.length])
    useEffect(() => {
        resetSwipe()
    }, [index])

    const showButtons = clappers.length > 1 && !isTouchEnabled()
    return (
        <Container {...props}>
            <div className="wrapper" ref={wrapperRef}>
                {clappers.map((clapper) => (
                    <div className="item-wrapper" key={clapper.id}>
                        {showButtons && (
                            <button
                                className="swipe-button left"
                                onClick={() =>
                                    handleSwipe(hammer.DIRECTION_RIGHT)
                                }
                            ></button>
                        )}
                        <ClapButton
                            emoji={clapper.emoji}
                            clapperId={clapper.id}
                            pan={pan}
                        ></ClapButton>
                        {showButtons && (
                            <button
                                className="swipe-button "
                                onClick={() =>
                                    handleSwipe(hammer.DIRECTION_LEFT)
                                }
                            ></button>
                        )}
                    </div>
                ))}
            </div>
        </Container>
    )
}
