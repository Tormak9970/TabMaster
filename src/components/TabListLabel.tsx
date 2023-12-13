import { BiSolidHide } from 'react-icons/bi';
import { CSSProperties, VFC } from 'react';
import { FaSteam } from 'react-icons/fa6';
import { CustomTabContainer } from './CustomTabContainer';

interface TabListLabelProps {
  tabContainer: TabContainer,
  style?: CSSProperties
}

/**
 * Tab name and associated icons, used where tabs are listed in QAM and Library menu.
 */
export const TabListLabel: VFC<TabListLabelProps> = ({ tabContainer, style }) => {

  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%', ...style }}>
      <div style={{ marginRight: '5px' }}>{tabContainer.title}</div>
      {!tabContainer.filters && <FaSteam />}
      {tabContainer.position !== -1 && tabContainer.autoHide && (tabContainer as CustomTabContainer).collection.visibleApps.length === 0 && <BiSolidHide style={{ marginLeft: 'auto' }} />}
    </div>
  );
};
