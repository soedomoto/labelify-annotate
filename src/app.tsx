import { createTheme, localStorageColorSchemeManager, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Suspense } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages';
import LayoutPage from './pages/layout';
import ProjectsPage from './pages/projects';
import ProjectDetailPage from './pages/projects/[projectId]';
import DataPage from './pages/projects/[projectId]/data';
import TaskPage from './pages/projects/[projectId]/data/[page]/[taskId]';
import { withProvider } from './stores/store';
import PaginatedTasksPage from './pages/projects/[projectId]/data/[page]';

export default function App() {
  const theme = createTheme({
    fontFamily: 'Open Sans, sans-serif',
    primaryColor: 'cyan',
  });

  const colorSchemeManager = localStorageColorSchemeManager({
    key: 'labelify-web-color-scheme',
  });

  return withProvider(
    <MantineProvider theme={theme} colorSchemeManager={colorSchemeManager} classNamesPrefix="labelify">
      <Notifications />
      <HashRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" Component={LayoutPage}>
              <Route index Component={HomePage} />
              <Route path="projects" Component={ProjectsPage} />
              <Route path="projects/:projectId" Component={ProjectDetailPage}>
                <Route path="data" Component={DataPage}>
                  <Route path=":page" Component={PaginatedTasksPage}>
                    <Route path=":taskId" Component={TaskPage} />
                  </Route>
                </Route>
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </HashRouter>
    </MantineProvider>
  );
}