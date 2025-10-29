import { SidebarNavigation } from "@decky/ui";
import { VFC, ReactNode } from "react";

import { MdNumbers } from "react-icons/md";
import { DocPage } from "./DocsPage";

//@ts-ignore
import docs from "./docs.codegen";

type DocRouteEntry = {
  title: string,
  content: ReactNode,
  route: string,
  icon: ReactNode,
  hideTitle: boolean;
};

type DocRoutes = {
  [pageName: string]: DocRouteEntry;
};


/**
 * The documentation pages router for TabMaster.
 */
export const DocsRouter: VFC = () => {
  const docPages: DocRoutes = {};

  Object.entries(docs).map(([pageName, doc]) => {
    pageName = pageName.replace(/_/g, " ");
    
    docPages[pageName] = {
      title: pageName,
      content: <DocPage content={doc} />,
      route: `/tab-master-docs/${pageName.toLowerCase().replace(/ /g, "-")}`,
      icon: <MdNumbers />,
      hideTitle: true
    };
  });

  return (
    <SidebarNavigation
      title="TabMaster Docs"
      showTitle
      pages={[
        docPages["Overview"],
        docPages["Tabs"],
        docPages["Filters"],
        docPages["Tab Profiles"],
        docPages["The Fix System"]
      ]}
    />
  );
};
