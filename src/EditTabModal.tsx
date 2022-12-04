import {
	Button,
	ButtonItem,
	ConfirmModal, Dropdown,
	Field,
	PanelSection,
	PanelSectionRow,
	TextField, ToggleField
} from "decky-frontend-lib";
import {useState, VFC, Fragment} from "react";
import {FilterElement, LibraryTabElement} from "./LibraryTab";
import {FaTrash} from "react-icons/all";
import {cloneDeep} from "lodash";

type EditModalProps = {
	closeModal: () => void,
	onConfirm?(shortcut: LibraryTabElement): any,
	title?: string,
	tab: LibraryTabElement,
}

const FilterTypes: string[] = [
	"collection",
	"installed",
	"regex"
]

export const EditTabModal: VFC<EditModalProps> = ({
	                                                        closeModal,
	                                                        onConfirm = () =>
	                                                        {
	                                                        },
	                                                        tab,
	                                                        title = `Modifying: ${tab.title}`,
                                                        }) =>
{
	const [id, setId] = useState<string>(tab.id);
	const [name, setName] = useState<string>(tab.title);
	const [filters, setFilters] = useState<FilterElement<any>[]>(tab.filters);

	return (
			<>
				<ConfirmModal
						bAllowFullSize
						onCancel={closeModal}
						onEscKeypress={closeModal}

						onOK={() =>
						{
							const updated: LibraryTabElement = {
								custom: tab.custom, id, title: name, filters, position: tab.position
							};
							onConfirm(updated);
							closeModal();
						}}>
					<PanelSection title={title}>
						<PanelSectionRow>
							<Field
									label="Name"
									description={
										<TextField
												value={name}
												onChange={(e) =>
												{
													setName(e?.target.value)
												}}
										/>}
							/>
						</PanelSectionRow>
						{(() =>
						{
							if (tab.custom)
							{
								return <PanelSectionRow>
									<Field
											label="ID"
											description={
												<TextField
														value={id}
														onChange={(e) =>
														{
															setId(e?.target.value)
														}}
												/>}
									/>
								</PanelSectionRow>;
							} else return <Fragment/>;
						})()}
						{(() =>
						{
							if (tab.custom)
							{
								return <PanelSectionRow>

									<Fragment>
										<ButtonItem onClick={() =>
										{
											const filter = cloneDeep(filters);
											filter.push({
												type: "",
												params: {}
											});
											setFilters(filter);
										}}>
											Add Filter
										</ButtonItem>
										{
											(() =>
											{
												return filters.map((filter, index) =>
												{
													return <Fragment>
														<Field
																label="Type"
																description={
																	(() =>
																	{
																		if (filter)
																		{
																			return <Fragment>
																				<Dropdown
																						rgOptions={FilterTypes.map(type =>
																						{
																							return {
																								label: type,
																								data: type
																							}
																						})} selectedOption={filter.type}
																						onChange={data =>
																						{
																							const filter1 = cloneDeep(filter);
																							filter1.type = data.data;
																							const filters1 = cloneDeep(filters);
																							filters1[index] = filter1;
																							setFilters(filters1);
																						}}/>
																				<Button onClick={() =>
																				{
																					const filters1 = cloneDeep(filters);
																					delete filters1[index];
																					setFilters((filters1));
																				}}>
																					<FaTrash/>
																				</Button>
																			</Fragment>
																		} else return <Fragment/>
																	})()}
														/>
														{
															(() =>
															{
																if (filter)
																{
																	switch (filter.type)
																	{
																		case "collection":
																			return <Fragment>
																				<Field
																						label="Collection"
																						description={
																							<TextField
																									value={filter.params.collection_name}
																									onChange={e =>
																									{
																										const filter1 = cloneDeep(filter);
																										filter1.params.collection_name = e?.target.value;
																										const filters1 = cloneDeep(filters);
																										filters1[index] = filter1;
																										setFilters(filters1);
																									}}
																							/>
																						}
																				/>
																			</Fragment>
																		case "installed":
																			return <Fragment>
																				<ToggleField
																						label="Installed"
																						checked={filter.params.installed}
																						onChange={checked =>
																						{
																							const filter1 = cloneDeep(filter);
																							filter1.params.installed = checked ?? false;
																							const filters1 = cloneDeep(filters);
																							filters1[index] = filter1;
																							setFilters(filters1);
																						}}
																				/>
																			</Fragment>
																		case "regex":
																			return <Fragment>
																				<Field
																						label="Regex"
																						description={
																							<TextField
																									value={filter.params.regex}
																									onChange={e =>
																									{
																										const filter1 = cloneDeep(filter);
																										filter1.params.regex = e?.target.value;
																										const filters1 = cloneDeep(filters);
																										filters1[index] = filter1;
																										setFilters(filters1);
																									}}
																							/>
																						}
																				/>
																			</Fragment>
																		default:
																			return <Fragment/>
																	}
																} else return <Fragment/>
															})()
														}
													</Fragment>;
												});
											})()
										}
									</Fragment>
								</PanelSectionRow>
							} else return <Fragment/>;
						})()}
					</PanelSection>
				</ConfirmModal>
			</>
	)
}