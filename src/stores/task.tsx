/* eslint-disable @typescript-eslint/no-explicit-any */

import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";

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

export interface Annotation {
  id: number;
  result: AnnotationResult[];
  created_username: string;
  created_ago: string;
  completed_by: CompletedBy;
  was_cancelled: boolean;
  ground_truth: boolean;
  created_at: string;
  updated_at: string;
  draft_created_at: string | null;
  lead_time: number;
  import_id: number | null;
  last_action: string | null;
  bulk_created: boolean;
  task: number;
  project: number;
  updated_by: number;
  parent_prediction: number | null;
  parent_annotation: number | null;
  last_created_by: number | null;
}

export interface AnnotationResult {
  value: DraftValue;
  id: string;
  from_name: string;
  to_name: string;
  type: "choices" | "textarea";
  origin: string;
}

export interface Draft {
  id: number;
  user: string;
  created_username: string;
  created_ago: string;
  result: DraftResult[];
  lead_time: number;
  was_postponed: boolean;
  import_id: number | null;
  created_at: string;
  updated_at: string;
  task: number;
  annotation: number | null;
}

export interface DraftResult {
  value: DraftValue;
  id: string;
  from_name: string;
  to_name: string;
  type: "choices" | "textarea";
  origin: string;
}

export interface DraftValue {
  choices?: string[];
  text?: string[];
}

export interface CompletedBy {
  id: number;
  first_name: string;
  last_name: string;
  avatar: string | null;
  email: string;
  initials: string;
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
  }, [taskId, projectId]);

  return { loading, data: task }
}