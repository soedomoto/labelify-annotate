import { createTheme, localStorageColorSchemeManager, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Suspense } from 'react';
import { HashRouter, Outlet, Route, Routes } from 'react-router-dom';
import ProjectsPage from './pages/projects';
import { withProvider } from './stores/store';
import DataPage from './pages/projects/[projectId]/data';
import TaskPage from './pages/projects/[projectId]/data/[taskId]';

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
            <Route path="/" element={<Outlet />}>
              <Route index element={<div>Welcome to Labelify Annotate</div>} />
              <Route path="projects" Component={ProjectsPage} />
              <Route path="projects/:projectId" Component={Outlet}>
                <Route path="data" Component={DataPage}>
                  <Route path=":taskId" Component={TaskPage} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </HashRouter>
    </MantineProvider>
  );
}