import React from 'react'

// Make styled components with custom input props less painful to work with
export function DivWithAnyProps(props: any) {
    return <div {...props}></div>
}
