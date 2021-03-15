const releaseData: ReleaseData = [
    {
        version: '1.1.10',
        date: 1615792644284,
        notes: ['Ability to stop clapping by pushing button while playing', 'Upload own audio', 'Add release notes'],
    },
]

export default releaseData

type ReleaseData = { version: string; date: number; notes: string[] }[]
