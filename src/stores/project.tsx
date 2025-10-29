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
  return fetch('./api/projects?page=1&page_size=30&include=id%2Ctitle%2Ccreated_by%2Ccreated_at%2Ccolor%2Cis_published%2Cassignment_settings')
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
    setLoading(true);
    return fetch(`./api/dm/views?project=${projectId}`)
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

export function useProjectDetail(projectId: number, options?: { disable?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [projectDetail, setProjectDetail] = useAtom(projectDetailAtom);

  async function fetchProjectDetail() {
    setLoading(true);
    await fetch(`./api/projects/${projectId}`)
      .then((res) => res.json())
      .catch((error) => {
        console.error('Error fetching project detail', error);
      })
      .then(setProjectDetail);
    setLoading(false);
  }

  useEffect(() => {
    if (!options?.disable) fetchProjectDetail();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, options?.disable]);

  return { loading, data: projectDetail }
}

export function useFetchTasks(page: number = 1, pageSize: number = 30, projectId: number, viewId: number) {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useAtom(tasksAtom);

  function fetchTasks() {
    setLoading(true);
    return fetch(`./api/tasks?page=${page}&page_size=${pageSize}&view=${viewId}&project=${projectId}`)
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


// // Example POST request for save draft
// fetch("http://bd-anno.shef.ac.uk/labelstudio/api/tasks/4564/drafts?project=11", {
//   "headers": {
//     "baggage": "sentry-environment=opensource,sentry-release=1.20.0,sentry-public_key=5f51920ff82a4675a495870244869c6b,sentry-trace_id=d3adf63d7410415aa345a3fad7877879,sentry-sample_rate=0.01,sentry-transaction=%2Fprojects%2F%3Aid(%5Cd%2B)%2Fdata,sentry-sampled=false",
//     "content-type": "application/json",
//     "sentry-trace": "d3adf63d7410415aa345a3fad7877879-8ba645f34cad1341-0"
//   },
//   "referrer": "http://bd-anno.shef.ac.uk/labelstudio/projects/11/data?tab=13&task=4564",
//   "body": "{\"lead_time\":23.797,\"result\":[{\"value\":{\"choices\":[\"Not Sure\"]},\"id\":\"9m5j0VqiQB\",\"from_name\":\"sentiment\",\"to_name\":\"video_description\",\"type\":\"choices\",\"origin\":\"manual\"},{\"value\":{\"text\":[\"Not sure\"]},\"id\":\"O6ho-q9Ip7\",\"from_name\":\"justification\",\"to_name\":\"video_description\",\"type\":\"textarea\",\"origin\":\"manual\"}],\"draft_id\":0,\"parent_prediction\":null,\"parent_annotation\":null,\"started_at\":\"2025-10-28T09:44:02.300Z\",\"project\":\"11\"}",
//   "method": "POST",
//   "mode": "cors",
//   "credentials": "omit"
// });

// {
//     "id": 824,
//     "user": "prawisudatama@gmail.com",
//     "created_username": "prawisudatama@gmail.com, 2",
//     "created_ago": "0 minutes",
//     "result": [
//         {
//             "value": {
//                 "choices": [
//                     "Not Sure"
//                 ]
//             },
//             "id": "fXZZVTtdVJ",
//             "from_name": "sentiment",
//             "to_name": "video_description",
//             "type": "choices",
//             "origin": "manual"
//         },
//         {
//             "value": {
//                 "text": [
//                     "asdfdf"
//                 ]
//             },
//             "id": "PA1LZwGoLH",
//             "from_name": "justification",
//             "to_name": "video_description",
//             "type": "textarea",
//             "origin": "manual"
//         }
//     ],
//     "lead_time": 9.472,
//     "was_postponed": false,
//     "import_id": null,
//     "created_at": "2025-10-28T21:10:25.725729Z",
//     "updated_at": "2025-10-28T21:10:25.725757Z",
//     "task": 4565,
//     "annotation": null
// }

// // Example PATCH request for update draft
// fetch("http://bd-anno.shef.ac.uk/labelstudio/api/drafts/824?project=11", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "en-US,en;q=0.9,id;q=0.8",
//     "baggage": "sentry-environment=opensource,sentry-release=1.20.0,sentry-public_key=5f51920ff82a4675a495870244869c6b,sentry-trace_id=bdcd9402b943498481389291733a5fe2,sentry-sample_rate=0.01,sentry-transaction=%2Fprojects%2F%3Aid(%5Cd%2B)%2Fdata,sentry-sampled=false",
//     "content-type": "application/json",
//     "sentry-trace": "bdcd9402b943498481389291733a5fe2-8718a502f8f2eeab-0"
//   },
//   "referrer": "http://bd-anno.shef.ac.uk/labelstudio/projects/11/data?tab=13&task=4565",
//   "body": "{\"lead_time\":38.701,\"result\":[{\"value\":{\"choices\":[\"No\"]},\"id\":\"fXZZVTtdVJ\",\"from_name\":\"sentiment\",\"to_name\":\"video_description\",\"type\":\"choices\",\"origin\":\"manual\"},{\"value\":{\"text\":[\"asdfdf\"]},\"id\":\"PA1LZwGoLH\",\"from_name\":\"justification\",\"to_name\":\"video_description\",\"type\":\"textarea\",\"origin\":\"manual\"}],\"draft_id\":824,\"parent_prediction\":null,\"parent_annotation\":null,\"started_at\":\"2025-10-28T21:10:16.210Z\",\"project\":\"11\"}",
//   "method": "PATCH",
//   "mode": "cors",
//   "credentials": "include"
// });

// {
//     "id": 824,
//     "user": "prawisudatama@gmail.com",
//     "created_username": "prawisudatama@gmail.com, 2",
//     "created_ago": "0 minutes",
//     "result": [
//         {
//             "value": {
//                 "choices": [
//                     "No"
//                 ]
//             },
//             "id": "fXZZVTtdVJ",
//             "from_name": "sentiment",
//             "to_name": "video_description",
//             "type": "choices",
//             "origin": "manual"
//         },
//         {
//             "value": {
//                 "text": [
//                     "asdfdf"
//                 ]
//             },
//             "id": "PA1LZwGoLH",
//             "from_name": "justification",
//             "to_name": "video_description",
//             "type": "textarea",
//             "origin": "manual"
//         }
//     ],
//     "lead_time": 38.701,
//     "was_postponed": false,
//     "import_id": null,
//     "created_at": "2025-10-28T21:10:25.725729Z",
//     "updated_at": "2025-10-28T21:10:54.970088Z",
//     "task": 4565,
//     "annotation": null
// }

// // Example POST request for submit annotations
// fetch("http://bd-anno.shef.ac.uk/labelstudio/api/tasks/4565/annotations?project=11", {
//   "headers": {
//     "baggage": "sentry-environment=opensource,sentry-release=1.20.0,sentry-public_key=5f51920ff82a4675a495870244869c6b,sentry-trace_id=d3adf63d7410415aa345a3fad7877879,sentry-sample_rate=0.01,sentry-transaction=%2Fprojects%2F%3Aid(%5Cd%2B)%2Fdata,sentry-sampled=false",
//     "content-type": "application/json",
//     "sentry-trace": "d3adf63d7410415aa345a3fad7877879-8ba645f34cad1341-0"
//   },
//   "referrer": "http://bd-anno.shef.ac.uk/labelstudio/projects/11/data?tab=13&task=4565",
//   "body": "{\"lead_time\":162.307,\"result\":[{\"value\":{\"choices\":[\"Not Sure\"]},\"id\":\"qOU-bqpdFb\",\"from_name\":\"sentiment\",\"to_name\":\"video_description\",\"type\":\"choices\",\"origin\":\"manual\"},{\"value\":{\"text\":[\"Not clear description\"]},\"id\":\"9IiE17c6Co\",\"from_name\":\"justification\",\"to_name\":\"video_description\",\"type\":\"textarea\",\"origin\":\"manual\"}],\"draft_id\":817,\"parent_prediction\":null,\"parent_annotation\":null,\"started_at\":\"2025-10-28T09:39:26.293Z\",\"project\":\"11\"}",
//   "method": "POST",
//   "mode": "cors",
//   "credentials": "omit"
// });

// {
//     "id": 3059,
//     "result": [
//         {
//             "value": {
//                 "choices": [
//                     "Not Sure"
//                 ]
//             },
//             "id": "3e5FX7Qz11",
//             "from_name": "sentiment",
//             "to_name": "video_description",
//             "type": "choices",
//             "origin": "manual"
//         },
//         {
//             "value": {
//                 "text": [
//                     "aaaa"
//                 ]
//             },
//             "id": "S92wM-2KtL",
//             "from_name": "justification",
//             "to_name": "video_description",
//             "type": "textarea",
//             "origin": "manual"
//         }
//     ],
//     "created_username": " prawisudatama@gmail.com, 2",
//     "created_ago": "0 minutes",
//     "completed_by": 2,
//     "was_cancelled": false,
//     "ground_truth": false,
//     "created_at": "2025-10-28T21:08:18.285613Z",
//     "updated_at": "2025-10-28T21:08:18.285641Z",
//     "draft_created_at": "2025-10-28T21:06:29.323346Z",
//     "lead_time": 50.815,
//     "import_id": null,
//     "last_action": null,
//     "bulk_created": false,
//     "task": 4565,
//     "project": 11,
//     "updated_by": 2,
//     "parent_prediction": null,
//     "parent_annotation": null,
//     "last_created_by": null
// }

// // Example PATCH request for update annotation
// fetch("http://bd-anno.shef.ac.uk/labelstudio/api/annotations/3042?taskID=4564&project=11", {
//   "headers": {
//     "baggage": "sentry-environment=opensource,sentry-release=1.20.0,sentry-public_key=5f51920ff82a4675a495870244869c6b,sentry-trace_id=d3adf63d7410415aa345a3fad7877879,sentry-sample_rate=0.01,sentry-transaction=%2Fprojects%2F%3Aid(%5Cd%2B)%2Fdata,sentry-sampled=false",
//     "content-type": "application/json",
//     "sentry-trace": "d3adf63d7410415aa345a3fad7877879-8ba645f34cad1341-0"
//   },
//   "referrer": "http://bd-anno.shef.ac.uk/labelstudio/projects/11/data?tab=13&task=4564",
//   "body": "{\"lead_time\":200.381,\"result\":[{\"value\":{\"choices\":[\"Not Sure\"]},\"id\":\"9m5j0VqiQB\",\"from_name\":\"sentiment\",\"to_name\":\"video_description\",\"type\":\"choices\",\"origin\":\"manual\"},{\"value\":{\"text\":[\"Not sure aja\"]},\"id\":\"O6ho-q9Ip7\",\"from_name\":\"justification\",\"to_name\":\"video_description\",\"type\":\"textarea\",\"origin\":\"manual\"}],\"draft_id\":0,\"parent_prediction\":null,\"parent_annotation\":null,\"started_at\":\"2025-10-28T09:44:27.600Z\",\"project\":\"11\"}",
//   "method": "PATCH",
//   "mode": "cors",
//   "credentials": "omit"
// });

// // Example POST request for delete annotations
// fetch("http://bd-anno.shef.ac.uk/labelstudio/api/dm/actions?id=delete_tasks_annotations&tabID=13&project=11", {
//   "headers": {
//     "baggage": "sentry-environment=opensource,sentry-release=1.20.0,sentry-public_key=5f51920ff82a4675a495870244869c6b,sentry-trace_id=d3adf63d7410415aa345a3fad7877879,sentry-sample_rate=0.01,sentry-transaction=%2Fprojects%2F%3Aid(%5Cd%2B)%2Fdata,sentry-sampled=false",
//     "content-type": "application/json",
//     "sentry-trace": "d3adf63d7410415aa345a3fad7877879-8ba645f34cad1341-0"
//   },
//   "referrer": "http://bd-anno.shef.ac.uk/labelstudio/projects/11/data?tab=13",
//   "body": "{\"ordering\":[\"tasks:annotators\"],\"selectedItems\":{\"all\":false,\"included\":[4564]},\"filters\":{\"conjunction\":\"and\",\"items\":[]},\"annotator\":\"\",\"project\":\"11\"}",
//   "method": "POST",
//   "mode": "cors",
//   "credentials": "omit"
// });