import { useState } from "react";
import type { Draft, DraftResult } from "./draft";

export interface Annotation {
  id: number;
  result: DraftResult[];
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

export interface CompletedBy {
  id: number;
  first_name: string;
  last_name: string;
  avatar: string | null;
  email: string;
  initials: string;
}

export function useSubmitAnnotation(taskId: number, projectId: number) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<unknown>(null);

  async function mutate(draft: Draft) {
    setLoading(true);
    await fetch(`./api/tasks/${taskId}/annotations?project=${projectId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "lead_time": 162.307,
        "result": draft?.result,
        "draft_id": draft?.id,
        "parent_prediction": null,
        "parent_annotation": null,
        "started_at": new Date().toISOString(),
        "project": projectId,
      }),
    })
      .then((res) => res.json())
      .catch((error) => {
        console.error('Error saving task annotation:', error);
      })
      .then((responseData) => {
        setData(responseData);
      });

    setLoading(false);
  }

  return { mutate, data, loading };
}

export function useUpdateAnnotation(annotationId: number, taskId: number, projectId: number) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<unknown>(null);

  async function mutate(annotation: Omit<Annotation, 'completed_by'>) {
    setLoading(true);
    await fetch(`./api/annotations/${annotationId}?taskID=${taskId}&project=${projectId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...annotation,
        "project": projectId
      }),
    })
      .then((res) => res.json())
      .catch((error) => {
        console.error('Error patching task annotation:', error);
      })
      .then((responseData) => {
        setData(responseData);
      });

    setLoading(false);
  }

  return { mutate, data, loading };
}