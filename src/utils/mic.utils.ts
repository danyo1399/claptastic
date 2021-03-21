export async function hasAccess() {
    const query = navigator?.permissions?.query({ name: 'microphone' })
    if (!query) {
        return null
    }
    const permission = await query
    return permission.state
}

export function hasMicFeature() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
}

export async function promptAndGetMediaRecorder() {
    const stream = await navigator.mediaDevices.getUserMedia(
        // constraints - only audio needed for this app
        {
            audio: true,
        },
    )
    return new MediaRecorder(stream)
}

export async function getRecordedData(mediaRecorder: MediaRecorder) {
    const chunks = []

    mediaRecorder.ondataavailable = function (e) {
        chunks.push(e.data)
    }

    return new Promise((resolve, reject) => {
        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: mediaRecorder.mimeType })
            resolve(blob)
        }
        mediaRecorder.onerror = (err) => {
            reject(err)
        }
    })
}

export function getBuildDate() {
    const date = new Date()
    return (
        date.getFullYear() +
        (date.getMonth() + 1).toString().padStart(2, '0') +
        date.getDate().toString().padStart(2, '0') +
        date.getHours().toString().padStart(2, '0') +
        date.getMinutes().toString().padStart(2, '0') +
        date.getSeconds().toString().padStart(2, '0')
    )
}
