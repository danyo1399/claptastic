import React, { useState, useEffect } from 'react'
import styled, { css, keyframes } from 'styled-components'
import ClapSvg from './ClapSvg'
import { ClapIconContainer } from './ClapIconContainer'
import getLogger from '../utils/logger'
import {
    clapperAudioUpdatedEvent,
    clapperCreated,
    clapperCustomAudioRemovedEvent,
    clapperRemoved,
} from '../claps'
import { removeAudio, setAudio } from '../claps'
import { Clap } from '../../apps/server/src/models'
import { DeleteSvg } from './DeleteSvg'

const logger = getLogger('clapper-card')

const Container = styled.div`
    width: 100%;
    max-width: 400px;
    display: grid;
    grid-template-columns: max-content auto;
    grid-template-rows: 1fr 1fr;
    grid-gap: 0.8rem;

    .icon-container {
        width: 5rem;
        height: fit-content;
        grid-column: 1;
        grid-row: 1 /3;
        place-self: center;
    }

    .input-container {
        position: relative;
    }

    .file-upload-common {
    }

    .file-upload-input {
        opacity: 0;
        z-index: 2;
        position: fixed;
        user-select: none;
        top: -1000px;
        left: -1000px;
        width: 0px;
        height: 0px;
    }

    .button {
        background-color: #676767;
        font-size: 0.9rem;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.5rem;
        user-select: none;
        outline: none;
    }
`

export interface ClapperCardProps {
    clapperId: number
}

export function ClapperCard({ clapperId }: ClapperCardProps) {
    const onChange = async (e) => {
        const ele: HTMLInputElement = e.target
        const file = ele.files[0] as File
        if (!file) {
            logger.log('No file')
            return
        }
        if (!file.type.includes('audio/')) {
            logger.log('not an audio file:' + file.type)
            return
        }
        if (file.size > 1024 * 1024 * 2) {
            logger.log('file cant be bigger than 2 MB')
            return
        }
        await setAudio(clapperId, file)

        await clapperAudioUpdatedEvent.raiseEvent({
            clapperId,
            name: file.name,
            type: file.type,
        })
        ele.value = null
    }

    async function removeCustomAudio() {
        await removeAudio(clapperId)
        await clapperCustomAudioRemovedEvent.raiseEvent({ clapperId })
    }

    return (
        <Container className="rounded  p-3 border border-gray-300 ">
            <label className="input-container button rounded">
                <input
                    type="file"
                    className="file-upload-input"
                    accept="audio/mp3, audio/wav"
                    onChange={onChange}
                ></input>
                Upload Audio
            </label>

            <div className="icon-container">
                <ClapIconContainer clapperId={clapperId}>
                    <ClapSvg></ClapSvg>
                </ClapIconContainer>
            </div>
            <div className="flex justify-between">
                <button
                    className="button flex-grow rounded"
                    onClick={removeCustomAudio}
                >
                    Restore
                </button>
            </div>
        </Container>
    )
}
