import { useFetchVersion, type Version } from "@/stores/sysinfo";
import { useFetchCurrentUser, type CurrentUser } from "@/stores/whoami";
import { ActionIcon, AppShell, Avatar, Burger, Flex, Group, Loader, Menu, Text, Tooltip, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { IconLogout, IconMoon, IconSun } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";

export interface LayoutOutletContext {
  version?: Version;
  currentUser?: CurrentUser;
  mainHeight?: number;
}

export default function LayoutPage() {
  const { data: version } = useFetchVersion();
  const { data: currentUser, loading: fetchUserLoading } = useFetchCurrentUser();

  const shellMainRef = useRef<HTMLDivElement>(null);
  const [opened, { toggle }] = useDisclosure();
  const [mainHeight, setMainHeight] = useState(0);

  const { toggleColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  useEffect(() => {
    const printHeight = () => {
      if (shellMainRef.current) {
        const computedStyle = window.getComputedStyle(shellMainRef.current);
        setMainHeight(
          parseFloat(computedStyle.height) -
          parseFloat(computedStyle.paddingTop) -
          parseFloat(computedStyle.paddingBottom)
        );
      }
    };

    printHeight();

    window.addEventListener('resize', printHeight);
    return () => window.removeEventListener('resize', printHeight);
  }, []);

  if (fetchUserLoading) return <Loader size={50} />;

  return (
    <AppShell
      padding="md"
      pos="relative"
      header={{ height: { base: 60 } }}
    // navbar={{
    //   width: { base: 200, md: 300, lg: 400 },
    //   breakpoint: 'sm',
    //   collapsed: { mobile: !opened },
    // }}
    >
      <AppShell.Header>
        <Flex align="center" h="100%" px="md" justify="space-between" w="100%">
          <Group h="100%" px="md">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text
              size="xl"
              fw={900}
              variant="gradient"
              gradient={{ from: 'red', to: 'yellow', deg: 22 }}
            >Annotate</Text>
          </Group>
          <Group h="100%" px="md">
            <ActionIcon size="lg" radius="xl" variant="outline" autoContrast onClick={() => toggleColorScheme()}>
              {computedColorScheme == 'light' && <IconMoon size={18} />}
              {computedColorScheme == 'dark' && <IconSun size={18} />}
            </ActionIcon>
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Tooltip label={currentUser?.email || ''}>
                  <Avatar color="initials" name={currentUser?.initials?.toUpperCase()} radius="xl">{currentUser?.initials?.toUpperCase()}</Avatar>
                </Tooltip>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item disabled>{currentUser?.email || ''}</Menu.Item>
                <Menu.Divider />
                {/* <Menu.Label>Application</Menu.Label>
                <Menu.Item leftSection={<IconSettings size={14} />}>
                  Settings
                </Menu.Item>
                <Menu.Item leftSection={<IconMessageCircle size={14} />}>
                  Messages
                </Menu.Item>
                <Menu.Item leftSection={<IconPhoto size={14} />}>
                  Gallery
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconSearch size={14} />}
                  rightSection={
                    <Text size="xs" c="dimmed">
                      ⌘K
                    </Text>
                  }
                >
                  Search
                </Menu.Item>

                <Menu.Divider />

                <Menu.Label>Danger zone</Menu.Label>
                <Menu.Item
                  leftSection={<IconArrowsLeftRight size={14} />}
                >
                  Transfer my data
                </Menu.Item> */}
                <Menu.Item color="red" leftSection={<IconLogout size={14} />}
                  onClick={() => location.href = `/annotation/logout`}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Flex>
      </AppShell.Header>
      {/* <AppShell.Navbar p="md">Navbar</AppShell.Navbar> */}
      <AppShell.Main pb={0} pl={0} pr={0} ref={shellMainRef}>
        <Outlet context={{
          version,
          currentUser,
          mainHeight,
        }} />
      </AppShell.Main>
    </AppShell>
  );
}