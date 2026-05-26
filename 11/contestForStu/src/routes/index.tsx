import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { DashboardRedirect, HomeGate, LoginGate, RoleGate } from '@/components/auth/route-gates'
import { RootLayout } from '@/layouts/root-layout'
import { AwardPage } from '@/pages/award-page'
import { ContestDetailPage } from '@/pages/contest-detail-page'
import { ContestListPage } from '@/pages/contest-list-page'
import { HomePage } from '@/pages/home-page'
import { LoginPage } from '@/pages/login-page'
import { NotFoundPage } from '@/pages/not-found-page'

// New Split Pages (will be created soon)
import { AdminHomePage } from '@/pages/admin/admin-home-page'
import { AdminContestsPage } from '@/pages/admin/admin-contests-page'
import { AdminDataPage } from '@/pages/admin/admin-data-page'

import { TeacherHomePage } from '@/pages/teacher/teacher-home-page'
import { TeacherSignupsPage } from '@/pages/teacher/teacher-signups-page'
import { TeacherSubmitPage } from '@/pages/teacher/teacher-submit-page'

import { ReviewerHomePage } from '@/pages/reviewer/reviewer-home-page'
import { ReviewerQueuePage } from '@/pages/reviewer/reviewer-queue-page'
import { ReviewerReviewsPage } from '@/pages/reviewer/reviewer-reviews-page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <HomeGate>
            <HomePage />
          </HomeGate>
        ),
      },
      { path: 'contests', element: <ContestListPage /> },
      { path: 'contests/:id', element: <ContestDetailPage /> },
      { path: 'awards', element: <AwardPage /> },
      {
        path: 'login',
        element: (
          <LoginGate>
            <LoginPage />
          </LoginGate>
        ),
      },
      {
        path: 'dashboard',
        element: <DashboardRedirect />,
      },
      
      // Teacher Routes
      {
        path: 'teacher',
        element: <RoleGate allow="teacher"><Outlet /></RoleGate>,
        children: [
          { path: 'dashboard', element: <TeacherHomePage /> },
          { path: 'signups', element: <TeacherSignupsPage /> },
          { path: 'submit-signup', element: <TeacherSubmitPage /> },
          { index: true, element: <Navigate to="dashboard" replace /> }
        ]
      },
      
      // Reviewer Routes
      {
        path: 'reviewer',
        element: <RoleGate allow="reviewer"><Outlet /></RoleGate>,
        children: [
          { path: 'dashboard', element: <ReviewerHomePage /> },
          { path: 'queue', element: <ReviewerQueuePage /> },
          { path: 'reviews', element: <ReviewerReviewsPage /> },
          { index: true, element: <Navigate to="dashboard" replace /> }
        ]
      },
      
      // Admin Routes
      {
        path: 'admin',
        element: <RoleGate allow="admin"><Outlet /></RoleGate>,
        children: [
          { path: 'dashboard', element: <AdminHomePage /> },
          { path: 'contests', element: <AdminContestsPage /> },
          { path: 'data', element: <AdminDataPage /> },
          { index: true, element: <Navigate to="dashboard" replace /> }
        ]
      },
      
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
