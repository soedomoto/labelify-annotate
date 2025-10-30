import { Outlet, useOutletContext } from "react-router-dom";
import type { ProjectDataContext } from "..";

export default function PaginatedTasksPage() {
  const context = useOutletContext<ProjectDataContext>();

  return (
    <Outlet context={context} />
  );
}