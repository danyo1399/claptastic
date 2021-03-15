import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
    .dialog {
        background-color: #1d2023;
        color: white;
        font-weight: 300;
        max-height: 90vh;
        overflow-y: hidden;
        position: relative;
    }
`
export default function Dialog({ render, onClose = () => null }: { render: any; onClose?: any }) {
    const [showDialog, setShowDialog] = useState(true)

    function closeDialog() {
        setShowDialog(false)
        onClose()
    }

    if (!showDialog) {
        return null
    }
    return (
        <Container
            id="dialog"
            className="dialog-wrapper fixed top-0 w-full h-full flex justify-center items-center z-10"
        >
            <div className="dialog rounded m-3 p-5 text-lg md:w-2/3 z-10 ">{render({ closeDialog })}</div>
            <div onClick={closeDialog} className="dialog-bg inset-0 opacity-70 bg-black absolute"></div>
        </Container>
    )
}
