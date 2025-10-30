import { useFetchProjects } from "@/stores/projects";
import { Avatar, Card, Group, Progress, Text } from "@mantine/core";
import { showNotification } from '@mantine/notifications';
import { DataTable } from 'mantine-datatable';
import { NavLink } from 'react-router-dom';

export default function ProjectsPage() {
  const { data: project } = useFetchProjects();

  return (
    <Card withBorder radius="md">
      <DataTable
        withTableBorder
        borderRadius="sm"
        withColumnBorders
        striped
        highlightOnHover
        records={project?.results || []}
        columns={[
          {
            accessor: 'id',
            title: 'Project',
            render: ({ id, title, finished_task_number, task_number }) => (
              <Group justify='space-between'>
                <Group>
                  <Avatar src="https://www.svgrepo.com/show/331488/folder.svg" radius="sm" />
                  <div>
                    <NavLink to={`/projects/${id}/data`}>
                      <Text fw={500}>{title}</Text>
                    </NavLink>
                    <Text fz="xs" c="dimmed">
                      {finished_task_number} / {task_number} ({(finished_task_number / task_number * 100).toFixed(0)}%)
                    </Text>
                  </div>
                </Group>
                <Progress.Root size="xl" w={200}>
                  <Progress.Section value={(finished_task_number / task_number * 100)} color="cyan" />
                </Progress.Root>
              </Group>
            )
          },
        ]}
        // execute this callback when a row is clicked
        onRowClick={({ record: { title, finished_task_number, task_number } }) =>
          showNotification({
            title: `Clicked on ${title}`,
            message: `${finished_task_number} / ${task_number} (${(finished_task_number / task_number * 100).toFixed(0)}%)`,
            withBorder: true,
          })
        }
      />
    </Card>
  );
}