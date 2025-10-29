import { useState } from "react";

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

export type DraftResult = (DraftChoicesResult | DraftTextAreaResult) & {
  id: string;
  from_name: string;
  to_name: string;
  origin: string;
}

export interface DraftChoicesResult {
  type: "choices";
  choices: string[];
}

export interface DraftTextAreaResult {
  type: "textarea";
  text: string[];
}

export function useSaveAnnotationDraft(taskId: number, projectId: number) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Draft | null>(null);

  async function mutate(values: Record<string, unknown>) {
    setLoading(true);
    await fetch(`./api/tasks/${taskId}/drafts?project=${projectId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "lead_time": 23.797,
        "result": Object.values(values),
        "draft_id": 0,
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