import { SidebarNavigation } from "decky-frontend-lib";
import { VFC, ReactNode } from "react";

import { MdNumbers } from "react-icons/md";
import { DocPage } from "./DocsPage";

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

type DocsRouterProps = {
  docs: DocPages;
};

/**
 * The documentation pages router for TabMaster.
 */
export const DocsRouter: VFC<DocsRouterProps> = ({ docs }) => {
  const docPages: DocRoutes = {};
  Object.entries(docs).map(([pageName, doc]) => {
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
