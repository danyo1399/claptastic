const releaseData: ReleaseData = [
    {
        version: '1.1.21',
        date: 1615792644284,
        notes: [
            'Ability to stop clapping by pushing button while playing',
            'Upload own audio',
            'Add release notes',
            'Optimise state hydration from db',
        ],
    },
    {
        version: '1.1.32',
        date: 1616412698464,
        notes: [
            'The clap counter now represents total number of claps worldwide!!',
        ],
    },
]

export default releaseData

type ReleaseData = { version: string; date: number; notes: string[] }[]
