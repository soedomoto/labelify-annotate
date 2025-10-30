import { useState, useEffect } from "react";

export interface OrganizationMeta {
  title: string;
  email: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  last_activity: string; // ISO 8601 timestamp
  avatar: string | null;
  initials: string;
  phone: string;
  active_organization: number;
  active_organization_meta: OrganizationMeta;
  allow_newsletters: boolean;
  date_joined: string; // ISO 8601 timestamp
}

export function useFetchUsers(projectId: number) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<User[]>([]);

  async function refetch() {
    setLoading(true);
    await fetch(`./api/users?project=${projectId}`)
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
