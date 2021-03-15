import Dialog from './Dialog'
import React from 'react'
import styled from 'styled-components'
import releaseData from '../releaseData'
const Container = styled.div`
    font-size: 1rem;

    h3 {
        font-weight: 600;
        font-size: 1.3rem;
        margin-bottom: 1rem;
    }

    ul {
        margin-left: 1.1rem;
        list-style-type: disc;
        list-style-position: outside;
        max-height: 80%;
        margin-right: 1rem;
    }

    li {
        padding-bottom: 1rem;
        line-height: 1.3;
    }

    .ul-container {
        max-height: 65%;
        overflow-y: auto;
        margin-bottom: 10px;
    }

    button {
        background-color: #676767;
        padding: 0.5rem;
        border-radius: 5px;
        width: 80%;
        display: table;
        margin: 0 auto;
    }
`

function getNextIndexToShow() {
    const lastIndex = +localStorage.getItem('release_notes')
    return lastIndex || 0
}
function setNextIndexToShow(index: number) {
    localStorage.setItem('release_notes', index.toString())
}
export default function ReleaseInfo() {
    const lastIndex = getNextIndexToShow()
    const notesToShow: string[] = []
    for (let i = lastIndex; i < releaseData.length; i++) {
        notesToShow.push(...releaseData[i].notes)
    }
    if (notesToShow.length === 0) {
        return null
    }

    function close() {
        setNextIndexToShow(releaseData.length)
    }
    function ReleaseInfoList({ closeDialog }: any) {
        return (
            <Container>
                <h3>New and Improved</h3>
                <div className="ul-container">
                    <ul>
                        {notesToShow.map((x, index) => (
                            <li key={index}>{x}</li>
                        ))}
                    </ul>
                </div>
                <button onClick={closeDialog}>Close</button>
            </Container>
        )
    }
    return <Dialog onClose={close} render={ReleaseInfoList}></Dialog>
}
