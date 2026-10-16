import { Field, gamepadDialogClasses } from '@decky/ui'
import { useSettingsContext } from '@state'
import { trans_string as t } from '@utils'
import { TagOverrides } from './tag-overrides/TagOverrides'
import { Fragment } from 'react'

export const Tags = () => {
    const { tagOverrides, setTagOverrides } = useSettingsContext()

    return (
        <>
            <style>{`
              /* The button item */
              .tab-master-tag-settings .styled-btn {
                padding: 0 !important;
              }
              .tab-master-tag-settings .styled-btn > div {
                padding: 0 !important;
                margin-top: 0.5rem;
              }
              .tab-master-tag-settings .styled-btn .${(gamepadDialogClasses as any).FieldLeftColumn} {
                display: none;
              }
              .tab-master-tag-settings .styled-btn .${(gamepadDialogClasses as any).FieldRightColumn} {
                width: 100%;
                max-width: 100% !important;
              }
              .tab-master-tag-settings .styled-btn .${gamepadDialogClasses.FieldChildrenInner} {
                width: 100%;
              }
              .tab-master-tag-settings .styled-btn .${(gamepadDialogClasses as any).FieldChildrenWithIcon} {
                width: 100%;
              }
            `}</style>
            <div className='tab-master-tag-settings'>
                <Field
                    label={t('LABEL_TAG_OVERRIDES', 'App Tag Overrides')}
                    // childrenContainerWidth="fixed"
                    description={t(
                        'DESCRIPTION_TAG_OVERRIDES',
                        'Allows you to override specific tags for apps you own.'
                    )}
                ></Field>
                <TagOverrides tagOverrides={tagOverrides} setTagOverrides={setTagOverrides} />
            </div>
        </>
    )
}
