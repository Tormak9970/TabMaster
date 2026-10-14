import { DialogButton, Dropdown, DropdownOption, Field, Focusable, SingleDropdownOption, showModal } from '@decky/ui'
import { VFC, Fragment, useState, useContext } from 'react'
import { FilterType, SdCardParamType, TabFilterSettings } from '../filters/Filters'
import { FixMergeFilterModal } from '../modals/FixMergeFilterModal'
import { ErrorPanelTabNameContext } from '@state'
import { DestructiveModal } from '../generic/DestructiveModal'
import { TrashButton } from '../generic/TrashButton'
import { trans_string as t } from '@utils'

type GuardedDeleteButtonProps = {
    onFilterDelete: () => void
    numFilters: number
    isMergeGroup: boolean
}

const GuardedDeleteButton = (props: GuardedDeleteButtonProps) => {
    const { onFilterDelete, numFilters, isMergeGroup } = props

    return (
        <TrashButton
            onClick={() => {
                showModal(
                    <DestructiveModal onOK={onFilterDelete} strTitle={t('TITLE_ALL_CAPS_WARNING', 'WARNING!')}>
                        {t('MESSAGE_DELETE_FILTER_CONFIRM', 'Are you sure you want to delete this filter?') +
                            ' ' +
                            (numFilters === 1
                                ? (isMergeGroup
                                      ? t(
                                            'MESSAGE_NO_FILTERS_IN_GROUP',
                                            `There are no other filters in this merge group. Deleting it will automatically delete the merge filter as well.`
                                        )
                                      : t(
                                            'MESSAGE_NO_FILTERS_IN_TAB',
                                            `There are no other filters in this tab. Deleting it will automatically delete the tab as well.`
                                        )) + ' '
                                : '') +
                            `This can't be undone.`}
                    </DestructiveModal>
                )
            }}
        />
    )
}

type FilterErrorOptionsProps<T extends FilterType> = {
    isMergeGroup: boolean | undefined
    numFilters: number
    filter: TabFilterSettings<T>
    mergeErrorEntries?: FilterErrorEntry[] | undefined
    onFilterUpdate: (filter: TabFilterSettings<FilterType> | []) => void
    onFilterDelete: () => void
}

/**
 * The error options for a collection filter.
 */
const CollectionFilterErrorOptions: VFC<FilterErrorOptionsProps<'collection'>> = ({
    isMergeGroup,
    numFilters,
    filter,
    onFilterUpdate,
    onFilterDelete,
}) => {
    const collectionDropdownOptions: DropdownOption[] = collectionStore.userCollections.map(
        (collection: { displayName: string; id: string }) => {
            return { label: collection.displayName, data: collection.id }
        }
    )

    function onChange(data: SingleDropdownOption) {
        const updatedFilter = { ...filter }
        updatedFilter.params.id = data.data
        updatedFilter.params.name = data.label as string
        onFilterUpdate(updatedFilter)
    }

    return (
        <Field
            label={t('LABEL_SELECTED_COLLECTION', 'Selected Collection')}
            description={
                <div className='filter-entry'>
                    <Focusable
                        style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                        }}
                    >
                        <Focusable
                            style={{
                                width: 'calc(100% - 55px)',
                            }}
                        >
                            <Dropdown
                                rgOptions={collectionDropdownOptions}
                                selectedOption={filter.params.id}
                                onChange={onChange}
                            />
                        </Focusable>
                        <Focusable
                            style={{
                                marginLeft: '10px',
                                width: '45px',
                            }}
                        >
                            <GuardedDeleteButton
                                onFilterDelete={onFilterDelete}
                                numFilters={numFilters}
                                isMergeGroup={isMergeGroup ?? false}
                            />
                        </Focusable>
                    </Focusable>
                </div>
            }
        />
    )
}

/**
 * The error options for a merge filter.
 */
