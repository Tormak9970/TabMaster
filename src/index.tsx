import { definePlugin, RoutePatch, routerHook } from '@decky/api'
import { TbLayoutNavbarExpand } from 'react-icons/tb'
import { PluginController, MicroSDeckInterop } from '@lib'
import { SettingsContextProvider, SettingsManager, TabMasterContextProvider, TabMasterManager } from '@state'
import { patchLibrary, patchSettings } from '@patches'
import { MicroSDeck } from '@cebbinghaus/microsdeck'
import { QuickAccessContent, QuickAccessTitleView } from './components/qam/QuickAccessContent'
import { Fragment } from 'react'
import {
    DeckyLoader,
    CollectionStore,
    AppStore,
    LoginStore,
    FriendStore,
    SecurityStore,
    SettingsStore,
    InstallFolderStore,
    AppAchievementProgressCache,
    LocalizationManager,
} from '@types'
import { SettingsRouter } from './components/settings/SettingsRouter'

declare global {
    let DeckyPluginLoader: DeckyLoader
    var MicroSDeck: MicroSDeck | undefined
    let collectionStore: CollectionStore
    let appStore: AppStore
    let loginStore: LoginStore
    let friendStore: FriendStore
    //* This casing is correct, idk why it doesn't match the others.
    let securitystore: SecurityStore
    let settingsStore: SettingsStore
    let installFolderStore: InstallFolderStore
    let appAchievementProgressCache: AppAchievementProgressCache
    let LocalizationManager: LocalizationManager
}

export default definePlugin(() => {
    let libraryPatch: RoutePatch
    let settingsPatch: RoutePatch

    const tabMasterManager = new TabMasterManager()
    PluginController.setup(tabMasterManager)

    const loginUnregisterer = PluginController.initOnLogin(async () => {
        await MicroSDeckInterop.waitForLoad()
        await SettingsManager.loadSettings()
        await tabMasterManager.loadTabs()
        libraryPatch = patchLibrary(tabMasterManager)
        settingsPatch = patchSettings(tabMasterManager)
    })

    routerHook.addRoute('/tab-master-settings', () => (
        <SettingsContextProvider>
            <TabMasterContextProvider tabMasterManager={tabMasterManager}>
                <SettingsRouter />
            </TabMasterContextProvider>
        </SettingsContextProvider>
    ))
    return {
        name: 'TabMaster',
        title: <></>,
        titleView: <QuickAccessTitleView title='TabMaster' tabMasterManager={tabMasterManager} />,
        content: (
            <SettingsContextProvider>
                <TabMasterContextProvider tabMasterManager={tabMasterManager}>
                    <QuickAccessContent />
                </TabMasterContextProvider>
            </SettingsContextProvider>
        ),
        icon: <TbLayoutNavbarExpand />,
        onDismount: () => {
            routerHook.removePatch('/library', libraryPatch)
            routerHook.removePatch('/settings', settingsPatch)
            routerHook.removeRoute('/tab-master-settings')

            loginUnregisterer.unregister()
            PluginController.dismount()
        },
    }
})
