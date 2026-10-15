import { Focusable, ModalPosition, ScrollPanelGroup } from '@decky/ui'
import { Credits } from './Credits'
import { Fragment } from 'react'
import { Translate } from './Translate'
import { trans_string as t } from '@utils'

export const About = () => {
    return (
        <>
            <style>{`
                .tab-master-about ul {
                  padding-left: 1rem
                }
        
                .tab-master-about > .Panel.Focusable.gpfocuswithin {
                  background-color: #868da117;
                }
              `}</style>
            <div className='tab-master-about'>
                <ModalPosition>
                    <Focusable style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                        <ScrollPanelGroup
                            //@ts-ignore
                            focusable={false}
                            style={{ flex: 1, minHeight: 0, padding: '12px' }}
                            scrollPaddingTop={32}
                        >
                            <Focusable onActivate={() => {}} noFocusRing={true}>
                                <h2
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: '1.75em',
                                        margin: '0rem',
                                        marginBottom: '0.25rem',
                                        marginTop: '-0.5rem',
                                    }}
                                >
                                    {t('TITLE_SETTINGS_ABOUT', 'About')}
                                </h2>
                                <div>
                                    <div className='img-container'>
                                        <img
                                            src='https://raw.githubusercontent.com/Tormak9970/TabMaster/main/assets/thumbnail.png'
                                            alt='TabMaster Splashscreen'
                                            style={{
                                                width: '100%',
                                            }}
                                        />
                                    </div>
                                    <div className='description'>
                                        {t(
                                            'DESCRIPTION_SETTINGS_TABMASTER_ABOUT',
                                            'TabMaster gives you full control over your Steam library! Support for customizing, adding, and hiding Library Tabs. It is a labor of love from Travis Lane and Jesse Bofill, and we strive to make TabMaster feel like it was always a part of SteamOS.'
                                        )}
                                    </div>
                                    <Translate />
                                    <Credits />
                                </div>
                            </Focusable>
                        </ScrollPanelGroup>
                    </Focusable>
                </ModalPosition>
            </div>
        </>
    )
}
