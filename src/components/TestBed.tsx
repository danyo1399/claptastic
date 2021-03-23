import React from 'react'
import { AddButton } from './AddButton'
export function TestBed() {
    return (
        <div className="fixed inset-0 bg-gray-800 z-20 p-4 flex">
            <Container>
                <AddButton></AddButton>
            </Container>
        </div>
    )
}

function Container({ children }: any) {
    return <div className="border w-1/3 h-2/3 p-2">{children}</div>
}
