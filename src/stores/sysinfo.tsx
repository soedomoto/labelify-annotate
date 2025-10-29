import { useState, useEffect } from "react";

export interface Version {
  release: string;
  "label-studio-os-package": {
    version: string;
    short_version: string;
    latest_version_from_pypi: string;
    latest_version_upload_time: string;
    current_version_is_outdated: boolean;
  };
  "label-studio-os-backend": {
    message: string;
    commit: string;
    date: string;
    branch: string;
    version: string;
  };
  "label-studio-frontend": {
    message: string;
    commit: string;
    date: string;
    branch: string;
  };
  dm2: {
    message: string;
    commit: string;
    date: string;
    branch: string;
  };
  "label-studio-converter": {
    version: string;
  };
  "label-studio-ml": {
    version: string;
  };
  edition: string;
  lsf: {
    message: string;
    commit: string;
    date: string;
    branch: string;
  };
  backend: {
    commit: string;
  };
}

export function useFetchVersion(options?: { disable?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [version, setVersion] = useState<Version>();

  async function fetchVersion() {
    setLoading(true);
    await fetch(`./api/version`)
      .then((res) => res.json())
      .catch((error) => {
        console.error('Error fetching version:', error);
      })
      .then(setVersion);

    setLoading(false);
  }

  useEffect(() => {
    if (!options?.disable) fetchVersion();
  }, [options?.disable]);

  return { loading, data: version , refetch: fetchVersion };
}