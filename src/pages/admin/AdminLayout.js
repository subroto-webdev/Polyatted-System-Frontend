import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from '../../components/common/AppShell';
import AdminDashboard from '../../components/admin/AdminDashboard';
import AdminUsers from '../../components/admin/AdminUsers';
import AdminDepartments from '../../components/admin/AdminDepartments';
import AdminSubjects from '../../components/admin/AdminSubjects';
import AdminReports from '../../components/admin/AdminReports';
import AdminHolidays from '../../components/admin/AdminHolidays';

const navItems = [
  { label: 'Dashboard', icon: 'dashboard', path: '/admin' },
  { section: 'Management' },
  { label: 'Users', icon: 'users', path: '/admin/users' },
  { label: 'Departments', icon: 'department', path: '/admin/departments' },
  { label: 'Subjects', icon: 'book', path: '/admin/subjects' },
  { label: 'Holidays', icon: 'calendar', path: '/admin/holidays' },
  { section: 'Analytics' },
  { label: 'Reports', icon: 'chart', path: '/admin/reports' },
];

export default function AdminLayout() {
  return (
    <AppShell navItems={navItems}>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="departments" element={<AdminDepartments />} />
        <Route path="subjects" element={<AdminSubjects />} />
        <Route path="holidays" element={<AdminHolidays />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AppShell>
  );
}
