import type { ColumnDefinition } from "@/stores/data-manager-columns";
import { useUpdateDataManagerView, type FilterItem, type ViewConfig } from "@/stores/data-manager-view";
import { useFetchTasks } from "@/stores/tasks";
import { Avatar, Button, Group, Input, NumberInput, Select, Stack, Text, Tooltip } from "@mantine/core";
import { DatePicker } from '@mantine/dates';
import { IconChevronUp, IconFilterFilled, IconFilterOff, IconSelector, IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import merge from "lodash/merge";
import omit from 'lodash/omit';
import { DataTable, useDataTableColumns, type DataTableColumn } from "mantine-datatable";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useOutletContext, useParams } from "react-router-dom";
import type { ProjectDetailContext } from "..";

export interface ProjectDataContext extends ProjectDetailContext {
  refetchTasks: (page: number) => Promise<void>;
}

const ColumnFilter = ({ col, item, applyFilter, clearFilter, clearAllFilters }: {
  col: ColumnDefinition,
  item?: FilterItem,
  applyFilter?: (filter: FilterItem['filter'], operator: FilterItem['operator'], value: FilterItem['value'], type: FilterItem['type']) => void,
  clearFilter?: (filter: FilterItem['filter']) => void,
  clearAllFilters?: () => void,
}) => {
  const [filter] = useState<FilterItem['filter'] | undefined>(`filter:tasks:${col?.parent ? `${col?.parent}.` : ''}${col.id}`);
  const [operator, setOperator] = useState<FilterItem['operator']>(item?.operator || 'equal');
  const [value, setValue] = useState<FilterItem['value'] | undefined>(item?.value);
  const [type] = useState<FilterItem['type'] | undefined>(col?.type as FilterItem['type']);

  const isChanged = item?.operator != operator || item?.value != value;

  return (
    <Stack gap="xs">
      <Select
        data={[
          { value: 'equal', label: 'Equal' },
          { value: 'not_equal', label: 'Not equal' },
          { value: 'less', label: 'Less than' },
          { value: 'greater', label: 'Greater than' },
          { value: 'less_or_equal', label: 'Less or equal' },
          { value: 'greater_or_equal', label: 'Greater or equal' },
          { value: 'empty', label: 'Is empty' },
        ]}
        value={operator} onChange={value => setOperator(value as FilterItem['operator'])}
      />
      {
        (col?.type == 'Number' && <NumberInput placeholder={col?.title} value={value as never} onChange={setValue} />) ||
        (col?.type == 'String' && <Input placeholder={col?.title} value={value as never} onChange={e => setValue(e?.target?.value)} />) ||
        (col?.type == 'Datetime' && <DatePicker value={value as never} onChange={d => setValue(dayjs(d)?.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'))} />) ||
        (<Input placeholder={col?.title} value={value as never} onChange={e => setValue(e?.target?.value)} />)
      }
      <Group gap="xs">
        <Button size="xs" variant="outline" leftSection={<IconFilterFilled />} disabled={!isChanged} onClick={() => applyFilter?.(filter!, operator, value!, type!)}>Apply</Button>
        <Button size="xs" variant="light" color="red" leftSection={<IconTrash />} onClick={() => clearFilter?.(filter!)}>Clear</Button>
        <Button size="xs" variant="light" color="red" leftSection={<IconFilterOff />} onClick={() => clearAllFilters?.()}>Clear All </Button>
      </Group>
    </Stack>
  );
}

export default function DataPage() {
  const navigate = useNavigate();
  const { projectId, page: taskPage, taskId } = useParams<{ projectId?: string, page?: string, taskId?: string }>();
  const context = useOutletContext<ProjectDetailContext>();
  const { columns: _columns, users, mainHeight, view: initialView, currentUser } = context || {};

  const { mutate: updateView, data: updatedViewData } = useUpdateDataManagerView(initialView?.id || 0, parseInt(projectId || "0"));
  const view = updatedViewData || initialView;

  // Reorder columns: id first, data children last
  let columns = (_columns || []).filter(c => !(view?.data?.hiddenColumns?.explore || []).includes(`tasks:${c?.parent ? `${c?.parent}.` : ''}${c.id}`));
  const nonDataColumns = columns?.filter(c => c?.parent != 'data')?.filter(c => c.id != 'data');
  const dataColumns = columns?.filter(c => c?.parent == 'data')?.filter(c => c.id != 'id');
  const dataColumnsId = dataColumns?.map(c => c.id);
  columns = [...nonDataColumns, ...dataColumns];

  // Fetch tasks
  const [page, setPage] = useState(1);
  const [pageSize] = useState(30);
  const { data: tasksInfo, refetch: refetchTasks, loading: fetchTaskLoading } = useFetchTasks(page, pageSize, parseInt(projectId || "0"), view?.id || 0);
  const records = (tasksInfo?.tasks || []).map(({ data, ...task }) => ({ ...task, ...omit(data, 'id') }));

  useEffect(() => {
    if (page < parseInt(taskPage || "1")) setPage(page => page + 1);
  }, [page, taskPage]);

  useEffect(() => {
    if (taskId) document.querySelector(`[data-row-id="${taskId}"]`)
      ?.scrollIntoView({ block: 'end', behavior: 'smooth' });
  }, [taskId, records]);

  const storeColumnsKey = 'task-columns';
  type Record = typeof records[0];

  const [ordering] = view?.data?.ordering || [];
  const [_lsDir, lsAccessor] = (ordering?.replace('tasks', '')?.replace('data.', '') || '').split(':');
  const lsDir = _lsDir.includes('-') ? 'desc' : 'asc';

  const conjunction = view?.data?.filters?.conjunction || 'and';
  const filtersItems = view?.data?.filters?.items || [];

  let { effectiveColumns } = useDataTableColumns({
    key: storeColumnsKey,
    columns: columns
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
          sortable: true,
          resizable: true,
          filtering: filtersItems?.map(f => f?.filter?.replace('filter:tasks:', '')).includes(`${col.parent ? `${col.parent}.` : ''}${col.id}`),
          filter: (
            !(col?.parent == 'data' && (col?.id == 'annotator_1' || col?.id == 'annotator_2' || col?.id == 'annotator_3')) &&
            <ColumnFilter col={col}
              item={filtersItems?.find(f => f.filter == `filter:tasks:${col.parent ? `${col.parent}.` : ''}${col.id}`)}
              applyFilter={async (filter, operator, value, type) => {
                // if filter exists in filtersItems, update it, else add it
                const existingIndex = filtersItems.findIndex(f => f.filter == filter);
                let newFiltersItems: FilterItem[] = [];
                if (existingIndex >= 0) {
                  newFiltersItems = [...filtersItems];
                  // @ts-expect-error TS2345
                  newFiltersItems[existingIndex] = { filter, operator: operator as FilterItem['operator'], value, type };
                } else {
                  // @ts-expect-error TS2345
                  newFiltersItems = [...filtersItems, { filter, operator, value, type }];
                }

                newFiltersItems = [
                  ...newFiltersItems,
                  { filter: 'filter:tasks:data.assigned_annotators', operator: 'contains', value: currentUser?.email || null, type: 'String' },
                ];

                await updateView(merge(
                  view?.data,
                  { filters: { conjunction, items: newFiltersItems } } as Partial<ViewConfig>,
                ));
                await refetchTasks({ page: 1, clean: true });
                setPage(1);
              }}
              clearFilter={async (filter) => {
                let newFiltersItems = filtersItems.filter(f => f.filter != filter);
                newFiltersItems = [
                  ...newFiltersItems,
                  { filter: 'filter:tasks:data.assigned_annotators', operator: 'contains', value: currentUser?.email || null, type: 'String' },
                ];
                await updateView({
                  ...view?.data,
                  filters: { conjunction, items: newFiltersItems }
                } as Partial<ViewConfig>);
                await refetchTasks({ page: 1, clean: true });
                setPage(1);
              }}
              clearAllFilters={async () => {
                await updateView({
                  ...view?.data,
                  filters: {
                    conjunction, items: [
                      { filter: 'filter:tasks:data.assigned_annotators', operator: 'contains', value: currentUser?.email || null, type: 'String' },
                    ]
                  }
                } as Partial<ViewConfig>);
                await refetchTasks({ page: 1, clean: true });
                setPage(1);
              }}
            />
          ),
        } as DataTableColumn<Record>;
      }),
  });

  effectiveColumns = columns.map((col) => effectiveColumns.find(c => c.accessor == col.id)) as DataTableColumn<Record>[];

  return (
    <>
      <DataTable
        striped
        highlightOnHover
        height={mainHeight || 100}
        storeColumnsKey={storeColumnsKey}
        onScrollToBottom={() => {
          if (tasksInfo?.tasks?.length < tasksInfo?.total) setPage((p) => p + 1);
        }}
        pinFirstColumn
        fetching={fetchTaskLoading}
        columns={effectiveColumns}
        records={records}
        sortStatus={{ columnAccessor: lsAccessor, direction: lsDir }}
        onSortStatusChange={async (sortStatus) => {
          await updateView(merge(
            view?.data,
            { ordering: [`${sortStatus?.direction == 'asc' ? '' : '-'}tasks:${dataColumnsId?.includes(sortStatus?.columnAccessor) ? 'data.' : ''}${sortStatus?.columnAccessor}`] }
          ));
          await refetchTasks({ page: 1, clean: true });
          setPage(1);
        }}
        sortIcons={{
          sorted: <IconChevronUp size={14} />,
          unsorted: <IconSelector size={14} />,
        }}
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
        }}
      />
      <Outlet context={{
        ...context,
        refetchTasks(page) {
          return refetchTasks({ page });
        },
      } as ProjectDataContext} />
    </>
  );
}