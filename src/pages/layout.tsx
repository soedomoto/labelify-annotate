import { useFetchVersion, type Version } from "@/stores/sysinfo";
import { useFetchCurrentUser, type CurrentUser } from "@/stores/whoami";
import { AppShell, Burger, Group } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { useRef, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

export interface LayoutOutletContext {
  version?: Version;
  currentUser?: CurrentUser;
  mainHeight?: number;
}

export default function LayoutPage() {
  const { data: version } = useFetchVersion();
  const { data: currentUser } = useFetchCurrentUser();

  const shellMainRef = useRef<HTMLDivElement>(null);
  const [opened, { toggle }] = useDisclosure();
  const [mainHeight, setMainHeight] = useState(0);

  useEffect(() => {
    const printHeight = () => {
      if (shellMainRef.current) {
        const computedStyle = window.getComputedStyle(shellMainRef.current);
        setMainHeight(parseFloat(computedStyle.height));
      }
    };

    printHeight();

    window.addEventListener('resize', printHeight);
    return () => window.removeEventListener('resize', printHeight);
  }, []);

  return (
    <AppShell
      padding="md"
      header={{ height: { base: 60, md: 70, lg: 80 } }}
      // navbar={{
      //   width: { base: 200, md: 300, lg: 400 },
      //   breakpoint: 'sm',
      //   collapsed: { mobile: !opened },
      // }}
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          Labelify Annotate
        </Group>
      </AppShell.Header>
      {/* <AppShell.Navbar p="md">Navbar</AppShell.Navbar> */}
      <AppShell.Main ref={shellMainRef}>
        <Outlet context={{
          version,
          currentUser,
          mainHeight,
        }} />
      </AppShell.Main>
    </AppShell>
  );
}