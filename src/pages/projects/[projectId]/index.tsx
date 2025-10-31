import type { LayoutOutletContext } from "@/pages/layout";
import { useFetchDataManagerColumns, type ColumnDefinition } from "@/stores/data-manager-columns";
import { useCreateDataManagerView, useFetchDataManagerView, type DataManagerViewType } from "@/stores/data-manager-view";
import { useFetchProjectDetail, type ProjectDetailType } from "@/stores/project-detail";
import { useFetchUsers, type User } from "@/stores/users";
import { LoadingOverlay } from "@mantine/core";
import { useEffect } from "react";
import { Outlet, useOutletContext, useParams } from "react-router-dom";

export interface ProjectDetailContext extends LayoutOutletContext {
  project?: ProjectDetailType;
  users?: User[];
  columns?: ColumnDefinition[];
  view?: DataManagerViewType;
}

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId?: string }>();
  const context = useOutletContext<LayoutOutletContext>();

  const { data: project, loading: fetchProjectLoading } = useFetchProjectDetail(parseInt(projectId || "0"), { disable: !projectId });
  const { data: users, loading: fetchUsersLoading } = useFetchUsers(parseInt(projectId || "0"), { disable: !projectId });
  const { data: dmColumns, loading: fetchColumnsLoading } = useFetchDataManagerColumns(parseInt(projectId || "0"), { disable: !projectId });
  const { data: views, loading: fetchViewsLoading } = useFetchDataManagerView(parseInt(projectId || "0"), { disable: !projectId });
  const { columns = [] } = dmColumns || {};
  const view = views.find(v => v.data.title == context?.currentUser?.email);

  const { mutate: createView, loading: loadingCreateView } = useCreateDataManagerView(parseInt(projectId || "0"));
  useEffect(() => {
    if (!context?.currentUser?.email) return;
    if (fetchViewsLoading) return;
    if (view) return;
    
    createView({ title: context?.currentUser?.email || "Default View" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context?.currentUser?.email, fetchViewsLoading, view]);

  if (fetchProjectLoading || fetchUsersLoading || fetchColumnsLoading || fetchViewsLoading || loadingCreateView) return (
    <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
  );

  return (
    <Outlet context={{ ...context, project, users, columns, view }} />
  );
}