import { atom, useAtom } from "jotai";
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

export type ProjectDetailType = {
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

interface HiddenColumns {
  explore: string[];
  labeling: string[];
}

interface Filters {
  conjunction: "and" | "or";
  items: unknown[];
}

interface ViewConfig {
  title: string;
  type: "list" | string;
  target: string;
  hiddenColumns: HiddenColumns;
  columnsWidth: Record<string, number>;
  columnsDisplayType: Record<string, string>;
  gridWidth: number;
  gridFitImagesToWidth: boolean;
  semantic_search: string[];
  filters: Filters;
  ordering: string[];
}

interface DataManagerViewType {
  id: number;
  order: number;
  user: number | null;
  project: number;
  data: ViewConfig;
}

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
  data: {
    video_description: string;
    voice_to_text: string | null;
    username: string;
    id: number;
    tiktok_url: string;
    tiktok_embed_url: string;
  };
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
}

type TaskType = {
  total: number;
  total_annotations: number;
  total_predictions: number;
  tasks: Task[];
}


const project = atom<{
  count: number | null;
  next: string | null;
  previous: string | null;
  results: ProjectType[];
}>({ count: null, next: null, previous: null, results: [] });

const dataManagerViewAtom = atom<DataManagerViewType[]>([]);

const tasksAtom = atom<TaskType>({ total: 0, total_annotations: 0, total_predictions: 0, tasks: [] });

const projectDetailAtom = atom<ProjectDetailType>();

export function fetchProjects() {
  return fetch('/api/projects?page=1&page_size=30&include=id%2Ctitle%2Ccreated_by%2Ccreated_at%2Ccolor%2Cis_published%2Cassignment_settings')
    .then((res) => res.json())
    .catch((error) => {
      console.error('Error fetching projects:', error);
    });
}

export function useFetchProjects() {
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useAtom(project);

  useEffect(() => {
    fetchProjects().then(setProjectData).finally(() => setLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { loading, data: projectData }
}

export function useFetchDataManagerView(projectId: number) {
  const [loading, setLoading] = useState(true);
  const [dataManagerView, setDataManagerView] = useAtom(dataManagerViewAtom);

  function fetchDataManagerView() {
    return fetch(`/api/dm/views?project=${projectId}`)
      .then((res) => res.json())
      .catch((error) => {
        console.error('Error fetching data manager view:', error);
      });
  }

  useEffect(() => {
    fetchDataManagerView().then(setDataManagerView).finally(() => setLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { loading, data: dataManagerView }
}

export function useProjectDetail(projectId: number) {
  const [loading, setLoading] = useState(true);
  const [projectDetail, setProjectDetail] = useAtom(projectDetailAtom);

  function fetchProjectDetail() {
    return fetch(`/api/projects/${projectId}`)
      .then((res) => res.json())
      .catch((error) => {
        console.error('Error fetching project detail', error);
      });
  }

  useEffect(() => {
    fetchProjectDetail().then(setProjectDetail).finally(() => setLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { loading, data: projectDetail }
}

export function useFetchTasks(page: number = 1, pageSize: number = 30, projectId: number, viewId: number) {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useAtom(tasksAtom);

  function fetchTasks() {
    return fetch(`/api/tasks?page=${page}&page_size=${pageSize}&view=${viewId}&project=${projectId}`)
      .then((res) => res.json())
      .catch((error) => {
        console.error('Error fetching tasks:', error);
      });
  }

  useEffect(() => {
    fetchTasks().then(setTasks).finally(() => setLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { loading, data: tasks }
}
