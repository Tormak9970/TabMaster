import { PanelSection, ReorderableList, ReorderableEntry, ButtonItem } from 'decky-frontend-lib';
import { VFC, Fragment } from 'react';
import { TabIdEntryType } from './QuickAccessContent';
import { TabActionsButton } from '../other/TabActions';
import { useTabMasterContext } from '../../state/TabMasterContext';
import { TabListLabel } from '../other/TabListLabel';


interface TabEntryInteractablesProps {
  entry: ReorderableEntry<TabIdEntryType>;
}

interface TabsPanelSectionProps {
  isMicroSDeckInstalled: boolean;
}

export const TabsPanelSection: VFC<TabsPanelSectionProps> = ({ isMicroSDeckInstalled }) => {
  const { visibleTabsList, hiddenTabsList, tabsMap, tabMasterManager } = useTabMasterContext();

  function TabEntryInteractables({ entry }: TabEntryInteractablesProps) {
    const tabContainer = tabsMap.get(entry.data!.id)!;
    return (<TabActionsButton {...{ tabContainer, tabMasterManager }} />);
  }

  const entries = visibleTabsList.map((tabContainer) => {
    return {
      label: <TabListLabel tabContainer={tabContainer} microSDeckDisabled={!isMicroSDeckInstalled} />,
      position: tabContainer.position,
      data: { id: tabContainer.id }
    };
  });

  return tabMasterManager.hasSettingsLoaded ? (
    <>
      <PanelSection title="Tabs">
        <div className="seperator" />
        <ReorderableList<TabIdEntryType>
          entries={entries}
          interactables={TabEntryInteractables}
          onSave={(entries: ReorderableEntry<TabIdEntryType>[]) => {
            tabMasterManager.reorderTabs(entries.map(entry => entry.data!.id));
          }}
        />
      </PanelSection>
      <PanelSection title="Hidden Tabs">
        <div className="seperator"></div>
        {
          hiddenTabsList.map(tabContainer =>
            <div className="hidden-tab-btn">
              {/* @ts-ignore */}
              <ButtonItem label={<TabListLabel tabContainer={tabContainer} microSDeckDisabled={!isMicroSDeckInstalled} />} onClick={() => tabMasterManager.showTab(tabContainer.id)} onOKActionDescription="Unhide tab">
                Show
              </ButtonItem>
            </div>
          )
        }
      </PanelSection>
    </>
  ) : (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <img alt="Loading..." src="/images/steam_spinner.png" style={{ width: '150px' }} />
    </div>
  );
};
