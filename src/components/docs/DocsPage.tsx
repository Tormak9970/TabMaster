import { VFC, Fragment } from "react";
import MarkDownIt from "markdown-it";
import { Focusable, gamepadDialogClasses, ModalPosition, ScrollPanelGroup } from "decky-frontend-lib";

const mdIt = new MarkDownIt({
  html: true
});

export const DocPage: VFC<{ content: string }> = ({ content }) => {
  return (
    <>
      <style>{`
        .tab-master-docs table {
          border: 1px solid;
          border-collapse: collapse;
        }

        .tab-master-docs th {
          padding: 0 7px;
          border: 1px solid;
        }

        .tab-master-docs td {
          padding: 0 7px;
          border: 1px solid;
        }

        .tab-master-docs tr:nth-child(odd) {
          background-color: #1B2838;
        }

        .tab-master-docs .${gamepadDialogClasses.ModalPosition} {
          padding: 0;
        }

        .tab-master-docs > .Panel.Focusable.gpfocuswithin {
          background-color: #868da117;
        }

        .tab-master-docs img {
          max-width: 588px;
        }

        .tab-master-docs code {
          color: #f1ac4f;
          padding: 2px 4px;
          border-radius: 4px;
        }
      `}</style>
      <div className="tab-master-docs">
        <ModalPosition >
          <Focusable style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
            <ScrollPanelGroup
              //@ts-ignore
              focusable={false}
              style={{ flex: 1, minHeight: 0, padding: "12px" }}
              scrollPaddingTop={32}
            >
              <Focusable onActivate={() => {}} noFocusRing={true} >
                <div dangerouslySetInnerHTML={{ __html: mdIt.render(content) }} />
              </Focusable>
            </ScrollPanelGroup>
          </Focusable>
        </ModalPosition>
      </div>
    </>
  );
};
