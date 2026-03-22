import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { HomePage } from '../pages/HomePage';
import { IntroductionPage } from '../pages/IntroductionPage';
import { ComparisonPage } from '../pages/ComparisonPage';
import { StructurePage } from '../pages/StructurePage';
import { OperationsOverviewPage } from '../pages/OperationsOverviewPage';
import { CreateOperationsPage } from '../pages/CreateOperationsPage';
import { ModifyOperationsPage } from '../pages/ModifyOperationsPage';
import { MemoryOperationsPage } from '../pages/MemoryOperationsPage';
import { PreAllocationPage } from '../pages/PreAllocationPage';
import { LazyFreePage } from '../pages/LazyFreePage';
import { TypeSwitchingPage } from '../pages/TypeSwitchingPage';
import { DemoPage } from '../pages/DemoPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'introduction',
        element: <IntroductionPage />,
      },
      {
        path: 'vs-c-string',
        element: <ComparisonPage />,
      },
      {
        path: 'structure',
        element: <StructurePage />,
      },
      {
        path: 'operations',
        element: <OperationsOverviewPage />,
      },
      {
        path: 'operations/create',
        element: <CreateOperationsPage />,
      },
      {
        path: 'operations/modify',
        element: <ModifyOperationsPage />,
      },
      {
        path: 'operations/memory',
        element: <MemoryOperationsPage />,
      },
      {
        path: 'memory-strategy/pre-allocation',
        element: <PreAllocationPage />,
      },
      {
        path: 'memory-strategy/lazy-free',
        element: <LazyFreePage />,
      },
      {
        path: 'memory-strategy/type-switching',
        element: <TypeSwitchingPage />,
      },
    ],
  },
  {
    path: 'demo',
    element: <DemoPage />,
  },
]);
