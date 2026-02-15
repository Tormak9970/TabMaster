import {
    ConfirmModal,
    DialogCheckbox,
    DropdownItem,
    Field,
    Focusable,
    SingleDropdownOption,
    TextField,
    ToggleField,
    afterPatch,
    quickAccessControlsClasses,
    showModal,
} from '@decky/ui'
import { useState, VFC, useEffect, Fragment } from 'react'
import { FilterDefaultParams, FilterType, TabFilterSettings, isValidParams } from '../filters/Filters'
import { PythonInterop } from '../../lib/controllers/PythonInterop'
import { TabMasterContextProvider } from '../../state/TabMasterContext'
import { TabMasterManager } from '../../state/TabMasterManager'
import { ModalStyles } from '../styles/ModalStyles'
import { FiltersPanel } from '../filters/FiltersPanel'
import {
    IncludeCategories,
    capitalizeFirstLetter,
    getIncludedCategoriesFromBitField,
    playUISound,
    updateCategoriesToIncludeBitField,
} from '../../lib/Utils'
import { BiSolidDownArrow } from 'react-icons/bi'
import { CustomTabContainer } from '../../state/CustomTabContainer'
import { useSortingMenuItems } from '../../hooks/useSortingMenuItems'

export type EditableTabSettings = Omit<Required<TabSettings>, 'position' | 'id'>

type EditTabModalProps = {
    closeModal?: () => void
    onConfirm: (tabId: string | undefined, tabSettings: EditableTabSettings) => void
    tabId?: string
    tabTitle?: string
    tabFilters: TabFilterSettings<FilterType>[]
    tabMasterManager: TabMasterManager
    filtersMode: LogicalMode
    categoriesToInclude: number //bit field
    autoHide: boolean
    visibleToOthers: boolean
    sortBy: number
}

/**
 * The modal for editing and creating custom tabs.
 */
export const EditTabModal: VFC<EditTabModalProps> = ({
    closeModal,
    onConfirm,
    tabId,
    tabTitle,
    tabFilters,
    tabMasterManager,
    filtersMode,
    categoriesToInclude,
    autoHide: _autoHide,
    visibleToOthers: _visibleToOthers,
    sortBy,
}) => {
    const [name, setName] = useState<string>(tabTitle ?? '')
    const [topLevelFilters, setTopLevelFilters] = useState<TabFilterSettings<FilterType>[]>(tabFilters)
    const [topLevelLogicMode, setTopLevelLogicMode] = useState<LogicalMode>(filtersMode)
    const [catsToInclude, setCatsToInclude] = useState<number>(categoriesToInclude)
    const [canSave, setCanSave] = useState<boolean>(false)
    const [canAddFilter, setCanAddFilter] = useState<boolean>(true)
    const [patchInput, setPatchInput] = useState<boolean>(true)
    const [autoHide, setAutoHide] = useState<boolean>(_autoHide)
    const [visibleToOthers, setVisibleToOthers] = useState<boolean>(_visibleToOthers)
    const [sortByOverride, setSortByOverride] = useState(sortBy)
    const sortOptions: SingleDropdownOption[] = useSortingMenuItems([])

    const nameInputElement = <TextField value={name} placeholder='The title for this tab' onChange={onNameChange} />

    //reference to input field class component instance, which has a focus method
    let inputComponentInstance: any

    if (patchInput) {
        afterPatch(
            nameInputElement.type.prototype,
            'render',
            function (_: any, ret: any) {
                //@ts-ignore     get reference to instance
                inputComponentInstance = this
                return ret
            },
            { singleShot: true }
        )
    }

    useEffect(() => {
        inputComponentInstance.Focus()
        setPatchInput(false)
    }, [])

    useEffect(() => {
        setCanSave(name != '' && topLevelFilters.length > 0 && canAddFilter)
    }, [name, topLevelFilters, canAddFilter])

    useEffect(() => {
        setCanAddFilter(topLevelFilters.length == 0 || topLevelFilters.every(filter => isValidParams(filter)))
    }, [topLevelFilters])

    function onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setName(e?.target.value)
    }

    function onSave() {
        if (canSave) {
            const updated: EditableTabSettings = {
                title: name,
                filters: topLevelFilters,
                filtersMode: topLevelLogicMode,
                categoriesToInclude: catsToInclude,
                autoHide: autoHide,
                sortByOverride: sortByOverride,
                visibleToOthers: visibleToOthers,
            }
            onConfirm(tabId, updated)
            closeModal!()
        } else {
            if (!canAddFilter) PythonInterop.toast('Cannot Save Tab', 'Some filters are incomplete')
            else PythonInterop.toast('Cannot Save Tab', 'Please add a name and at least 1 filter')
        }
    }

    function addFilter() {
        const updatedFilters = [...topLevelFilters]
        updatedFilters.push({
            type: 'collection',
            inverted: false,
            params: FilterDefaultParams().collection,
        })
        setTopLevelFilters(updatedFilters)
    }

    return (
        <TabMasterContextProvider tabMasterManager={tabMasterManager}>
            <ModalStyles />
            <div className='tab-master-modal-scope'>
                <ConfirmModal
                    bAllowFullSize
                    onCancel={closeModal}
                    onEscKeypress={closeModal}
                    strTitle={tabTitle ? `Modifying: ${tabTitle}` : 'Create New Tab'}
                    onOK={onSave}
                    strOKButtonText='Save'
                >
                    <Focusable onMenuButton={onSave} onMenuActionDescription='Save'>
                        <div style={{ padding: '4px 16px 1px' }} className='name-field'>
                            <Field
                                description={
                                    <>
                                        <div
                                            style={{ paddingBottom: '6px' }}
                                            className={quickAccessControlsClasses.PanelSectionTitle}
                                        >
                                            Name
                                        </div>
                                        {nameInputElement}
                                    </>
                                }
                            />
                        </div>
                        <IncludeCategoriesPanel
                            categoriesToInclude={catsToInclude}
                            setCategoriesToInclude={setCatsToInclude}
                        />
                        <div className='field-item-container'>
                            <ToggleField
                                label='Automatically hide tab if empty'
                                checked={autoHide}
                                onChange={checked => setAutoHide(checked)}
                                bottomSeparator='thick'
                            />
                            <ToggleField
                                label='Other users can copy this tab'
                                checked={visibleToOthers}
                                onChange={checked => setVisibleToOthers(checked)}
                                bottomSeparator='thick'
                            />
                            <DropdownItem
                                label='Sort apps by'
                                rgOptions={sortOptions}
                                selectedOption={sortByOverride}
                                onChange={option => setSortByOverride(option.data)}
                                bottomSeparator='thick'
                            />
                        </div>
                        <FiltersPanel
                            groupFilters={topLevelFilters}
                            setGroupFilters={setTopLevelFilters}
                            addFilter={addFilter}
                            groupLogicMode={topLevelLogicMode}
                            setGroupLogicMode={setTopLevelLogicMode}
                            canAddFilter={canAddFilter}
                            collapseFilters={!!tabTitle}
                        />
                    </Focusable>
                </ConfirmModal>
            </div>
        </TabMasterContextProvider>
    )
}

