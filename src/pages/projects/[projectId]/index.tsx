import type { LayoutOutletContext } from "@/pages/layout";
import { useFetchDataManagerColumns, type ColumnDefinition } from "@/stores/data-manager-columns";
import { useCreateDataManagerView, useFetchDataManagerView, useUpdateDataManagerView, type DataManagerViewType } from "@/stores/data-manager-view";
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
  const initialView = views.find(v => v.data.title == context?.currentUser?.email);

  const { mutate: createView, data: createdViewData, loading: loadingCreateView } = useCreateDataManagerView(parseInt(projectId || "0"));
  const { mutate: updateView, data: updatedViewData, loading: loadingUpdateView } = useUpdateDataManagerView(initialView?.id || 0, parseInt(projectId || "0"));
  const view = updatedViewData || createdViewData || initialView;

  useEffect(() => {
    if (!context?.currentUser?.email) return;
    if (fetchViewsLoading) return;
    if (view) return;

    createView({
      title: context?.currentUser?.email || "Default View",
      hiddenColumns: {
        explore: [
          "tasks:inner_id",
          "tasks:annotations_results",
          "tasks:annotations_ids",
          "tasks:predictions_score",
          "tasks:predictions_model_versions",
          "tasks:predictions_results",
          "tasks:file_upload",
          "tasks:storage_filename",
          "tasks:created_at",
          "tasks:updated_at",
          "tasks:updated_by",
          "tasks:avg_lead_time",
          "tasks:draft_exists",
          "tasks:data.assigned_annotators",
          "tasks:data.id",
          "tasks:total_predictions",
          "tasks:completed_at",
          "tasks:total_annotations",
          "tasks:cancelled_annotations"
        ]
      },
      filters: {
        conjunction: "and",
        items: [
          { filter: 'filter:tasks:data.assigned_annotators', operator: 'contains', value: context?.currentUser?.email || null, type: 'String' },
        ]
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context?.currentUser?.email, fetchViewsLoading, view]);

  useEffect(() => {
    if (!view) return;
    if ((view?.data?.filters?.items || []).map(f => f?.filter).includes('filter:tasks:data.assigned_annotators')) return;

    (async () => {
      await updateView({
        ...view.data,
        filters: {
          conjunction: view.data.filters?.conjunction || 'and',
          items: [
            ...(view.data.filters?.items || []),
            { filter: 'filter:tasks:data.assigned_annotators', operator: 'contains', value: context?.currentUser?.email || null, type: 'String' },
          ],
        },
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context?.currentUser?.email, view]);

  if (fetchProjectLoading || fetchUsersLoading || fetchColumnsLoading || fetchViewsLoading || loadingCreateView || loadingUpdateView) return (
    <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
  );

  return (
    <Outlet context={{ ...context, project, users, columns, view }} />
  );
}