import React, { Fragment, useEffect, useRef, useState } from "react";

import { FaEllipsisH, FaArrowsAltV } from "react-icons/fa";
import { ButtonItem, DialogButton, Field, Focusable } from "decky-frontend-lib";
import { GamepadButton, GamepadEvent } from "decky-frontend-lib"

interface Positioned {
    position: number
}

export type ReorderableEntry<T extends Positioned> = {
    key: string,
    label: string,
    data: T
}

export type ReorderableEntryProps<T extends Positioned> = {
    entry: ReorderableEntry<T>,
    index: number,
    action: (e:MouseEvent, entry:ReorderableEntry<T>) => void
}

export type ReorderableListData<T extends Positioned> = {
    [key:string]: ReorderableEntry<T>
}

export type ReloadData = {
    showReload: boolean,
    reload: () => Promise<void>,
    reloadLabel?: string
}

type ReorderableListProps<T extends Positioned> = {
    data: ReorderableListData<T>,
    action: (e:MouseEvent, entry:ReorderableEntry<T>) => void,
    onUpdate: (data: {[key:string]:T}) => void,
    reloadData: ReloadData
}

const ELEM_HEIGHT = 32; //height of each ReorderableEntry element

export function ReorderableList<T extends Positioned>(props: ReorderableListProps<T>) {
    let reorderEnabled = useRef(false);
    const touchOrigin = useRef({"x": -1, "y": -1});
    const mouseOrigin = useRef({"x": -1, "y": -1});
    let focusedSide = useRef(false); //false = left, true = right
    let focusIdx = useRef(0);

    let data = props.data;
    let onUpdate = props.onUpdate;
    let dataAsList:ReorderableEntry<T>[] = Object.values(props.data).sort((a, b) => a.data.position - b.data.position);

    const [update, setUpdate] = useState(0);
    
    useEffect(() => {
        dataAsList = [];
        dataAsList = Object.values(props.data).sort((a, b) => a.data.position - b.data.position);
        data = props.data;
    });

    function enableReorder() { reorderEnabled.current = true; }
    function disabledReorder() { reorderEnabled.current = false; }
    function forceUpdate() { setUpdate(update === 0 ? 1 : 0); }
    
    function ReorderableEntry(props: ReorderableEntryProps<T>) {
        const wrapperFocusable = useRef<HTMLDivElement>(null);
        const reorderBtn = useRef<HTMLDivElement>(null);
        const optionsBtn = useRef<HTMLDivElement>(null);

        let lastEvent = false;

        useEffect(() => {
            if (focusIdx.current === props.index) {
                if (!focusedSide.current) {
                    optionsBtn.current?.blur();
                    reorderBtn.current?.focus();
                } else {
                    reorderBtn.current?.blur();
                    optionsBtn.current?.focus();
                }
            }
        });

        function reorder(down:boolean) {
            if ((down && props.entry.data.position != dataAsList.length) || (!down && props.entry.data.position != 1)) {
                const thisData = props.entry;
                const previous = dataAsList[down ? props.index+1 : props.index-1];
                const tmp = thisData.data.position;
                thisData.data.position = previous.data.position;
                previous.data.position = tmp;
    
                const refs = data;
                refs[thisData.key] = thisData;
                refs[previous.key] = previous;
    
                const toSave:{[key:string]:T} = {};
                Object.values(refs).map((val:ReorderableEntry<T>) => {
                    toSave[val.key] = val.data;
                })
                onUpdate(toSave);

                if (down) {
                    focusIdx.current++;
                } else {
                    focusIdx.current--;
                }
            }
        }

        return (
            <Fragment>
                <div className="custom-buttons">
                    <Field label={props.entry.label} onActivate={() => { focusIdx.current = props.index; }} ref={wrapperFocusable}>
                        <Focusable
                            style={{
                                display: "flex",
                                width: "100%"
                            }}
                            onGamepadDirection={(e:GamepadEvent) => {
                                switch(e.detail.button) {
                                    case GamepadButton.DIR_DOWN: {
                                        
                                        if (reorderEnabled.current && props.entry.data.position === dataAsList.length) {
                                            e.preventDefault();
                                            e.stopImmediatePropagation();
                                        }

                                        if (reorderEnabled.current && props.entry.data.position != dataAsList.length) reorder(true);

                                        if (props.entry.data.position != dataAsList.length) {
                                            focusIdx.current++;
                                            forceUpdate();
                                        }
                                        break;
                                    }
                                    case GamepadButton.DIR_UP: {
                                        if (reorderEnabled.current && props.entry.data.position === 1) {
                                            e.preventDefault();
                                            e.stopImmediatePropagation();
                                        }

                                        if (reorderEnabled.current && props.entry.data.position != 1) reorder(false);
                                        
                                        if (props.entry.data.position != 1) {
                                            focusIdx.current--;
                                            forceUpdate();
                                        }
                                        break;
                                    }
                                    case GamepadButton.DIR_LEFT: {
                                        lastEvent = true;
                                        if (focusedSide.current) {
                                            focusedSide.current = false;
                                        }
                                        reorderEnabled.current = false;
                                    }
                                    case GamepadButton.DIR_RIGHT: {
                                        if (!lastEvent) {
                                            if (!focusedSide.current) {
                                                focusedSide.current = true;
                                            }
                                            reorderEnabled.current = false;
                                        } else {
                                            lastEvent = false;
                                        }
                                    }
                                }
                                return false;
                            }}
                            onMouseMove={(e:React.MouseEvent<HTMLDivElement>) => {
                                // once user has moved height of an entry, swap
                                if (reorderEnabled.current) {
                                    const dy = e.clientY - mouseOrigin.current.y;
                                    if (Math.abs(dy) >= ELEM_HEIGHT) {
                                        reorder(dy > 0);
                                        mouseOrigin.current = {
                                            "x": e.clientX,
                                            "y": e.clientY,
                                        }
                                    }
                                }
                            }}
                            onTouchMove={(e:React.TouchEvent<HTMLDivElement>) => {
                                if (reorderEnabled.current) {
                                    const dy = e.touches[0].clientY - touchOrigin.current.y;
                                    if (Math.abs(dy) >= ELEM_HEIGHT) {
                                        reorder(dy > 0);
                                        touchOrigin.current = {
                                            "x": e.touches[0].clientX,
                                            "y": e.touches[0].clientY,
                                        }
                                    }
                                }
                            }}
                        >
                            <DialogButton
                                style={{
                                    marginRight: "14px",
                                    minWidth: "30px",
                                    maxWidth: "60px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                                ref={reorderBtn}
                                // @ts-ignore
                                onOKActionDescription={"Hold to reorder items"}
                                onButtonDown={(e:GamepadEvent) => {
                                    switch(e.detail.button) {
                                        case GamepadButton.OK: {
                                            enableReorder();
                                        }
                                    }
                                }}
                                onButtonUp={(e:GamepadEvent) => {
                                    switch(e.detail.button) {
                                        case GamepadButton.OK: {
                                            disabledReorder();
                                        }
                                    }
                                }}
                                onMouseDown={(e:MouseEvent) => {
                                    mouseOrigin.current = {
                                        "x": e.clientX,
                                        "y": e.clientY,
                                    }
                                    enableReorder();
                                }}
                                onTouchStart={(e:TouchEvent) => {
                                    touchOrigin.current = {
                                        "x": e.touches[0].clientX,
                                        "y": e.touches[0].clientY,
                                    }
                                    enableReorder();
                                }}
                            >
                                <FaArrowsAltV />
                            </DialogButton>
                            <DialogButton
                                style={{
                                    minWidth: "30px",
                                    maxWidth: "60px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                                onClick={(e:MouseEvent) => {props.action(e, props.entry);}}
                                ref={optionsBtn}
                            >
                                <FaEllipsisH />
                            </DialogButton>
                        </Focusable>
                    </Field>
                </div>
            </Fragment>
        );
    }
    
    return (
        <Fragment>
            <style>{`
                .scoper {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                }
            `}</style>
            <div className="scoper"
            onMouseUp={() => {
                mouseOrigin.current = {
                    "x": -1,
                    "y": -1,
                }
                disabledReorder();
            }}
            onTouchEnd={() => {
                touchOrigin.current = {
                    "x": -1,
                    "y": -1,
                }
                disabledReorder();
            }}
            >
                {dataAsList.length > 0 ?
                    dataAsList.map((itm: ReorderableEntry<T>, i:number) => (
                        <ReorderableEntry entry={itm} index={i} action={props.action} />
                    )) : (
                        <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", padding: "5px"}}>
                            No data to display right now.
                        </div>
                    )
                }
                {props.reloadData.showReload ? (
                    <ButtonItem layout="below" onClick={props.reloadData.reload} bottomSeparator='none'>
                        Reload {props.reloadData.reloadLabel}
                    </ButtonItem>
                ) : ""}
            </div>
        </Fragment>
    );
}