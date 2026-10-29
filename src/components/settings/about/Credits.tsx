import { LANGS, trans_string as t } from '../../../utils'

const leads = ['Travis Lane', 'Jesse Bofill']
const contributors = [
    'Kernel Panic',
    'CEbbinghaus',
    'Denilson Sá Maia',
    'KennethThomson1212',
    'Simon Ma',
    'Kaporli',
    'Joshua Freudenhammer',
    'Vladimir Budylnikov',
]
const translators: [string, string[]][] = Object.values(LANGS).map(lang => {
    return [lang.name, lang.credit]
})

export const Credits = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.9em' }}>
            <div>
                <h2 style={{ fontWeight: 'bold', fontSize: '1.5em', marginBottom: '0px' }}>
                    {t('TITLE_SETTINGS_ABOUT_LEAD_DEVELOPERS', 'Lead Developers')}
                </h2>
                <ul style={{ marginTop: '0px', marginBottom: '0px' }}>
                    {leads.map(lead => (
                        <li>
                            <span>{lead}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2 style={{ fontWeight: 'bold', fontSize: '1.5em', marginBottom: '0px' }}>
                    {t('TITLE_SETTINGS_ABOUT_CONTRIBUTORS', 'Contributors')}
                </h2>
                <ul style={{ marginTop: '0px', marginBottom: '0px' }}>
                    {contributors.map(contributor => (
                        <li>
                            <span>{contributor}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2 style={{ fontWeight: 'bold', fontSize: '1.5em', marginBottom: '0px' }}>
                    {t('TITLE_SETTINGS_ABOUT_TRANSLATORS', 'Translators')}
                </h2>
                <ul style={{ marginTop: '0px', marginBottom: '0px' }}>
                    {translators.map(([lang, translators]) => (
                        <li>
                            <span>
                                <b>{lang}:</b> {translators.join(', ')}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
