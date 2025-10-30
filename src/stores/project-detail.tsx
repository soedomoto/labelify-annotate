import { useEffect, useState } from "react";


export interface ProjectDetailType {
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
  created_at: string; // ISO 8601 timestamp
  min_annotations_to_start_training: number;
  start_training_on_annotation_update: boolean;
  show_collab_predictions: boolean;
  num_tasks_with_annotations: number | null;
  task_number: number | null;
  useful_annotation_number: number | null;
  ground_truth_number: number | null;
  skipped_annotations_number: number | null;
  total_annotations_number: number | null;
  total_predictions_number: number | null;
  sampling: string;
  show_ground_truth_first: boolean;
  show_overlap_first: boolean;
  overlap_cohort_percentage: number;
  task_data_login: string | null;
  task_data_password: string | null;
  control_weights: Record<
    string,
    {
      overall: number;
      type: string;
      labels: Record<string, number>;
    }
  >;
  parsed_label_config: Record<
    string,
    {
      type: string;
      to_name: string[];
      inputs: {
        type: string;
        valueType: string | null;
        value: string;
      }[];
      labels: string[];
      labels_attrs: Record<string, { value: string }>;
    }
  >;
  evaluate_predictions_automatically: boolean;
  config_has_control_tags: boolean;
  skip_queue: string;
  reveal_preannotations_interactively: boolean;
  pinned_at: string | null;
  finished_task_number: number | null;
  queue_total: number;
  queue_done: number;
  config_suitable_for_bulk_annotation: boolean;
  can_delete_tasks: boolean;
  can_manage_annotations: boolean;
  can_manage_tasks: boolean;
  source_syncing: boolean;
  target_syncing: boolean;
  task_count: number;
  annotation_count: number;
}

export function useFetchProjectDetail(projectId: number, options?: { disable?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ProjectDetailType>();

  async function refetch() {
    setLoading(true);
    await fetch(`./api/projects/${projectId}`)
      .then((res) => res.json())
      .catch((error) => {
        console.error('Error fetching project detail', error);
      })
      .then(setData);
    setLoading(false);
  }

  useEffect(() => {
    if (!options?.disable) refetch();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, options?.disable]);

  return { loading, data, refetch }
}