import {
  ModalRoot,
} from "@decky/ui";
import { VFC, useEffect, useState } from "react";
import { ListSearchModalStyles } from "../styles/ListSearchModalStyles";
import { PythonInterop } from "../../lib/controllers/PythonInterop";

export type SharedTabsModalProps = {
  closeModal?: () => void
}

export const SharedTabsModal: VFC<SharedTabsModalProps> = ({ closeModal }: SharedTabsModalProps) => {
  const [loading, setLoading] = useState(true)
  const [sharedTabs, setSharedTabs] = useState<TabSettingsDictionary>({})

  useEffect(() => {
    PythonInterop.getSharedTabs().then((res) => {
      if (res?.message || !res) {
        setSharedTabs({})
      } else {
        setSharedTabs(res as TabSettingsDictionary)
      }
      
      setLoading(false)
    })
  }, [])

  return (
    <div className="tab-master-list-search-modal">
      <ListSearchModalStyles />
      <ModalRoot onCancel={closeModal} onEscKeypress={closeModal}>
        
      </ModalRoot>
    </div>
  );
};
