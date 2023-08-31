import { Fragment, VFC } from "react";
import { SimpleModal, ModalPosition, Panel, ScrollPanelGroup } from "../docs/Scrollable";
import { gamepadDialogClasses } from "decky-frontend-lib";

interface FilterDescModalProps {
  closeModal?: () => void;
}

export const FitlerDescModal: VFC<FilterDescModalProps> = ({ closeModal }) => {
  return <>
    <style>{`
        .tab-master-filter-desc-modal .${gamepadDialogClasses.ModalPosition} {
          padding: 0;
          margin: 0 150px;
        }
      `}</style>
    <SimpleModal active={true}>
      <div className="tab-master-filter-desc-modal">
        <ModalPosition>
          <div>
            <h2 style={{ margin: '45px 0 5px' }}>Filter Descriptions</h2>
          </div>
          <Panel style={{ display: "flex", flexDirection: "column", minHeight: 0, flex: 1, WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 5%)' }}>
            <ScrollPanelGroup focusable={false} style={{ flex: 1, minHeight: 0, padding: "12px 0" }} >
              <Panel focusable={true} noFocusRing={true} onActivate={closeModal} onCancel={closeModal}>
                <div>
                  <p><b>Collection: </b><small>Selects games that are in a certain Steam Collection.</small></p>
                  <p><b>Installed: </b><small>Selects games that are installed or not installed.</small></p>
                  <p><b>Regex: </b><small>Selects games whose titles match a regular expression.</small></p>
                  <p><b>Friends: </b><small>Selects games that are also owned by friends.</small></p>
                  <p><b>Tags: </b><small>Selects games that have specific tags.</small></p>
                  <p><b>Whitelist: </b><small>Selects games that are added to the list.</small></p>
                  <p><b>Blacklist: </b><small>Selects games that are not added to the list.</small></p>
                  <p><b>Merge: </b><small>Selects games that pass a subgroup of filters. They behave like filters grouped in a tab, allowing you to set whether a game needs to pass all, or any of the filters in the subgroup.</small></p>
                  <p><b>Platform: </b><small>Selects Steam or Non-Steam games.</small></p>
                  <p><b>Deck Compatibility: </b><small>Selects games that have a specific Steam Deck compatibilty status.</small></p>
                </div>
                <hr style={{ border: 'none', height: '1px', background: '#5e696f' }} />
                <p>
                  <small>
                    <p>"Default" includes games that are selected by a filter, "invert" includes games that are not selected by a filter.</p>
                    <p>"And" mode includes games that pass all filters, "or" mode includes games that pass any filter.</p>
                  </small>
                </p>
                <br/>
                <p><small><em>See full documentation for detailed usage of filters</em></small></p>
              </Panel>
            </ScrollPanelGroup>
          </Panel>
        </ModalPosition>
      </div >
    </SimpleModal>
  </>;
};
