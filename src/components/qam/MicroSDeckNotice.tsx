import { VFC, CSSProperties } from 'react'
import { MicroSDeckInstallState } from '../../lib/controllers/MicroSDeckInterop'
import t from '../../utils/i18n'

interface MicroSDeckNoticeProps {
    intallState: MicroSDeckInstallState
    pluginVersion: string
    libVersion: string
    style?: CSSProperties
}

export const MicroSDeckNotice: VFC<MicroSDeckNoticeProps> = ({ intallState, pluginVersion, libVersion, style }) => {
    let problem = ''
    let recommendation = ''

    switch (intallState) {
        case MicroSDeckInstallState.VERSION_TOO_LOW:
        case MicroSDeckInstallState.VERSION_TOO_HIGH:
            problem = t(
                'MESSAGE_MICROSDECK_PROBLEM_VERSION_MISSMATCH',
                'You have some tabs that rely on the MicroSDeck plugin, but a version mismatch was detected. TabMaster expects version {libVersion}, but version {pluginVersion} is installed.'
            )
                .replace('{libVersion}', libVersion)
                .replace('{pluginVersion}', pluginVersion)
            recommendation =
                intallState === MicroSDeckInstallState.VERSION_TOO_LOW
                    ? t(
                          'MESSAGE_MICROSDECK_RECOMMENDATION_VERSION_TOO_LOW',
                          'Please update MicroSDeck to specified version.'
                      )
                    : t(
                          'MESSAGE_MICROSDECK_RECOMMENDATION_VERSION_TOO_HIGH',
                          'Please update TabMaster if available or install specified version of MicroSDeck.'
                      )
            break
        case MicroSDeckInstallState.VERSION_UNKOWN:
            problem = t(
                'MESSAGE_MICROSDECK_PROBLEM_VERSION_UNKOWN',
                "You have some tabs that rely on the MicroSDeck plugin, but TabMaster couldn't correctly determine which version it expects or which version is installed."
            )
            recommendation = t(
                'MESSAGE_MICROSDECK_RECOMMENDATION_VERSION_UNKOWN',
                'Please try updating TabMaster or MicroSDeck.'
            )
            break
        case MicroSDeckInstallState.NOT_INSTALLED:
            problem = t(
                'MESSAGE_MICROSDECK_PROBLEM_NOT_INSTALLED',
                'You have some tabs that rely on the MicroSDeck plugin, but it is not installed.'
            )
            recommendation = t(
                'MESSAGE_MICROSDECK_RECOMMENDATION_NOT_INSTALLED',
                'Please install MicroSDeck for these tabs to work.'
            )
    }

    return (
        <div style={style}>
            <div>{problem}</div>
            <div>{recommendation}</div>
            <div>
                {t(
                    'MESSAGE_MICROSDECK_NOTICE_CONCLUSION',
                    'Until then, these tabs will not be displayed in the library.'
                )}
            </div>
        </div>
    )
}
