import { useFetchTasks } from "@/stores/tasks";
import { Avatar, Text, Tooltip } from "@mantine/core";
import dayjs from "dayjs";
import omit from 'lodash/omit';
import { DataTable, useDataTableColumns, type DataTableColumn } from "mantine-datatable";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useOutletContext, useParams } from "react-router-dom";
import type { ProjectDetailContext } from "..";

export interface ProjectDataContext extends ProjectDetailContext {
  refetchTasks: (page: number) => Promise<void>;
}

export default function DataPage() {
  const navigate = useNavigate();
  const { projectId, page: taskPage, taskId } = useParams<{ projectId?: string, page?: string, taskId?: string }>();
  const context = useOutletContext<ProjectDetailContext>();
  const { view, columns: _columns, users, mainHeight } = context || {};

  let columns = _columns || [];
  const idColumns = columns?.filter(c => c.id == 'id');
  const dataColumnsId = columns?.find(c => c.id == 'data')?.children || [];
  const dataColumns = columns?.filter(c => dataColumnsId.includes(c.id));
  const restColumns = columns?.filter(c => c.id != 'id')
    ?.filter(c => c.id != 'data')
    ?.filter(c => !dataColumnsId.includes(c.id));
  columns = [...idColumns, ...restColumns, ...dataColumns];

  const [page, setPage] = useState(1);
  const [pageSize] = useState(30);
  const { data: tasksInfo, refetch } = useFetchTasks(page, pageSize, parseInt(projectId || "0"), view?.id || 0);
  const records = (tasksInfo?.tasks || []).map(({ data, ...task }) => ({ ...task, ...omit(data, 'id') }));

  useEffect(() => {
    if (page < parseInt(taskPage || "1")) setPage(page => page + 1);
  }, [page, taskPage]);

  useEffect(() => {
    if (taskId) document.querySelector(`[data-row-id="${taskId}"]`)
      ?.scrollIntoView({ block: 'end', behavior: 'smooth' });
  }, [taskId, records]);

  const key = 'task-columns';
  type Record = typeof records[0];
  const { effectiveColumns } = useDataTableColumns({
    key,
    columns: columns
      .filter((col) => !!col?.visibility_defaults?.explore)
      .map((col) => {
        return {
          accessor: col.id,
          title: col.title,
          render: (record: Record) => {
            const value = record[col.id as keyof typeof record];
            let strValue = '';

            if (!value) strValue = '';
            else if (col.type == 'String' || col.type == 'Number') strValue = String(value);
            else if (col.type == 'Datetime') strValue = dayjs(value as string).format('DD MMM YYYY HH:mm');
            else if (col.id == 'annotators') return record?.annotators?.map(a => {
              const initials = (users?.find(u => u?.id == a)?.initials || '').toUpperCase();
              return <Avatar size="sm" color="initials" key={initials} name={initials} radius="xl">{initials}</Avatar>;
            });
            else if (col.id.endsWith('_at')) strValue = dayjs(value as string).format('DD MMM YYYY HH:mm');
            else strValue = String(value);

            return (
              <Tooltip label={strValue}>
                <Text size="sm" maw={200} truncate="end">{strValue}</Text>
              </Tooltip>
            )
          },
          resizable: true,
        } as DataTableColumn<Record>;
      }),
  });

  return (
    <>
      <DataTable
        striped
        highlightOnHover
        height={mainHeight || 100}
        storeColumnsKey={key}
        onScrollToBottom={() => {
          if (tasksInfo?.tasks?.length < tasksInfo?.total) setPage((p) => p + 1);
        }}
        pinFirstColumn
        columns={effectiveColumns}
        records={records}
        customRowAttributes={({ id }, idx) => ({
          'data-row-id': id,
          'data-row-index': idx,
        })}
        rowColor={({ id }) => {
          if (id == parseInt(taskId || '-1')) return 'violet';
        }}
        rowBackgroundColor={({ id }) => {
          if (id == parseInt(taskId || '-1')) return { dark: '#232b25', light: '#f0f7f1' };
        }}
        onRowClick={({ record: { page, id } }) => {
          navigate(`/projects/${projectId}/data/${page}/${id}`);
          // showNotification({
          //   title: `Clicked on ${tiktok_url}`,
          //   message: video_description,
          //   withBorder: true,
          // });
        }
        }
      />
      <Outlet context={{
        ...context,
        refetchTasks(page) {
          return refetch({ page });
        },
      } as ProjectDataContext} />
    </>
  );
}