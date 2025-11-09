import { useState, useEffect } from "react";
import merge from "lodash/merge";

export interface HiddenColumns {
  explore: string[];
  labeling: string[];
}

export type FilterItemIn = {
  filter: string;
  operator: 'in' | 'not_in';
  value: { min: number; max: number };
  type: "String" | "Number" | "Boolean" | "Date";
}

export type FilterItemString = {
  filter: string;
  operator: 'equal' | 'not_equal' | 'contains' | 'not_contains' | 'regex' | 'empty';
  value: string | null;
  type: "String" | "Number" | "Boolean" | "Date";
}

export type FilterItem = FilterItemString | FilterItemIn | {
  filter: string;
  operator: 'equal' | 'not_equal' | 'less' | 'greater' | 'less_or_equal' | 'greater_or_equal' | 'empty';
  value: string | number | boolean | null;
  type: "String" | "Number" | "Boolean" | "Date";
}

export interface Filters {
  conjunction: "and" | "or";
  items: FilterItem[];
}

export interface ViewConfig {
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

export interface DataManagerViewType {
  id: number;
  order: number;
  user: number | null;
  project: number;
  data: ViewConfig;
}

export function useFetchDataManagerView(projectId: number, options?: { disable?: boolean }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DataManagerViewType[]>([]);

  async function refetch() {
    setLoading(true);
    await fetch(`./api/dm/views?project=${projectId}`)
      .then((res) => res.json())
      .catch((error) => {
        console.error('Error fetching data manager view:', error);
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

const createDataManagerDefaultValues: Partial<ViewConfig> = {
  "title": "New Tab 3",
  "ordering": [],
  "type": "list",
  "target": "tasks",
  "filters": { "conjunction": "and", "items": [] },
  "hiddenColumns": {
    "explore": ["tasks:inner_id", "tasks:annotations_results", "tasks:annotations_ids", "tasks:predictions_score", "tasks:predictions_model_versions", "tasks:predictions_results", "tasks:file_upload", "tasks:storage_filename", "tasks:created_at", "tasks:updated_at", "tasks:updated_by", "tasks:avg_lead_time", "tasks:draft_exists"],
    "labeling": ["tasks:data.username", "tasks:data.id", "tasks:data.tiktok_url", "tasks:id", "tasks:inner_id", "tasks:completed_at", "tasks:cancelled_annotations", "tasks:total_predictions", "tasks:annotators", "tasks:annotations_results", "tasks:annotations_ids", "tasks:predictions_score", "tasks:predictions_model_versions", "tasks:predictions_results", "tasks:file_upload", "tasks:storage_filename", "tasks:created_at", "tasks:updated_at", "tasks:updated_by", "tasks:avg_lead_time", "tasks:draft_exists"]
  },
  "columnsWidth": {},
  "columnsDisplayType": {},
  "gridWidth": 4,
  "gridFitImagesToWidth": false,
  "semantic_search": []
}

export function useCreateDataManagerView(projectId: number) {
  const [loading, setLoading] = useState(false);

  async function mutate(data: Partial<ViewConfig>) {
    setLoading(true);
    await fetch(`./api/dm/views?project=${projectId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "data": merge(createDataManagerDefaultValues, data),
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

export function useUpdateDataManagerView(viewId: number, projectId: number) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataManagerViewType>();

  async function mutate(data: Partial<ViewConfig>) {
    setLoading(true);
    const result = await fetch(`./api/dm/views/${viewId}?interaction=ordering&project=${projectId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "id": viewId,
        "data": data,
        "project": projectId
      }),
    })
      .then((res) => res.json())
      .catch((error) => {
        console.error('Error patching task annotation:', error);
      });

    setLoading(false);
    setData(result);
  }

  return { mutate, loading, data };
}

export function useDeleteDataManagerView(viewId: number, projectId: number) {
  const [loading, setLoading] = useState(false);

  async function mutate() {
    setLoading(true);
    await fetch(`./api/dm/views/${viewId}?project=${projectId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "project": projectId }),
    })
      .then((res) => res.json())
      .catch((error) => {
        console.error('Error patching task annotation:', error);
      });

    setLoading(false);
  }

  return { mutate, loading };
}