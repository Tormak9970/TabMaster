import { VFC, CSSProperties } from 'react';
import { MicroSDeckInstallState } from '../lib/controllers/MicroSDeckInterop';

interface MicroSDeckNoticeProps {
  intallState: MicroSDeckInstallState,
  pluginVersion: string,
  libVersion: string,
  style?: CSSProperties
}

export const MicroSDeckNotice: VFC<MicroSDeckNoticeProps> = ({ intallState, pluginVersion, libVersion, style }) => {
  let problem = '';
  let recommendation = '';
  
  switch (intallState) {
    case MicroSDeckInstallState.VERSION_TOO_LOW:
    case MicroSDeckInstallState.VERSION_TOO_HIGH:
      problem = `a version mismatch was detected.
      TabMaster expects version ${libVersion}, but version ${pluginVersion} is installed.`
      recommendation = intallState === MicroSDeckInstallState.VERSION_TOO_LOW ? 'Please update MicroSDeck to specified version.' : 'Please update TabMaster if available or install specified version of MicroSDeck.'
      break
    case MicroSDeckInstallState.VERSION_UNKOWN:
      problem = `TabMaster couldn't correctly determine which version it expects or which version is installed.`;
      recommendation = 'Please try updating TabMaster or MicroSDeck.';
      break
    case MicroSDeckInstallState.NOT_INSTALLED:
      problem = 'it is not installed.';
      recommendation = 'Please install MicroSDeck for these tabs to work.';
  }

  return (
    <div style={style}>
      <div>You have some tabs that rely on the MicroSDeck plugin, but {problem}</div>
      <div>{recommendation}</div>
      <div>Until then, these tabs will not be displayed in the library.</div>
    </div>
  );
};
