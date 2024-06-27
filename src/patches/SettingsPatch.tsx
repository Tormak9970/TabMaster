import { afterPatch, ConfirmModal, ServerAPI, showModal } from "decky-frontend-lib";
import { ReactElement } from "react";
import { TabMasterManager } from "../state/TabMasterManager";
import { LogController } from "../lib/controllers/LogController";

export const patchSettings = (serverAPI: ServerAPI, tabMasterManager: TabMasterManager) => {
  return serverAPI.routerHook.addPatch("/settings", (props: { path: string; children: ReactElement; }) => {
    afterPatch(props.children, 'type', (_: any, ret1: any) => {
      if (!ret1?.type) {
        LogController.raiseError('Failed to find settings element to patch');
        return ret1;
      }

      let firstCache: any;
      let secondCache: any;

      if (firstCache) {
        ret1.type = firstCache;
        return ret1;
      }
      
      afterPatch(ret1, 'type', (_: any, ret2: any) => {
        const homeElement = ret2?.props?.children?.props?.pages?.find((obj: any) => obj.route === '/settings/home')?.content;
        if (homeElement === undefined) {
          LogController.raiseError("Couldn't find home element to patch in settings");
          return ret2;
        }

        if (secondCache) {
          homeElement.type = secondCache;
          return ret2;
        }

        afterPatch(homeElement, 'type', (_: any, ret3: any) => {
          console.log('ret 3', ret3);

          const buttonElementContainer = ret3?.props?.children?.find((elt: React.ReactElement) => {
            return elt?.type?.toString?.().includes('HomeSettings');
          });

          if (buttonElementContainer === undefined) {
            LogController.raiseError("Couldn't find manage button component to patch in settings");
            return ret3;
          }

          afterPatch(buttonElementContainer, 'type', (_: any, ret4: any) => {
            //* if ret exists but cannot find onClick then raise error because it is assumed valve has changed something 
            if (ret4 && !ret4.props?.onClick) {
              LogController.raiseError("Couldn't patch button onClick fn in settings");
              return ret4;
            }

            //* if ret is null then it is assumed that user has no hidden items so there is no button. do no raise error in this case
            if (!ret4) return ret4;

            const origOnClick = ret4.props.onClick;

            ret4.props.onClick = () => {
              if (tabMasterManager.getTabs().tabsMap.get('Collections')!.position === -1) {
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
                    In order to manage hidden apps, Tab Master must unhide your Collections tab.
                  </ConfirmModal>
                );
              } else {
                origOnClick();
              }
            };

            return ret4;
          });

          return ret3;
        });

        secondCache = homeElement.type;

        return ret2;
      });
      
      firstCache = ret1.type;

      return ret1;
    });

    return props;
  });
};
