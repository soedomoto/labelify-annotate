import { renderHtxString, getInstancesValues, subscribeInstancesChanges } from "@labelify/tags";
import { Button, Flex, Modal, Stack } from "@mantine/core";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useSaveTaskDraft, type ProjectDetailType, type Task } from "../../../../../stores/project";
import { useFetchTaskDetail } from "../../../../../stores/task";
import { useEffect } from "react";

export default function TaskPage() {
  const navigate = useNavigate();
  const { project, task } = useOutletContext<{ project?: ProjectDetailType, task?: Task }>();
  const {loading: fetchTaskLoading, data: taskDetail} = useFetchTaskDetail(task?.id || 0, project?.id || 0, { disable: !!task || !!project });
  const { loading: saveDraftLoading, mutate } = useSaveTaskDraft(task?.id || 0, project?.id || 0);
  
  useEffect(() => {
    const unsubscribe = subscribeInstancesChanges((values) => {
      console.log('Values changed:', values);
    });
    return unsubscribe;
  }, [])

  const renderLoading = () => {
    if (fetchTaskLoading) return <>Loading task...</>;
    if (saveDraftLoading) return <>Saving draft...</>;
    return null;
  }

  return (
    <Modal
      size='xl'
      opened={true}
      onClose={() => navigate(`/projects/${project?.id}/data`)}
      title={taskDetail?.data?.tiktok_url}
      centered
    >
      <Stack>
        {renderHtxString(project?.label_config || '', taskDetail?.data || {})}
        <Flex justify="space-between" align="center">
          <div>{renderLoading()}</div>
          <Button variant="filled" onClick={() => {
            const values = getInstancesValues();
            mutate(values);
          }}>Submit</Button>
        </Flex>
      </Stack>
    </Modal>
  );
}