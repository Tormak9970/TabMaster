import { VFC, Fragment } from "react";

import MarkDownIt from "markdown-it";
import { Focusable } from "decky-frontend-lib";
import { ScrollPanel } from "./Scrollable";

const mdIt = new MarkDownIt({ //try "commonmark"
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
      `}</style>
      <div className="tab-master-docs">
        <Focusable>
          <ScrollPanel>
            <Focusable>
              <div dangerouslySetInnerHTML={{ __html: mdIt.render(content) }} />
            </Focusable>
          </ScrollPanel>
        </Focusable>
      </div>
    </>
  );
}
