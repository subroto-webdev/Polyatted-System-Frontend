import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from '../../components/common/AppShell';
import TeacherDashboard from '../../components/teacher/TeacherDashboard';
import TeacherSubjects from '../../components/teacher/TeacherSubjects';
import TeacherTakeAttendance from '../../components/teacher/TeacherTakeAttendance';
import TeacherReports from '../../components/teacher/TeacherReports';
import TeacherScanner from '../../components/teacher/TeacherScanner';
import TeacherSessions from '../../components/teacher/TeacherSessions';
import TeacherExport from '../../components/teacher/TeacherExport';

const navItems = [
  { label: 'Dashboard', icon: 'dashboard', path: '/teacher' },
  { label: 'My Subjects', icon: 'book', path: '/teacher/subjects' },
  { label: 'Take Attendance', icon: 'clipboard', path: '/teacher/attendance' },
  { label: 'QR Scanner', icon: 'qr', path: '/teacher/scanner' },
  { label: 'Session History', icon: 'history', path: '/teacher/sessions' },
  { label: 'Reports', icon: 'chart', path: '/teacher/reports' },
  { label: 'Excel Export', icon: 'excel', path: '/teacher/export' },
];

export default function TeacherLayout() {
  return (
    <AppShell navItems={navItems}>
      <Routes>
        <Route index element={<TeacherDashboard />} />
        <Route path="subjects" element={<TeacherSubjects />} />
        <Route path="attendance" element={<TeacherTakeAttendance />} />
        <Route path="scanner" element={<TeacherScanner />} />
        <Route path="sessions" element={<TeacherSessions />} />
        <Route path="reports" element={<TeacherReports />} />
        <Route path="export" element={<TeacherExport />} />
        <Route path="*" element={<Navigate to="/teacher" replace />} />
      </Routes>
    </AppShell>
  );
}
