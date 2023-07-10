import { Fragment, VFC } from "react";
import { SimpleModal, ModalPosition, Panel, ScrollPanelGroup } from "../docs/Scrollable";

interface FilterDescModalProps {
  closeModal?: () => void;
}

export const FitlerDescModal: VFC<FilterDescModalProps> = ({ closeModal }) => {
  return <>
    <style>{`
        .filter-desc-modal .gamepaddialog_ModalPosition_30VHl {
          padding: 0;
          margin: 0 150px;
        }
      `}</style>
    <SimpleModal active={true}

    >
      <div className="filter-desc-modal">
        <ModalPosition>
          <div>
            <h2 style={{ margin: '45px 0 5px' }}>Filter Descriptions</h2>
          </div>
          <Panel style={{ display: "flex", flexDirection: "column", minHeight: 0, flex: 1, WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 5%)' }}>
            <ScrollPanelGroup focusable={false} style={{ flex: 1, minHeight: 0, padding: "12px" }} >
              <Panel focusable={true} noFocusRing={true} onActivate={closeModal} onCancel={closeModal} >
                <div>
                  <p>Collection: </p>
                  <p>Installed: </p>
                  <p>Regex: </p>
                  <p>Friends: </p>
                  <p>Tags:</p>
                  <p>Whitelist:</p>
                  <p>Blacklist:</p>
                  <p>Merge: </p>
                  <p>Platform: </p>
                  <p>Deck Compatibility:</p>
                </div>
              </Panel>
            </ScrollPanelGroup>
          </Panel>
        </ModalPosition>
      </div >
    </SimpleModal>
  </>;
};
