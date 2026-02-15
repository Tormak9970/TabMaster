import { createContext, FC, useContext, useEffect, useState } from 'react'
import { TabMasterManager } from './TabMasterManager'

const TabMasterContext = createContext<PublicTabMasterContext>(null as any)
export const useTabMasterContext = () => useContext(TabMasterContext)

interface ProviderProps {
    tabMasterManager: TabMasterManager
}

interface PublicTabMasterManager {
    visibleTabsList: TabContainer[]
    hiddenTabsList: TabContainer[]
    tabsMap: Map<string, TabContainer>
    currentUsersFriends: FriendEntry[]
    allStoreTags: TagResponse[]
}
interface PublicTabMasterContext extends PublicTabMasterManager {
    tabMasterManager: TabMasterManager
}

export const TabMasterContextProvider: FC<ProviderProps> = ({ children, tabMasterManager }) => {
    const [publicState, setPublicState] = useState<PublicTabMasterManager>({
        ...tabMasterManager.getTabs(),
        ...tabMasterManager.getFriendsAndTags(),
    })

    useEffect(() => {
        function onUpdate() {
            setPublicState({ ...tabMasterManager.getTabs(), ...tabMasterManager.getFriendsAndTags() })
        }

        tabMasterManager.eventBus.addEventListener('stateUpdate', onUpdate)

        return () => {
            tabMasterManager.eventBus.removeEventListener('stateUpdate', onUpdate)
        }
    }, [])

    return (
        <TabMasterContext.Provider
            value={{
                ...publicState,
                tabMasterManager,
            }}
        >
            {children}
        </TabMasterContext.Provider>
    )
}
