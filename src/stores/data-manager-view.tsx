import { useState, useEffect } from "react";

export interface HiddenColumns {
  explore: string[];
  labeling: string[];
}

export interface Filters {
  conjunction: "and" | "or";
  items: unknown[];
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

export function useFetchDataManagerView(projectId: number) {
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
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return { loading, data, refetch }
}