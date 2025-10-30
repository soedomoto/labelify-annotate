import { useState, useEffect } from "react";

export interface ColumnVisibilityDefaults {
  explore: boolean;
  labeling: boolean;
}

export interface ColumnSchema {
  items: unknown[];
}

export type ColumnType =
  | "String"
  | "Number"
  | "Datetime"
  | "Boolean"
  | "List"
  | "Unknown";

export interface ColumnDefinition {
  id: string;
  title: string;
  type: ColumnType;
  target: string;
  parent?: string;
  help?: string;
  schema?: ColumnSchema;
  visibility_defaults: ColumnVisibilityDefaults;
  project_defined: boolean;
  children?: string[];
}

export interface ColumnsData {
  columns: ColumnDefinition[];
}

export function useFetchDataManagerColumns(projectId: number) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ColumnsData>();

  async function refetch() {
    setLoading(true);
    await fetch(`./api/dm/columns?project=${projectId}`)
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