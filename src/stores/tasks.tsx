import { useState, useEffect } from "react";

export type Task = {
  id: number;
  drafts: unknown[];
  annotators: number[];
  inner_id: number;
  cancelled_annotations: number;
  total_annotations: number;
  total_predictions: number;
  completed_at: string;
  annotations_results: string;
  predictions_results: string;
  file_upload: unknown | null;
  storage_filename: unknown | null;
  annotations_ids: string;
  predictions_model_versions: string;
  updated_by: {
    user_id: number;
  }[];
  data: Record<string, unknown>;
  meta: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  is_labeled: boolean;
  overlap: number;
  comment_count: number;
  unresolved_comment_count: number;
  last_comment_updated_at: string | null;
  project: number;
  comment_authors: unknown[];
  page: number;
}

export type TaskResult = {
  total: number;
  total_annotations: number;
  total_predictions: number;
  tasks: Task[];
}

export function useFetchTasks(page: number = 1, pageSize: number = 30, projectId: number, viewId: number) {
  const [loading, setLoading] = useState(true);
  const [pTasks, setPTasks] = useState<Record<number, Task[]>>({});
  const [data, setData] = useState<Omit<TaskResult, 'tasks'>>({ total: 0, total_annotations: 0, total_predictions: 0 });

  async function refetch({ page: oPage, clean }: { page?: number, clean?: true } = {}) {
    if (clean) setPTasks({});
    setLoading(true);
    await fetch(`./api/tasks?page=${page}&page_size=${pageSize}&view=${viewId}&project=${projectId}`)
      .then((res) => res.json())
      .catch((error) => {
        console.error('Error fetching tasks:', error);
      })
      .then(data => {
        setData(data);
        setPTasks(pTasks => ({ ...pTasks, [oPage || page]: (data?.tasks || []).map((t: Record<string, unknown>) => ({ ...t, page: oPage || page })) }));
      });
    setLoading(false);
  }

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, projectId, viewId]);

  const tasks = Object.keys(pTasks).reduce((arr, p) => ([...arr, ...pTasks[parseInt(p)]]), [] as Task[]);
  return { loading, data: { ...data, tasks }, refetch }
}