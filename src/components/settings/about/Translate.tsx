import { trans_string as t } from '@utils'

export const Translate = () => {
    return (
        <div style={{ marginBottom: '0.5rem' }}>
            <h2 style={{ fontWeight: 'bold', fontSize: '1.5em', marginBottom: '0px' }}>
                {t('TITLE_SETTINGS_ABOUT_TRANSLATIONS', 'Translations')}
            </h2>
            <div>
                {t(
                    'MESSAGE_HELP_WITH_TRANSLATIONS',
                    "We're working on translating TabMaster so yall can view use it in whatever language you'd like! If you know a language other than English please check out"
                )}{' '}
                <a href='https://crowdin.com/project/tabmaster'>https://crowdin.com/project/tabmaster</a>
            </div>
        </div>
    )
}
