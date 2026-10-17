import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { TagOverrideDict } from '@types'
import { SettingsManager } from './SettingsManager'

interface SettingsContextProviderProps {
    children: ReactNode
}

interface SettingsManagerData {
    tagOverrides: TagOverrideDict
    setTagOverrides: (overrides: TagOverrideDict) => Promise<void | Error>
}
interface SettingsContextType extends SettingsManagerData {}

const SettingsContext = createContext<SettingsContextType>(null as any)
export const useSettingsContext = () => useContext(SettingsContext)

export const SettingsContextProvider = ({ children }: SettingsContextProviderProps) => {
    const [publicState, setPublicState] = useState<SettingsManagerData>({
        tagOverrides: SettingsManager.getTagOverrides(),
        setTagOverrides: overrides => SettingsManager.setTagOverrides(overrides),
    })

    useEffect(() => {
        function onUpdate() {
            setPublicState({
                tagOverrides: SettingsManager.getTagOverrides(),
                setTagOverrides: overrides => SettingsManager.setTagOverrides(overrides),
            })
        }

        SettingsManager.eventBus.addEventListener('stateUpdate', onUpdate)

        return () => {
            SettingsManager.eventBus.removeEventListener('stateUpdate', onUpdate)
        }
    }, [])

    return (
        <SettingsContext.Provider
            value={{
                ...publicState,
            }}
        >
            {children}
        </SettingsContext.Provider>
    )
}
