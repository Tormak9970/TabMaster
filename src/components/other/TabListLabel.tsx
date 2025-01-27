import { BiSolidHide } from 'react-icons/bi';
import { CSSProperties, Fragment, VFC } from 'react';
import { FaSteam } from 'react-icons/fa6';
import { FaSdCard } from 'react-icons/fa';
import { CustomTabContainer } from '../../state/CustomTabContainer';

interface TabListLabelProps {
  tabContainer: TabContainer,
  microSDeckDisabled: boolean,
  style?: CSSProperties
}

/**
 * Tab name and associated icons, used where tabs are listed in QAM and Library menu.
 */
export const TabListLabel: VFC<TabListLabelProps> = ({ tabContainer, microSDeckDisabled, style }) => {

  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%', ...style }}>
      <div style={{ marginRight: '5px' }}>{tabContainer.title}</div>
      {tabContainer.filters ? ((tabContainer as CustomTabContainer).dependsOnMicroSDeck ? <FaSdCard fill={microSDeckDisabled ? '#92939b61' : 'currentColor'} /> : <Fragment />) : <FaSteam />}
      {tabContainer.position !== -1 && tabContainer.autoHide && (tabContainer as CustomTabContainer).collection.visibleApps.length === 0 && <BiSolidHide style={{ marginLeft: 'auto' }} />}
    </div>
  );
};
