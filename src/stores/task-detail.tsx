/* eslint-disable @typescript-eslint/no-explicit-any */

import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";
import type { Annotation } from "./annotation";
import type { Draft } from "./draft";

export interface TaskDetail {
  id: number;
  predictions: any[];
  annotations: Annotation[];
  drafts: Draft[];
  annotators: number[];
  inner_id: number;
  cancelled_annotations: number;
  total_annotations: number;
  total_predictions: number;
  completed_at: string | null;
  annotations_results: string;
  predictions_results: string;
  predictions_score: number | null;
  file_upload: string;
  storage_filename: string | null;
  annotations_ids: string;
  predictions_model_versions: string;
  avg_lead_time: number | null;
  draft_exists: boolean;
  updated_by: UpdatedBy[];
  data: TaskData;
  meta: Record<string, any>;
  created_at: string;
  updated_at: string;
  is_labeled: boolean;
  overlap: number;
  comment_count: number;
  unresolved_comment_count: number;
  last_comment_updated_at: string | null;
  project: number;
  comment_authors: any[];
}

export interface UpdatedBy {
  user_id: number;
}

export interface TaskData {
  video_description: string;
  voice_to_text: string | null;
  username: string;
  id: number;
  tiktok_url: string;
  tiktok_embed_url: string;
}

const taskAtom = atom<TaskDetail | null>(null);

export function useFetchTaskDetail(taskId: number, projectId: number, options?: { disable?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useAtom(taskAtom);

  async function fetchTask() {
    setLoading(true);
    await fetch(`./api/tasks/${taskId}?project=${projectId}`)
      .then((res) => res.json())
      .catch((error) => {
        console.error('Error fetching tasks:', error);
      })
      .then(setTask);

    setLoading(false);
  }

  useEffect(() => {
    if (!options?.disable) fetchTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId, projectId, options?.disable]);

  return { loading, data: task , refetch: fetchTask };
}