type IncludeCategoriesPanelProps = {
    categoriesToInclude: number
    setCategoriesToInclude: React.Dispatch<React.SetStateAction<number>>
}
/**
 * Section for selecting categories to include in tab
 */
const IncludeCategoriesPanel: VFC<IncludeCategoriesPanelProps> = ({ categoriesToInclude, setCategoriesToInclude }) => {
    const [isOpen, setIsOpen] = useState(false)

    const catsToIncludeObj = getIncludedCategoriesFromBitField(categoriesToInclude)

    const showHiddenCat = Object.entries(catsToIncludeObj)
        .filter(([cat]) => cat !== 'hidden')
        .some(([_cat, checked]) => checked)

    const getCatLabel = (category: string) => (category === 'music' ? 'Soundtracks' : capitalizeFirstLetter(category))

    let catStrings = []
    for (const cat in catsToIncludeObj) {
        const include = catsToIncludeObj[cat as keyof typeof catsToIncludeObj]

        include && (cat !== 'hidden' || showHiddenCat) && catStrings.push(getCatLabel(cat))
    }

    return (
        <>
            <div>
                <Focusable
                    style={{ margin: '0 calc(-12px - 1.4vw)' }}
                    onActivate={() => {
                        playUISound('/sounds/deck_ui_misc_01.wav')
                        setIsOpen(isOpen => !isOpen)
                    }}
                    noFocusRing={true}
                    className='highlight-on-focus'
                    focusClassName='start-focused'
                >
                    <div style={{ margin: '0 calc(12px + 1.4vw)', padding: '0 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div
                                style={{ padding: '12px 0', float: 'left' }}
                                className={quickAccessControlsClasses.PanelSectionTitle}
                            >
                                Include in tab
                            </div>
                            <div style={{ padding: '12px 40px', flex: '1' }}>
                                {!isOpen && (
                                    <span style={{ fontSize: '12px', lineHeight: '12px', color: '#8b929a' }}>
                                        {catStrings.join(', ')}
                                    </span>
                                )}
                            </div>
                            <div style={{ paddingRight: '10px', display: 'flex', alignItems: 'center' }}>
                                <BiSolidDownArrow
                                    style={{
                                        transform: !isOpen ? 'rotate(90deg)' : '',
                                        transition: 'transform 0.2s ease-in-out',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </Focusable>
                {isOpen && (
                    <div style={{ padding: '10px 18px' }}>
                        {Object.entries(catsToIncludeObj).map(([category, shouldInclude]) => {
                            const label = getCatLabel(category)

                            const onChange = (checked: boolean) => {
                                playUISound(
                                    checked
                                        ? '/sounds/deck_ui_switch_toggle_on.wav'
                                        : '/sounds/deck_ui_switch_toggle_off.wav'
                                )
                                setCategoriesToInclude(currentCatsBitField =>
                                    updateCategoriesToIncludeBitField(currentCatsBitField, { [category]: checked })
                                )
                            }
                            return category === 'hidden' && !showHiddenCat ? null : (
                                <DialogCheckbox checked={shouldInclude} onChange={onChange} label={label} />
                            )
                        })}
                    </div>
                )}
            </div>
            <div
                style={{
                    position: 'relative',
                    left: 'calc(16px - 1.8vw)',
                    right: 'calc(16px - 1.8vw)',
                    height: '1px',
                    background: '#ffffff1a',
                }}
            />
        </>
    )
}

/**
 * Function to show the EditTabModal when creating a new tab.
 * @param tabMasterManager TabMasterManager instance.
 */
export function showModalNewTab(tabMasterManager: TabMasterManager) {
    showModal(
        <EditTabModal
            onConfirm={(_: any, tabSettings: EditableTabSettings) => {
                tabMasterManager.createCustomTab(
                    tabSettings.title,
                    tabMasterManager.getTabs().visibleTabsList.length,
                    tabSettings.filters,
                    tabSettings.filtersMode,
                    tabSettings.categoriesToInclude,
                    tabSettings.autoHide,
                    tabSettings.visibleToOthers,
                    tabSettings.sortByOverride
                )
            }}
            tabFilters={[]}
            tabMasterManager={tabMasterManager}
            filtersMode='and'
            categoriesToInclude={IncludeCategories.games}
            autoHide={false}
            visibleToOthers={false}
            sortBy={-1}
        />
    )
}

/**
 * Function to show the EditTabModal when duplicating a tab.
 * @param tabContainer CustomTabContainer to duplicate.
 * @param tabMasterManager TabMasterManager instance.
 */
export function showModalDuplicateTab(tabContainer: CustomTabContainer, tabMasterManager: TabMasterManager) {
    showModal(
        <EditTabModal
            onConfirm={(_: any, tabSettings: EditableTabSettings) => {
                tabMasterManager.createCustomTab(
                    tabSettings.title,
                    tabMasterManager.getTabs().visibleTabsList.length,
                    tabSettings.filters,
                    tabSettings.filtersMode,
                    tabSettings.categoriesToInclude,
                    tabSettings.autoHide,
                    tabSettings.visibleToOthers,
                    tabSettings.sortByOverride
                )
            }}
            tabMasterManager={tabMasterManager}
            tabFilters={structuredClone(tabContainer.filters)}
            filtersMode={tabContainer.filtersMode}
            categoriesToInclude={tabContainer.categoriesToInclude}
            autoHide={tabContainer.autoHide}
            visibleToOthers={tabContainer.visibleToOthers}
            sortBy={tabContainer.sortByOverride}
        />
    )
}

/**
 * Function to show the EditTabModal when editing a tab.
 * @param tabContainer CustomTabContainer to edit.
 * @param tabMasterManager TabMasterManager instance.
 */
export function showModalEditTab(tabContainer: CustomTabContainer, tabMasterManager: TabMasterManager) {
    showModal(
        <EditTabModal
            onConfirm={(tabId: string | undefined, updatedTabSettings: EditableTabSettings) => {
                tabMasterManager.updateCustomTab(tabId!, updatedTabSettings)
            }}
            tabId={tabContainer.id}
            tabTitle={tabContainer.title}
            tabFilters={tabContainer.filters}
            tabMasterManager={tabMasterManager}
            filtersMode={tabContainer.filtersMode}
            categoriesToInclude={tabContainer.categoriesToInclude}
            autoHide={tabContainer.autoHide}
            visibleToOthers={tabContainer.visibleToOthers}
            sortBy={tabContainer.sortByOverride}
        />
    )
}
