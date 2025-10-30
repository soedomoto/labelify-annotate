import { useFetchTasks } from "@/stores/tasks";
import { DataTable, useDataTableColumns } from "mantine-datatable";
import { useState } from "react";
import { Outlet, useNavigate, useOutletContext, useParams } from "react-router-dom";
import type { ProjectDetailContext } from "..";
import dayjs from "dayjs";
import { Avatar } from "@mantine/core";
import omit from 'lodash/omit';

export default function DataPage() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId?: string, taskId?: string }>();
  const context = useOutletContext<ProjectDetailContext>();
  const { view, columns: _columns, users, mainHeight } = context || {};

  let columns = _columns || [];
  const dataColumnsId = columns?.find(c => c.id == 'data')?.children || [];
  const dataColumns = columns?.filter(c => dataColumnsId.includes(c.id));
  columns = [...columns.filter(c => !dataColumnsId.includes(c.id)), ...dataColumns];

  const [page, setPage] = useState(1);
  const [pageSize] = useState(30);
  const { data: tasksInfo } = useFetchTasks(page, pageSize, parseInt(projectId || "0"), view?.id || 0);
  const records = (tasksInfo?.tasks || []).map(({ data, ...task }) => ({ ...task, ...omit(data, 'id') }));

  const key = 'task-columns';
  type Record = typeof records[0];
  const { effectiveColumns } = useDataTableColumns({
    key,
    columns: columns
      .filter((col) => !!col?.visibility_defaults?.explore)
      .map((col) => ({
        accessor: col.id,
        title: col.title,
        render: (record: Record) => {
          const value = record[col.id as keyof typeof record];
          if (!value) return '';
          if (col.type == 'String' || col.type == 'Number') return String(value);
          if (col.type == 'Datetime') return dayjs(String(value)).format('DD MMM YYYY');
          if (col.id == 'annotators') return record?.annotators?.map(a => {
            const initials = (users?.find(u => u?.id == a)?.initials || '').toUpperCase();
            return <Avatar color="initials" key={initials} name={initials} radius="xl">{initials}</Avatar>;
          });

          return String(value);
        },
        resizable: true,
      })),
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
        records={records}
        columns={effectiveColumns}
        onRowClick={({ record: { id } }) => {
          navigate(`/projects/${projectId}/data/${id}`);
          // showNotification({
          //   title: `Clicked on ${tiktok_url}`,
          //   message: video_description,
          //   withBorder: true,
          // });
        }
        }
      />
      <Outlet context={context} />
    </>
  );
}