import type { LayoutOutletContext } from "@/pages/layout";
import { useSubmitAnnotation } from "@/stores/annotation";
import { useSaveAnnotationDraft, type Draft } from "@/stores/draft";
import { useProjectDetail } from "@/stores/project";
import { useFetchTaskDetail } from "@/stores/task-detail";
import { getInstancesValues, renderHtxString } from "@labelify/tags";
import { ActionIcon, Button, Flex, Modal, Stack } from "@mantine/core";
import { IconArrowBackUp, IconArrowForwardUp } from '@tabler/icons-react';
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

export default function TaskPage() {
  const navigate = useNavigate();
  const { projectId, taskId } = useParams<{ projectId?: string, taskId?: string }>();
  const outletContext = useOutletContext<LayoutOutletContext>();

  const { data: project } = useProjectDetail(parseInt(projectId || "0"), { disable: !projectId });

  const [drafts, setDrafts] = useState<Draft[]>();
  const [selectedDraftIdx, setSelectedDraftIdx] = useState<number | null>(null);
  const { loading: fetchTaskLoading, data: taskDetail, refetch: fetchTask } = useFetchTaskDetail(parseInt(taskId || "0"), parseInt(projectId || "0"), { disable: !taskId || !projectId });
  const annotation  = taskDetail?.annotations.find(a => a?.completed_by?.id == outletContext?.currentUser?.id) || [];

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

  const renderLoading = () => {
    if (fetchTaskLoading) return <>Loading task...</>;
    if (saveDraftLoading) return <>Saving draft...</>;
    if (submitAnnotationLoading) return <>Submitting annotation...</>;
    return null;
  }

  return (
    <Modal
      size='xl'
      opened={true}
      onClose={() => navigate(`/projects/${projectId}/data`)}
      title={taskDetail?.data?.tiktok_url}
      centered
    >
      <Stack>
        {renderHtxString(project?.label_config || '', taskDetail?.data || {}, (draft?.result || []).reduce((obj, i) => ({ ...obj, [i?.from_name]: { formattedValue: { ...i, id: i?.from_name } } }), {}))}
        <Flex justify="space-between" align="center">
          <div>{renderLoading()}</div>
          <Flex gap="sm" align="center">
            <ActionIcon variant="filled" aria-label="Settings"
              disabled={selectedDraftIdx === null || selectedDraftIdx <= 0}
              onClick={() => {
                if (selectedDraftIdx !== null && selectedDraftIdx > 0) {
                  setSelectedDraftIdx(selectedDraftIdx - 1);
                }
              }}
            >
              <IconArrowBackUp style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon><ActionIcon variant="filled" aria-label="Settings"
              disabled={selectedDraftIdx === null || drafts === undefined || selectedDraftIdx >= drafts.length - 1}
              onClick={() => {
                if (selectedDraftIdx !== null && drafts && selectedDraftIdx < drafts.length - 1) {
                  setSelectedDraftIdx(selectedDraftIdx + 1);
                }
              }}
            >
              <IconArrowForwardUp style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>
            <Button variant="filled" disabled={fetchTaskLoading || saveDraftLoading || submitAnnotationLoading || !!annotation} onClick={() => {
              saveTaskDraft(getInstancesValues());
            }}>Save Draft</Button>
            <Button variant="filled" disabled={fetchTaskLoading || saveDraftLoading || submitAnnotationLoading || !!annotation} onClick={async () => {
              if (draft) {
                await submitAnnotation(draft);
                await fetchTask();
              }
            }}>Submit</Button>
          </Flex>
        </Flex>
      </Stack>
    </Modal>
  );
}