import React, { useState, useEffect, HTMLAttributes } from 'react'
import styled, { css, keyframes } from 'styled-components'
import emojis from '../emojis.json'
import { SlideUpPanel } from './toolkit/SlideUpPanel'
import { Simulate } from 'react-dom/test-utils'
import select = Simulate.select
import { atom } from 'recoil'
import { useImmerRecoilState } from '../state/immerRecoil'
import { clapperIconChangedEvent } from '../claps'
const Container = styled.div`
    .emoji-button {
        font-size: 3rem;
        margin: 0.5rem;
    }
    .button-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
    }
`

export interface EmojiState {
    clapperId?: number
    closed: boolean
    emoji?: string
}
export const emojiState = atom<EmojiState>({
    key: 'emojis',
    default: { closed: true },
})
export interface EmojiListProps extends HTMLAttributes<HTMLDivElement> {}

export function EmojiList({ ...props }: EmojiListProps) {
    const [state, setState] = useImmerRecoilState(emojiState)
    function selectEmoji(x) {
        const emoji = x.target.innerText
        clapperIconChangedEvent.raiseEvent({
            clapperId: state.clapperId,
            emoji: emoji,
        })
        setState((state) => {
            state.closed = true
            state.emoji = x
        })
        select(x)
    }
    function reset() {
        clapperIconChangedEvent.raiseEvent({ clapperId: state.clapperId })
        setState((x) => {
            x.closed = true
            x.emoji = null
        })
    }
    function close() {
        setState((x) => {
            x.closed = true
        })
    }
    if (state.closed) {
        return null
    }
    return (
        <Container {...props}>
            <SlideUpPanel close={close}>
                <div className="button-list">
                    <button className="" onClick={reset}>
                        Reset
                    </button>
                    {emojis.map((x) =>
                        x.length < 5 ? (
                            <button
                                className="emoji-button"
                                onClick={selectEmoji}
                                key={x}
                            >
                                {x}
                            </button>
                        ) : null,
                    )}
                </div>
            </SlideUpPanel>
        </Container>
    )
}