const MergeFilterErrorOptions: VFC<FilterErrorOptionsProps<'merge'>> = ({
    isMergeGroup,
    numFilters,
    filter,
    mergeErrorEntries,
    onFilterUpdate,
    onFilterDelete,
}) => {
    const tabName = useContext(ErrorPanelTabNameContext)
    const [isPassing, setIsPassing] = useState(mergeErrorEntries!.length === 0)

    const initialParams = {
        filters: [...filter.params.filters],
        mode: filter.params.mode,
    }
    const [mergeParams, setMergeParams] = useState<TabFilterSettings<'merge'>['params']>(initialParams)

    function saveMerge(mergeParams: TabFilterSettings<'merge'>['params']) {
        const updatedFilter = { ...filter }
        updatedFilter.params.filters = mergeParams.filters
        updatedFilter.params.mode = mergeParams.mode

        onFilterUpdate(mergeParams.filters.length === 0 ? [] : updatedFilter)
        setMergeParams({ ...mergeParams })
        //* this is necessary so that if the accordian remounts the merge filter it will rememember it's state
        mergeErrorEntries!.length = 0
    }

    function onClick() {
        const modal: { instance: any } = { instance: null }
        modal.instance = showModal(
            <FixMergeFilterModal
                isPassingOuter={isPassing}
                setIsPassingOuter={setIsPassing}
                mergeParams={mergeParams}
                mergeErrorEntries={mergeErrorEntries!}
                saveMerge={saveMerge}
                closeModal={() => modal.instance.Close()}
                tabName={tabName!}
            />
        )
    }

    return (
        <Field
            description={
                <div className='filter-entry'>
                    <Focusable
                        className='styled-btn'
                        style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                        }}
                    >
                        <Focusable
                            style={{
                                width: 'calc(100% - 55px)',
                            }}
                        >
                            <DialogButton
                                onClick={onClick}
                                disabled={isPassing}
                                style={{
                                    width: '100%',
                                }}
                            >
                                {isPassing
                                    ? t('LABEL_RESOLVED', 'Resolved')
                                    : t('LABEL_FIX_MERGE_GROUP', 'Fix Merge Group')}
                            </DialogButton>
                        </Focusable>
                        <Focusable
                            style={{
                                marginLeft: '10px',
                                width: '45px',
                            }}
                        >
                            <GuardedDeleteButton
                                onFilterDelete={onFilterDelete}
                                numFilters={numFilters}
                                isMergeGroup={isMergeGroup ?? false}
                            />
                        </Focusable>
                    </Focusable>
                </div>
            }
        />
    )
}

/**
 * The error options for an sd card filter.
 */
const SDCardFilterErrorOption: VFC<FilterErrorOptionsProps<'sd card'>> = ({
    isMergeGroup,
    numFilters,
    filter,
    onFilterUpdate,
    onFilterDelete,
}) => {
    const cardsAndGames = window.MicroSDeck?.CardsAndGames || []
    const dropdownOptions: DropdownOption[] = [
        {
            label: t('LABEL_INSERTED_CARD', 'Inserted Card'),
            data: SdCardParamType.INSTALLED,
        },
        {
            label: t('LABEL_SPECIFIC_CARD', 'Specific Card'),
            options: cardsAndGames.map(([card]) => {
                return { label: card.name || card.uid, data: card.uid }
            }),
        },
        {
            label: t('LABEL_ANY_CARD', 'Any Card'),
            data: SdCardParamType.ANY,
        },
    ]

    function onChange({ data }: SingleDropdownOption) {
        const updatedFilter = { ...filter }
        updatedFilter.params.card = data
        onFilterUpdate(updatedFilter)
    }

    return (
        <Field
            label={t('LABEL_SELECTED_CARD', 'Selected Card')}
            description={
                <div className='filter-entry'>
                    <Focusable
                        style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                        }}
                    >
                        <Focusable
                            style={{
                                width: 'calc(100% - 55px)',
                            }}
                        >
                            <Dropdown
                                rgOptions={dropdownOptions}
                                selectedOption={filter.params.card ?? SdCardParamType.INSTALLED}
                                onChange={onChange}
                            />
                        </Focusable>{' '}
                        {/*  ^ back compat for undefined as installed card */}
                        <Focusable
                            style={{
                                marginLeft: '10px',
                                width: '45px',
                            }}
                        >
                            <GuardedDeleteButton
                                onFilterDelete={onFilterDelete}
                                numFilters={numFilters}
                                isMergeGroup={isMergeGroup ?? false}
                            />
                        </Focusable>
                    </Focusable>
                </div>
            }
        />
    )
}

/**
 * The error options for an individual filter.
 */
export const FilterErrorOptions: VFC<FilterErrorOptionsProps<FilterType>> = ({
    isMergeGroup,
    numFilters,
    filter,
    mergeErrorEntries,
    onFilterUpdate,
    onFilterDelete,
}) => {
    if (filter) {
        const filterCopy = { ...filter, params: { ...filter.params } }
        switch (filter.type) {
            case 'collection':
                return (
                    <CollectionFilterErrorOptions
                        isMergeGroup={isMergeGroup}
                        numFilters={numFilters}
                        filter={filterCopy as TabFilterSettings<'collection'>}
                        onFilterUpdate={onFilterUpdate}
                        onFilterDelete={onFilterDelete}
                    />
                )
            case 'merge':
                return (
                    <MergeFilterErrorOptions
                        isMergeGroup={isMergeGroup}
                        numFilters={numFilters}
                        filter={filterCopy as TabFilterSettings<'merge'>}
                        mergeErrorEntries={mergeErrorEntries}
                        onFilterUpdate={onFilterUpdate}
                        onFilterDelete={onFilterDelete}
                    />
                )
            case 'sd card':
                return (
                    <SDCardFilterErrorOption
                        isMergeGroup={isMergeGroup}
                        numFilters={numFilters}
                        filter={filterCopy as TabFilterSettings<'sd card'>}
                        onFilterUpdate={onFilterUpdate}
                        onFilterDelete={onFilterDelete}
                    />
                )
            default:
                throw new Error(`FilterErrorOption for ${filter.type} not implemented!`)
        }
    } else {
        return <Fragment />
    }
}
