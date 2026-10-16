import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { TagOverrideDict } from '@types'
import { SettingsManager } from './SettingsManager'

interface SettingsContextProviderProps {
    settingsManager: SettingsManager
    children: ReactNode
}

interface SettingsManagerData {
    tagOverrides: TagOverrideDict
    setTagOverrides: (overrides: TagOverrideDict) => Promise<void | Error>
}
interface SettingsContextType extends SettingsManagerData {
    settingsManager: SettingsManager
}

const SettingsContext = createContext<SettingsContextType>(null as any)
export const useSettingsContext = () => useContext(SettingsContext)

export const SettingsContextProvider = ({ children, settingsManager }: SettingsContextProviderProps) => {
    const [publicState, setPublicState] = useState<SettingsManagerData>({
        tagOverrides: settingsManager.getTagOverrides(),
        setTagOverrides: settingsManager.setTagOverrides,
    })

    useEffect(() => {
        function onUpdate() {
            setPublicState({
                tagOverrides: settingsManager.getTagOverrides(),
                setTagOverrides: settingsManager.setTagOverrides,
            })
        }

        settingsManager.eventBus.addEventListener('stateUpdate', onUpdate)

        return () => {
            settingsManager.eventBus.removeEventListener('stateUpdate', onUpdate)
        }
    }, [])

    return (
        <SettingsContext.Provider
            value={{
                ...publicState,
                settingsManager,
            }}
        >
            {children}
        </SettingsContext.Provider>
    )
}
