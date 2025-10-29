import type { LayoutOutletContext } from "@/pages/layout";
import { Outlet, useOutletContext } from "react-router-dom";

export default function ProjectDetailPage() {
  const context = useOutletContext<LayoutOutletContext>();

  return (
    <Outlet context={context} />
  );
}