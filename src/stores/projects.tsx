import { useEffect, useState } from "react";

type ProjectType = {
  id: number;
  title: string;
  description: string;
  label_config: string;
  expert_instruction: string;
  show_instruction: boolean;
  show_skip_button: boolean;
  enable_empty_annotation: boolean;
  show_annotation_history: boolean;
  organization: number;
  color: string;
  maximum_annotations: number;
  is_published: boolean;
  model_version: string;
  is_draft: boolean;
  created_by: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    avatar: string | null;
  };
  created_at: string;
  min_annotations_to_start_training: number;
  start_training_on_annotation_update: boolean;
  show_collab_predictions: boolean;
  num_tasks_with_annotations: number;
  task_number: number;
  useful_annotation_number: number;
  ground_truth_number: number;
  skipped_annotations_number: number;
  total_annotations_number: number;
  total_predictions_number: number;
  sampling: string;
  show_ground_truth_first: boolean;
  show_overlap_first: boolean;
  overlap_cohort_percentage: number;
  task_data_login: string | null;
  task_data_password: string | null;
  control_weights: Record<string, {
    overall: number;
    type: string;
    labels: Record<string, number>;
  }>;
  parsed_label_config: Record<string, {
    type: string;
    to_name: string[];
    inputs: Array<{
      type: string;
      valueType: string | null;
      value: string;
    }>;
    labels: string[];
    labels_attrs: Record<string, { value: string }>;
  }>;
  evaluate_predictions_automatically: boolean;
  config_has_control_tags: boolean;
  skip_queue: string;
  reveal_preannotations_interactively: boolean;
  pinned_at: string | null;
  finished_task_number: number;
  queue_total: number;
  queue_done: number;
  config_suitable_for_bulk_annotation: boolean;
}

export interface ProjectsResponse {
  count: number | null;
  next: string | null;
  previous: string | null;
  results: ProjectType[];
}

export function useFetchProjects(page: number = 1, pageSize: number = 30) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ProjectsResponse>({ count: null, next: null, previous: null, results: [] });

  async function refetch() {
    setLoading(true);
    fetch(`./api/projects?page=${page}&page_size=${pageSize}&include=id%2Ctitle%2Ccreated_by%2Ccreated_at%2Ccolor%2Cis_published%2Cassignment_settings%2Cid%2Cdescription%2Cnum_tasks_with_annotations%2Ctask_number%2Cskipped_annotations_number%2Ctotal_annotations_number%2Ctotal_predictions_number%2Cground_truth_number%2Cfinished_task_number`)
      .then((res) => res.json())
      .catch((error) => {
        console.error('Error fetching projects:', error);
      })
      .then(setData);
    setLoading(false);
  }

  useEffect(() => {
    refetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  return { loading, data, refetch }
}





export function useUpdateTaskDraft(draftId: number, projectId: number) {
  const [loading, setLoading] = useState(true);

  async function mutate(values: Record<string, unknown>) {
    setLoading(true);
    await fetch(`./api/drafts/${draftId}?project=${projectId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "lead_time": 38.701,
        "result": Object.values(values),
        "draft_id": draftId,
        "parent_prediction": null,
        "parent_annotation": null,
        "started_at": new Date().toISOString(),
        "project": projectId,
      }),
    })
      .then((res) => res.json())
      .catch((error) => {
        console.error('Error patching task annotation:', error);
      });

    setLoading(false);
  }

  return { mutate, loading };
}

export function useSubmitTask(draftId: number, taskId: number, projectId: number) {
  const [loading, setLoading] = useState(true);

  async function mutate(values: Record<string, unknown>) {
    setLoading(true);
    await fetch(`./api/tasks/${taskId}/annotations?project=${projectId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "lead_time": 162.307,
        "result": Object.values(values),
        "draft_id": draftId,
        "parent_prediction": null,
        "parent_annotation": null,
        "started_at": new Date().toISOString(),
        "project": projectId,
      }),
    })
      .then((res) => res.json())
      .catch((error) => {
        console.error('Error saving task annotation:', error);
      });

    setLoading(false);
  }

  return { mutate, loading };
}

export function useUpdateTaskSubmission(submissionId: number, taskId: number, projectId: number) {
  const [loading, setLoading] = useState(true);

  async function mutate(values: Record<string, unknown>) {
    setLoading(true);
    await fetch(`./api/annotations/${submissionId}?taskID=${taskId}&project=${projectId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "lead_time": 200.381,
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
      });

    setLoading(false);
  }

  return { mutate, loading };
}
