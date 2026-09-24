"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { DemoProvider } from "./DemoProvider";
import {
  About,
  ArtworkDetail,
  CollectionPage,
  CollectionsPage,
  Commissions,
  Contact,
  DemoBar,
  DemoInformation,
  Home,
  NotFound,
  PublicExhibitions,
  PublicHeader,
  WorkCatalogue
} from "./PublicViews";
import {
  ArtworkEditor,
  PortfolioMode,
  StudioArtwork,
  StudioCollections,
  StudioEnquiries,
  StudioExhibitions,
  StudioHome,
  StudioProfile,
  StudioShell,
  StudioWork
} from "./StudioViews";

function RoutedApp() {
  const path = usePathname() || "/";
  const parts = path.split("/").filter(Boolean);

  if (path === "/portfolio") return <PortfolioMode />;

  if (path.startsWith("/studio")) {
    let content: React.ReactNode;
    if (path === "/studio") content = <StudioHome />;
    else if (path === "/studio/work") content = <StudioWork />;
    else if (path === "/studio/add") content = <ArtworkEditor />;
    else if (path === "/studio/collections") content = <StudioCollections />;
    else if (path === "/studio/enquiries") content = <StudioEnquiries />;
    else if (path === "/studio/exhibitions") content = <StudioExhibitions />;
    else if (path === "/studio/profile") content = <StudioProfile />;
    else if (parts[1] === "artwork" && parts[2]) content = <StudioArtwork id={parts[2]} />;
    else content = <StudioHome />;
    return <StudioShell path={path}>{content}</StudioShell>;
  }

  let page: React.ReactNode;
  if (path === "/") page = <Home />;
  else if (path === "/work") page = <WorkCatalogue />;
  else if (parts[0] === "work" && parts[1]) page = <ArtworkDetail slug={parts[1]} />;
  else if (path === "/collections") page = <CollectionsPage />;
  else if (parts[0] === "collections" && parts[1]) page = <CollectionPage slug={parts[1]} />;
  else if (path === "/about") page = <About />;
  else if (path === "/exhibitions") page = <PublicExhibitions />;
  else if (path === "/commissions") page = <Commissions />;
  else if (path === "/contact") page = <Contact />;
  else if (path === "/demo-information") page = <DemoInformation />;
  else page = <NotFound />;

  return <div className="public-site"><a className="skip-link" href="#main-content">Skip to content</a><DemoBar /><PublicHeader /><main id="main-content">{page}</main><footer className="public-footer"><div><strong>MARA ELLISON</strong><span>PAINTINGS FROM COAST, MOOR AND WEATHER.</span></div><div><a href="/demo-information">DEMO INFORMATION</a><a href="https://web.orvia.org.uk/">ORVIA WEB</a></div><small>Fictional demonstration content. © ORVIA Web showcase.</small></footer></div>;
}

export default function DemoApp() {
  return <DemoProvider><Suspense fallback={<div className="route-loading">Loading demonstration…</div>}><RoutedApp /></Suspense></DemoProvider>;
}
