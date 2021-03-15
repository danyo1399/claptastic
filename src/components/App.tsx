import React, { useEffect } from 'react'
import Header from './Header'
import ClapButton from './ClapButton'
import StartDialog from './StartDialog'
import installPromptState from '../state/installPromptState'
import { useSetRecoilState } from 'recoil'
import { log } from '../utils/logger'
import SideNav from './SideNav'
import { EventHandlerProvider } from '../events/event.provider'
import { useClapReducer } from '../claps/clap.state'
import ReleaseInfo from './ReleaseInfo'
export default function App() {
    const setInstallState = useSetRecoilState(installPromptState)

    useEffect(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            log('Prompting install')
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault()
            // Stash the event so it can be triggered later.

            setInstallState(e)
            // Update UI to notify the user they can add to home screen
        })
    }, [])

    const clapChangeHandler = useClapReducer()
    return (
        <>
            <EventHandlerProvider handlers={[clapChangeHandler]} />
            <StartDialog></StartDialog>
            <ReleaseInfo></ReleaseInfo>
            <Header></Header>
            <SideNav></SideNav>
            <div className="page-content">
                <ClapButton></ClapButton>
            </div>
        </>
    )
}
