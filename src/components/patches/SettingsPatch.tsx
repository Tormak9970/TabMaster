import { ConfirmModal, ServerAPI, afterPatch, showModal } from "decky-frontend-lib";
import { ReactElement } from "react";
import { TabMasterManager } from "../../state/TabMasterManager";

export const patchSettings = (serverAPI: ServerAPI, tabMasterManager: TabMasterManager) => {
  return serverAPI.routerHook.addPatch("/settings", (props: { path: string; children: ReactElement }) => {
    //* This only runs once which is perfect
    afterPatch(props.children, 'type', (_: any, ret: any) => {
      console.log('ret 1', ret);

      let firstCache: any;
      let secondCache: any;

      //* This cache is definitely fine
      if (firstCache) {
        ret.type = firstCache;
      } else {
        afterPatch(ret, 'type', (_: any, ret: any) => {
          console.log('ret 2', ret);
          const homeElement = ret.props.children?.props?.pages?.find((obj: any) => obj.title === 'Home').content;
  
          if (secondCache) {
            homeElement.type = secondCache;
          } else {
            afterPatch(homeElement, 'type', (_: any, ret: any) => {
              console.log('ret 3', ret);
    
              const buttonElement = ret.props.children.find((elt: React.ReactElement) => {
                return elt.type.toString?.().includes('HomeSettings');
              });
    
              // console.log('button', buttonElement);
    
              if (tabMasterManager.getTabs().tabsMap.get('Collections')!.position === -1) {
                afterPatch(buttonElement, 'type', (_: any, ret: any) => {
                  // console.log('ret 4', ret);
                  const origOnClick = ret.props.onClick;
    
                  ret.props.onClick = () => {
                    showModal(
                      <ConfirmModal
                        strOKButtonText='Unhide and Manage'
                        onOK={() => {
                          tabMasterManager.showTab('Collections');
                          origOnClick();
                        }}
                        bDestructiveWarning={true}
                        strTitle="Collections Tab is hidden by Tab Master!"
                      >
                        In order to manage hidden games, Tab Master must unhide your Collections tab.
                      </ConfirmModal>
                    )
                  }
  
                  return ret;
                });
              }
    
              return ret;
            });
  
            secondCache = homeElement.type;
          }
  
          return ret;
        });

        firstCache = ret.type;
      }

      return ret;
    });

    return props;
  });
}