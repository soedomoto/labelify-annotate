import { useFetchVersion, type Version } from "@/stores/sysinfo";
import { useFetchCurrentUser, type CurrentUser } from "@/stores/whoami";
import { Outlet } from "react-router-dom";

export interface LayoutOutletContext {
  version?: Version;
  currentUser?: CurrentUser;
}

export default function LayoutPage() {
  const { data: version } = useFetchVersion();
  const { data: currentUser } = useFetchCurrentUser();

  return (
    <Outlet context={{
      version,
      currentUser,
    }} />
  );
}