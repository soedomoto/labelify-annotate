import type { LayoutOutletContext } from "@/pages/layout";
import { useFetchDataManagerColumns, type ColumnDefinition } from "@/stores/data-manager-columns";
import { useFetchDataManagerView, type DataManagerViewType } from "@/stores/data-manager-view";
import { useFetchProjectDetail, type ProjectDetailType } from "@/stores/project-detail";
import { useFetchUsers, type User } from "@/stores/users";
import { Outlet, useOutletContext, useParams } from "react-router-dom";

export interface ProjectDetailContext extends LayoutOutletContext {
  project?: ProjectDetailType;
  users?: User[];
  view?: DataManagerViewType;
  columns?: ColumnDefinition[];
}

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId?: string }>();
  const context = useOutletContext<LayoutOutletContext>();
  const { data: project } = useFetchProjectDetail(parseInt(projectId || "0"), { disable: !projectId });
  const { data: users } = useFetchUsers(parseInt(projectId || "0"));
  const { data: dmView } = useFetchDataManagerView(parseInt(projectId || "0"));
  const [view] = dmView || [];
  const { data: dmColumns } = useFetchDataManagerColumns(parseInt(projectId || "0"));
  const { columns = [] } = dmColumns || {};

  return (
    <Outlet context={{ ...context, project, users, view, columns }} />
  );
}