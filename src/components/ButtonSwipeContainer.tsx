import React, { useState, useEffect, HTMLAttributes, useRef } from 'react'
import styled, { css, keyframes } from 'styled-components'
import ClapButton from './ClapButton'
import { useRecoilValue } from 'recoil'
import { ClappersState } from '../claps'

import hammer from 'hammerjs'

const Container = styled.div`
    display: flex;
    width: 100%;
    .wrapper {
        display: flex;
        position: relative;
        transition: left;
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

    const resetSwipe = () => {
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

    const swipe = (e) => {
        // its a bit janky. maybe just try with pan delta for now
        //     handleSwipe(e.direction)
    }
    const pan = (e) => {
        if (e.isFinal) {
            if (Math.abs(e.deltaX) > 100) {
                if (e.deltaX > 0) {
                    handleSwipe(hammer.DIRECTION_RIGHT)
                } else handleSwipe(hammer.DIRECTION_LEFT)
            }
            resetSwipe()
            return
        }
        wrapperRef.current.style.left = `calc(${currentLeft}  + ${e.deltaX}px)`
    }

    useEffect(() => {
        setIndex(0)
    }, [clappers?.length])
    useEffect(() => {
        resetSwipe()
    }, [index])
    return (
        <Container {...props}>
            <div className="wrapper" ref={wrapperRef}>
                {clappers.map((x) => (
                    <div className="item-wrapper" key={x.id}>
                        <button
                            className="swipe-button left"
                            onClick={() => handleSwipe(hammer.DIRECTION_RIGHT)}
                        ></button>
                        <ClapButton
                            clapperId={x.id}
                            swipe={swipe}
                            pan={pan}
                        ></ClapButton>
                        <button
                            className="swipe-button "
                            onClick={() => handleSwipe(hammer.DIRECTION_LEFT)}
                        ></button>
                    </div>
                ))}
            </div>
        </Container>
    )
}
