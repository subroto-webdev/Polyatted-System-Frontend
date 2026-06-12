import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from '../../components/common/AppShell';
import StudentHome from '../../components/student/StudentHome';
import StudentAttendance from '../../components/student/StudentAttendance';
import StudentQR from '../../components/student/StudentQR';
import StudentReport from '../../components/student/StudentReport';

const navItems = [
  { label: 'Dashboard', icon: 'dashboard', path: '/student' },
  { label: 'My Attendance', icon: 'clipboard', path: '/student/attendance' },
  { label: 'QR Code', icon: 'qr', path: '/student/qr' },
  { label: 'Download Report', icon: 'download', path: '/student/report' },
];

export default function StudentLayout() {
  return (
    <AppShell navItems={navItems}>
      <Routes>
        <Route index element={<StudentHome />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="qr" element={<StudentQR />} />
        <Route path="report" element={<StudentReport />} />
        <Route path="*" element={<Navigate to="/student" replace />} />
      </Routes>
    </AppShell>
  );
}
