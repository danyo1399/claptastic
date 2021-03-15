import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Dialog from './Dialog'

const dialogShownKey = 'dialog_shown'

const Button = styled.button`
    margin-left: auto;
    margin-right: auto;
`

export default function StartDialog() {
    const [showDialog, setShowDialog] = useState(false)

    function closeDialog() {
        setShowDialog(false)
        localStorage.setItem(dialogShownKey, 'Y')
    }

    useEffect(() => {
        const dialogShown = localStorage.getItem(dialogShownKey)
        if (!dialogShown) {
            setShowDialog(true)
        }
    }, [])

    if (!showDialog) {
        return null
    }

    function DialogContent() {
        return (
            <>
                <p className="mb-6">You ever tried clapping while holding your phone?</p>
                <p>Well now you can</p>
                <Button className="rounded p-2 text-md w-full bg-gray-600 mt-8 text-white" onClick={closeDialog}>
                    Close
                </Button>
            </>
        )
    }
    return <Dialog render={DialogContent}></Dialog>
}
