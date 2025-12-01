import { useSubmitAnnotation } from "@/stores/annotation";
import { useSaveAnnotationDraft, type Draft } from "@/stores/draft";
import { useFetchTaskDetail } from "@/stores/task-detail";
import { getInstancesValues, renderHtxString } from "@labelify/tags";
import { ActionIcon, Button, Flex, Modal, Stack, Tooltip } from "@mantine/core";
import { IconArrowBackUp, IconArrowForwardUp } from '@tabler/icons-react';
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import type { ProjectDataContext } from "../..";

export default function TaskPage() {
  const navigate = useNavigate();
  const { projectId, page, taskId } = useParams<{ projectId?: string, page?: string, taskId?: string }>();
  const outletContext = useOutletContext<ProjectDataContext>();

  const [drafts, setDrafts] = useState<Draft[]>();
  const [selectedDraftIdx, setSelectedDraftIdx] = useState<number | null>(null);
  const { loading: fetchTaskLoading, data: taskDetail, refetch: fetchTask } = useFetchTaskDetail(parseInt(taskId || "0"), parseInt(projectId || "0"), { disable: !taskId || !projectId });
  const annotationByMe = (taskDetail?.annotations || []).find(a => a?.completed_by?.id == outletContext?.currentUser?.id);

  const { loading: saveDraftLoading, mutate: saveTaskDraft, data: savedDraft } = useSaveAnnotationDraft(parseInt(taskId || "0"), parseInt(projectId || "0"));
  const { loading: submitAnnotationLoading, mutate: submitAnnotation } = useSubmitAnnotation(parseInt(taskId || "0"), parseInt(projectId || "0"));

  useEffect(() => {
    if (taskDetail) {
      setDrafts((taskDetail?.drafts || [])?.filter(d => d?.user == outletContext?.currentUser?.email));
    }
  }, [taskDetail, outletContext?.currentUser?.email]);

  useEffect(() => {
    if (savedDraft) {
      setDrafts(_drafts => ([..._drafts || [], savedDraft]));
    }
  }, [savedDraft]);

  useEffect(() => {
    if (drafts && drafts.length > 0) {
      setSelectedDraftIdx(drafts.length - 1);
    }
  }, [drafts]);

  const draft = (drafts && selectedDraftIdx !== null) ? drafts[selectedDraftIdx] : null;
  let htxValues = draft?.result || [];
  if (annotationByMe) htxValues = annotationByMe?.result || [];

  const renderLoading = () => {
    if (fetchTaskLoading) return <>Loading task...</>;
    if (saveDraftLoading) return <>Saving draft...</>;
    if (submitAnnotationLoading) return <>Submitting annotation...</>;
    return null;
  }

  const submitTooltipLabel = () => {
    if (fetchTaskLoading) return <>Loading task...</>;
    if (saveDraftLoading) return <>Saving draft...</>;
    if (submitAnnotationLoading) return <>Submitting annotation...</>;
    if (!draft) return <>No draft to submit</>;
    if (annotationByMe) return <>You have already submitted an annotation for this task</>;
    return <>Submit annotation</>;
  }

  const saveDraftTooltipLabel = () => {
    if (fetchTaskLoading) return <>Loading task...</>;
    if (saveDraftLoading) return <>Saving draft...</>;
    if (submitAnnotationLoading) return <>Submitting annotation...</>;
    if (annotationByMe) return <>You have already submitted an annotation for this task</>;
    return <>Submit draft</>;
  }

  return (
    <Modal
      size='xl'
      opened={true}
      onClose={() => navigate(`/projects/${projectId}/data`)}
      title={`Task #${taskDetail?.id}`}
      centered
    >
      <Stack>
        {renderHtxString(outletContext?.project?.label_config || '', taskDetail?.data || {}, htxValues.reduce((obj, i) => ({ ...obj, [i?.from_name]: { formattedValue: { ...i, id: i?.from_name } } }), {}))}
        <Flex justify="space-between" align="center">
          <div>{renderLoading()}</div>
          <Flex gap="sm" align="center">
            <Tooltip label="Go to Previous Draft">
              <ActionIcon variant="filled" aria-label="Settings"
                disabled={selectedDraftIdx === null || selectedDraftIdx <= 0}
                onClick={() => {
                  if (selectedDraftIdx !== null && selectedDraftIdx > 0) {
                    setSelectedDraftIdx(selectedDraftIdx - 1);
                  }
                }}
              >
                <IconArrowBackUp style={{ width: '70%', height: '70%' }} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Go to Next Draft">
              <ActionIcon variant="filled" aria-label="Settings"
                disabled={selectedDraftIdx === null || drafts === undefined || selectedDraftIdx >= drafts.length - 1}
                onClick={() => {
                  if (selectedDraftIdx !== null && drafts && selectedDraftIdx < drafts.length - 1) {
                    setSelectedDraftIdx(selectedDraftIdx + 1);
                  }
                }}
              >
                <IconArrowForwardUp style={{ width: '70%', height: '70%' }} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={saveDraftTooltipLabel()}>
              <Button variant="filled" disabled={fetchTaskLoading || saveDraftLoading || submitAnnotationLoading || !!annotationByMe} onClick={async () => {
                await saveTaskDraft(getInstancesValues());
                await outletContext?.refetchTasks?.(parseInt(page || "1"));
              }}>Save Draft</Button>
            </Tooltip>
            <Tooltip label={submitTooltipLabel()}>
              <Button variant="filled" disabled={fetchTaskLoading || saveDraftLoading || submitAnnotationLoading || !draft || !!annotationByMe} onClick={async () => {
                if (draft) {
                  await submitAnnotation(draft);
                  await fetchTask();
                  await outletContext?.refetchTasks?.(parseInt(page || "1"));
                }
              }}>Submit</Button>
            </Tooltip>
          </Flex>
        </Flex>
      </Stack>
    </Modal>
  );
}