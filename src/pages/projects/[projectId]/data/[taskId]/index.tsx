import { renderHtxString } from "@labelify/tags";
import { Modal } from "@mantine/core";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { ProjectDetailType, Task } from "../../../../../stores/project";

export default function TaskPage() {
  const navigate = useNavigate();
  const { project, task } = useOutletContext<{ project?: ProjectDetailType, task?: Task }>();

  return (
    <Modal size='xl' opened={true} onClose={() => navigate(`/projects/${project?.id}/data`)} title={task?.data?.tiktok_url} centered>
      {renderHtxString(project?.label_config || '', task?.data || {})}
    </Modal>
  );
}