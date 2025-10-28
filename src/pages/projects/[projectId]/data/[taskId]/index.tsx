import { renderHtxString, getInstancesValues } from "@labelify/tags";
import { Button, Flex, Modal, Stack } from "@mantine/core";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { ProjectDetailType, Task } from "../../../../../stores/project";

export default function TaskPage() {
  const navigate = useNavigate();
  const { project, task } = useOutletContext<{ project?: ProjectDetailType, task?: Task }>();

  return (
    <Modal
      size='xl'
      opened={true}
      onClose={() => navigate(`/projects/${project?.id}/data`)}
      title={task?.data?.tiktok_url}
      centered
    >
      <Stack>
        {renderHtxString(project?.label_config || '', task?.data || {})}
        <Flex justify="space-between" align="center">
          <div></div>
          <Button variant="filled" onClick={() => {
            console.log('Submit clicked', getInstancesValues());
          }}>Submit</Button>
        </Flex>
      </Stack>
    </Modal>
  );
}