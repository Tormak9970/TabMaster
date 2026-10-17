import { ConfirmModal } from '@decky/ui'
import { useState, Fragment, useEffect } from 'react'
import { ModalStyles } from '../styles/ModalStyles'
import { FiltersPanel } from '../filters/FiltersPanel'
import { FilterDefaultParams } from '../filters/Filters'
import { isValidParams } from '../filters/Filters'
import { PythonInterop } from '@lib'
import { trans_string as t } from '@utils'
import { FilterType, LogicalMode, TabFilterSettings } from '@types'

interface EditMergeFilterModalProps {
    mergeParams: TabFilterSettings<'merge'>['params']
    saveMerge: (groupParams: TabFilterSettings<'merge'>['params']) => void
    closeModal: () => void
    isEditing: boolean
}

/**
 * Modal for editing a Merge Filter.
 */
export const EditMergeFilterModal = ({ closeModal, mergeParams, saveMerge, isEditing }: EditMergeFilterModalProps) => {
    const [groupFilters, setGroupFilters] = useState<TabFilterSettings<FilterType>[]>(mergeParams.filters)
    const [groupLogicMode, setGroupLogicMode] = useState<LogicalMode>(mergeParams.mode)
    const [canSave, setCanSave] = useState<boolean>(false)
    const [canAddFilter, setCanAddFilter] = useState<boolean>(true)
    const [shouldFocusAddButton, setShouldFocusAddButton] = useState(true)

    const cantSaveTitle = t('TITLE_CANT_SAVE_MERGE_GROUP', 'Cannot Save Merge Group')

    useEffect(() => {
        setShouldFocusAddButton(false)
    }, [])

    useEffect(() => {
        setCanSave(groupFilters.length >= 2 && canAddFilter)
    }, [groupFilters, canAddFilter])

    useEffect(() => {
        setCanAddFilter(groupFilters.length == 0 || groupFilters.every(filter => isValidParams(filter)))
    }, [groupFilters])

    function addFilterToGroup() {
        const updatedFilters = [...groupFilters]
        updatedFilters.push({
            type: 'collection',
            inverted: false,
            params: FilterDefaultParams().collection,
        })

        setGroupFilters(updatedFilters)
    }

    function onOkButton() {
        if (canSave) {
            const mergeParams = {
                filters: [...groupFilters],
                mode: groupLogicMode,
            }

            saveMerge(mergeParams)
            closeModal()
        } else {
            if (!canAddFilter)
                PythonInterop.toast(cantSaveTitle, t('MESSAGE_INCOMPLETE_FILTERS', 'Some filters are incomplete'))
            else
                PythonInterop.toast(
                    cantSaveTitle,
                    t('MESSAGE_NEED_TWO_FILTERS', 'A Merge group should have at least 2 filters')
                )
        }
    }

    return (
        <>
            <ModalStyles />
            <div className='tab-master-modal-scope'>
                <ConfirmModal
                    onOK={onOkButton}
                    onCancel={closeModal}
                    strTitle={t('TITLE_MERGE_GROUP', 'Merge Group')}
                    strOKButtonText={t('LABEL_SAVE_GROUP', 'Save Group')}
                >
                    <FiltersPanel
                        groupFilters={groupFilters}
                        setGroupFilters={setGroupFilters}
                        addFilter={addFilterToGroup}
                        groupLogicMode={groupLogicMode}
                        setGroupLogicMode={setGroupLogicMode}
                        canAddFilter={canAddFilter}
                        shouldFocusAddButton={shouldFocusAddButton}
                        collapseFilters={isEditing}
                    />
                </ConfirmModal>
            </div>
        </>
    )
}
