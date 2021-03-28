import React, { useState, useEffect, HTMLAttributes, useRef } from 'react'
import styled, { css, keyframes } from 'styled-components'
import ClapButton from './ClapButton'
import { useRecoilValue } from 'recoil'
import { ClappersState } from '../claps'

const Container = styled.div`
    display: flex;
    width: 100%;
    .wrapper {
        display: flex;
        position: relative;
        transition: left;
        transition-duration: 60ms;
    }
    .item-wrapper {
        min-width: 100vw;
        display: flex;
        justify-content: center;
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
    const swipe = (e) => {
        if (e.direction == 2) {
            if (index < clappers.length - 1) {
                setIndex((x) => x + 1)
            }
        } else if (e.direction == 4) {
            if (index > 0) {
                setIndex((x) => x - 1)
            }
        }
    }
    const pan = (e) => {
        if (e.isFinal) {
            resetSwipe()
            return
        }
        wrapperRef.current.style.left = `calc(${currentLeft}  + ${e.deltaX}px)`
    }

    useEffect(() => {
        resetSwipe()
    }, [index])
    return (
        <Container {...props}>
            <div className="wrapper" ref={wrapperRef}>
                {clappers.map((x) => (
                    <div className="item-wrapper" key={x.id}>
                        <ClapButton
                            clapperId={x.id}
                            swipe={swipe}
                            pan={pan}
                        ></ClapButton>
                    </div>
                ))}
            </div>
        </Container>
    )
}
