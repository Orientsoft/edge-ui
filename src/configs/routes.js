import { lazy } from 'react';

export default [
  {
    path: '/tags',
    component: lazy(() => import('@/pages/Tags')),
  },
  {
    path: '/services',
    component: lazy(() => import('@/pages/Services')),
  },
  {
    path: '/nodes',
    component: lazy(() => import('@/pages/Nodes')),
  },
  {
    path: '/tasks',
    component: lazy(() => import('@/pages/Tasks')),
  },
];
