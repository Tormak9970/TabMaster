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
    <SimpleModal active={true}>
      <div className="filter-desc-modal">
        <ModalPosition>
          <div>
            <h2 style={{ margin: '45px 0 5px' }}>Filter Descriptions</h2>
          </div>
          <Panel style={{ display: "flex", flexDirection: "column", minHeight: 0, flex: 1, WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 5%)' }}>
            <ScrollPanelGroup focusable={false} style={{ flex: 1, minHeight: 0, padding: "12px 0" }} >
              <Panel focusable={true} noFocusRing={true} onActivate={closeModal} onCancel={closeModal}>
                <div>
                  <p><b>Collection: </b><small>Select games that are in a certain Steam Collection.</small></p>
                  <p><b>Installed: </b><small>Select games that are installed or not installed.</small></p>
                  <p><b>Regex: </b><small>Select games whose titles match a regular expression.</small></p>
                  <p><b>Friends: </b><small>Select games that are also owned by any/ all friends.</small></p>
                  <p><b>Tags: </b><small>Select games that have any/ all specific tags.</small></p>
                  <p><b>Whitelist: </b><small>Select games that are added to the list.</small></p>
                  <p><b>Blacklist: </b><small>Select games that are not added to the list.</small></p>
                  <p><b>Merge: </b><small>Select games that pass a subgroup of combined filters. Multiple filters are combined into one in the same way they are at the top level and can be set to include games that pass any/ all filters in subgroup.</small></p>
                  <p><b>Platform: </b><small>Select Steam or non-Steam games.</small></p>
                  <p><b>Deck Compatibility: </b><small>Select games that have a specific Steam Deck compatibilty status.</small></p>
                </div>
                <hr style={{ border: 'none', height: '1px', background: '#5e696f' }} />
                <p>
                  <small>
                    <p>"Default" includes games that are selected by a filter, "invert" inlcudes games that are not selected by a filter.</p>
                    <p>"And" mode includes games that pass all filters, "or" mode includes games that pass any filter</p>
                  </small>
                </p>
              </Panel>
            </ScrollPanelGroup>
          </Panel>
        </ModalPosition>
      </div >
    </SimpleModal>
  </>;
};
