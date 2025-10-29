import { useState, useEffect } from "react";

export interface CurrentUser {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  last_activity: string;
  avatar: null | string;
  initials: string;
  phone: string;
  active_organization: number;
  active_organization_meta: {
    title: string;
    email: string;
  };
  allow_newsletters: boolean;
  date_joined: string;
}

export function useFetchCurrentUser(options?: { disable?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<CurrentUser>();

  async function fetchCurrentUser() {
    setLoading(true);
    await fetch(`./api/current-user/whoami`)
      .then((res) => res.json())
      .catch((error) => {
        console.error('Error fetching current user:', error);
      })
      .then(setUser);

    setLoading(false);
  }

  useEffect(() => {
    if (!options?.disable) fetchCurrentUser();
  }, [options?.disable]);

  return { loading, data: user , refetch: fetchCurrentUser };
}