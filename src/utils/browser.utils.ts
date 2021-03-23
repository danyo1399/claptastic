import { createEventEmitter } from './eventEmitter'

export type Visibility = 'hidden' | 'visible'
export const visibilityEventEmitter = createEventEmitter<Visibility>()
let hidden, visibilityChange
const anyDoc = document as any
if (typeof anyDoc.hidden !== 'undefined') {
    // Opera 12.10 and Firefox 18 and later support
    hidden = 'hidden'
    visibilityChange = 'visibilitychange'
} else if (typeof anyDoc.msHidden !== 'undefined') {
    hidden = 'msHidden'
    visibilityChange = 'msvisibilitychange'
} else if (typeof anyDoc.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden'
    visibilityChange = 'webkitvisibilitychange'
}
async function handleVisibilityChange() {
    if (document[hidden]) {
        visibilityEventEmitter.dispatch('hidden')
    } else {
        visibilityEventEmitter.dispatch('visible')
    }
}

document.addEventListener(visibilityChange, handleVisibilityChange, false)
