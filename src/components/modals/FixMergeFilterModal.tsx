import { ConfirmModal, showModal } from '@decky/ui'
import { VFC, useState, Fragment } from 'react'
import { TabFilterSettings, FilterType } from '../filters/Filters'
import { PythonInterop } from '../../lib/controllers/PythonInterop'
import { ErroredFiltersPanel } from '../changes-needed/ErroredFiltersPanel'
import { ErrorPanelTabNameContext } from '@state'
import { FixModalStyles } from '../styles/FixModalStyles'
import { DestructiveModal } from '../generic/DestructiveModal'
import { trans_string as t } from '@utils'

interface FixMergeFilterModalProps {
    mergeParams: TabFilterSettings<'merge'>['params']
    mergeErrorEntries: FilterErrorEntry[]
    saveMerge: (groupParams: TabFilterSettings<'merge'>['params']) => void
    isPassingOuter: boolean
    setIsPassingOuter: React.Dispatch<React.SetStateAction<boolean>>
    tabName: string
    closeModal: () => void
}

/**
 * Modal for fixing a Merge Filter.
 */
export const FixMergeFilterModal: VFC<FixMergeFilterModalProps> = ({
    mergeParams,
    mergeErrorEntries,
    isPassingOuter,
    setIsPassingOuter,
    saveMerge,
    closeModal,
    tabName,
}) => {
    const [filters, setFilters] = useState<(TabFilterSettings<FilterType> | [])[]>(mergeParams.filters)
    const [isPassing, setIsPassing] = useState(isPassingOuter)

    function onChange(filters: (TabFilterSettings<FilterType> | [])[], messages: string[][]) {
        setFilters(filters)

        const passing = messages.every(entry => entry.length === 0)
        setIsPassing(passing)
    }

    function onOkButton() {
        if (isPassing) {
            const newMergeParams = {
                filters: filters.flatMap(filter => filter),
                mode: mergeParams.mode,
            }

            setIsPassingOuter(true)
            saveMerge(newMergeParams)
            closeModal()
        } else {
            PythonInterop.toast(
                t('TITLE_ERROR', 'Error'),
                t('MESSAGE_MUST_FIX_ALL_MERGE_GROUP_ERRORS', 'All errors must be resolved before saving')
            )
        }
    }

    return (
        <>
            <FixModalStyles />
            <div className='tab-master-fix-modal-scope'>
                <ConfirmModal
                    onOK={() => {
                        showModal(
                            <DestructiveModal onOK={onOkButton} strTitle={t('TITLE_ALL_CAPS_WARNING', 'WARNING!')}>
                                {t(
                                    'MESSAGE_FIXING_MERGE_GROUP_IS_FINAL',
                                    "Are you sure you want save these fixes to this merge group? This can't be can't be changed later."
                                )}
                            </DestructiveModal>
                        )
                    }}
                    bOKDisabled={!isPassing}
                    strOKButtonText={t('LABEL_MERGE_GROUP_SAVE_CHANGES', 'Save Changes')}
                    onCancel={closeModal}
                    strCancelButtonText={t('LABEL_MERGE_GROUP_DISCARD_CHANGES', 'Discard Changes')}
                    strTitle={t('TITLE_FIXING_MERGE_GROUP', 'Fix Merge Group in Tab {tabName}').replace(
                        '{tabName}',
                        tabName
                    )}
                >
                    {isPassing && <div>{t('MESSAGE_ALL_ERRORS_RESOLVED', 'All errors have been resolved.')}</div>}
                    <ErrorPanelTabNameContext.Provider value={tabName}>
                        <ErroredFiltersPanel
                            isMergeGroup={true}
                            filters={filters}
                            errorEntries={mergeErrorEntries}
                            onChange={onChange}
                        />
                    </ErrorPanelTabNameContext.Provider>
                </ConfirmModal>
            </div>
        </>
    )
}
