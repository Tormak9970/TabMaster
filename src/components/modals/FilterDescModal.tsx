import { Fragment } from "react";
import { SimpleModal, ModalPosition, Panel, ScrollPanel } from "../docs/Scrollable";
import { FocusRing } from "decky-frontend-lib";

export const FitlerDescModal = () => {
  return <>
    <SimpleModal active={true}>
      <ModalPosition>
        <FocusRing>
          
        <Panel style={{ display: "flex", flexDirection: "column", minHeight: 0, flex: 1 }}>
          <ScrollPanel focusable={true} style={{ flex: 1, minHeight: 0, padding: "12px" }} autoFocus={true} noFocusRing={true}>
            <Panel focusable={true} noFocusRing={true}>
              <div>
                <div>collection: </div>
                <div>installed: </div>
                <div>regex: </div>
                <div>friends: </div>
                <div>tags:</div>
                <div>whitelist:</div>
                <div>blacklist:</div>
                <div>merge: </div>
                <div>platform: </div>
                <div>deck compatibility:</div>
                <div>deck compatibility:</div>
                <div>deck compatibility:</div>
                <div>deck compatibility:</div>
                <div>deck compatibility:</div>
                <div>deck compatibility:</div>
                <div>deck compatibility:</div>
                <div>deck compatibility:</div>
                <div>deck compatibility:</div>
                <div>deck compatibility:</div>
                <div>deck compatibility:</div>
                <div>deck compatibility:</div>
                <div>deck compatibility:</div>
                <div>deck compatibility:</div>
                <div>deck compatibility:</div>
                <div>deck compatibility:</div>
                <div>deck compatibility:</div>
                <div>deck compatibility:</div>
                <div>deck compatibility:</div>
              </div>
            </Panel>
            <Panel focusable={true} noFocusRing={true}></Panel>

          </ScrollPanel>
        </Panel>
        </FocusRing>
      </ModalPosition>
    </SimpleModal>
  </>;
};
