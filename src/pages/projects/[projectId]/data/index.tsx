import type { LayoutOutletContext } from "@/pages/layout";
import { Avatar, Card, Group, Text } from "@mantine/core";
import { showNotification } from '@mantine/notifications';
import { DataTable } from "mantine-datatable";
import { NavLink, Outlet, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useFetchDataManagerView, useFetchTasks } from "../../../../stores/project";

export default function DataPage() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId?: string, taskId?: string }>();
  const context = useOutletContext<LayoutOutletContext>();

  const { data: dmView } = useFetchDataManagerView(parseInt(projectId || "0"));
  const [dm] = dmView || [];
  const { data: tasks } = useFetchTasks(1, 30, parseInt(projectId || "0"), dm?.id || 0);

  return (
    <>
      <Card withBorder radius="md">
        <DataTable
          withTableBorder
          borderRadius="sm"
          withColumnBorders
          striped
          highlightOnHover
          records={tasks?.tasks || []}
          columns={[
            {
              accessor: 'id',
              title: 'Data',
              render: ({ id, data }) => (
                <Group justify='space-between'>
                  <Group>
                    <Avatar src="https://www.svgrepo.com/show/331488/folder.svg" radius="sm" />
                    <div>
                      <NavLink to={`/projects/${projectId}/data/${id}`}>
                        <Text fw={500}>{data?.tiktok_url}</Text>
                      </NavLink>
                      <Text fz="xs" c="dimmed">
                        {data?.video_description}
                      </Text>
                    </div>
                  </Group>
                </Group>
              )
            },
          ]}
          // execute this callback when a row is clicked
          onRowClick={({ record: { id, data } }) => {
            navigate(`/projects/${projectId}/data/${id}`);
            showNotification({
              title: `Clicked on ${data?.tiktok_url}`,
              message: data?.video_description,
              withBorder: true,
            });
          }
          }
        />
      </Card>
      <Outlet context={context} />
    </>
  );
}