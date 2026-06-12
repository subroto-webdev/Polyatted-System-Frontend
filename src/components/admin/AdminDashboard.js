import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Icon from '../common/Icon';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0, teachers: 0, subjects: 0, sessions: 0 });
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/users?role=student'),
      api.get('/users?role=teacher'),
      api.get('/subjects'),
      api.get('/sessions'),
    ]).then(([st, te, su, se]) => {
      setStats({
        students: st.data.count || 0,
        teachers: te.data.count || 0,
        subjects: su.data.subjects?.length || 0,
        sessions: se.data.count || 0,
      });
      setRecentSessions(se.data.sessions?.slice(0, 6) || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Admin Dashboard</h2>
        <p className="page-sub">System overview এবং সামগ্রিক পরিসংখ্যান</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-blue">
          <div className="stat-icon"><Icon name="users" size={18} /></div>
          <div className="stat-val">{stats.students}</div>
          <div className="stat-lbl">Students</div>
        </div>
        <div className="stat-card stat-green">
          <div className="stat-icon"><Icon name="users" size={18} /></div>
          <div className="stat-val">{stats.teachers}</div>
          <div className="stat-lbl">Teachers</div>
        </div>
        <div className="stat-card stat-amber">
          <div className="stat-icon"><Icon name="book" size={18} /></div>
          <div className="stat-val">{stats.subjects}</div>
          <div className="stat-lbl">Subjects</div>
        </div>
        <div className="stat-card stat-purple">
          <div className="stat-icon"><Icon name="clipboard" size={18} /></div>
          <div className="stat-val">{stats.sessions}</div>
          <div className="stat-lbl">Sessions</div>
        </div>
      </div>

      <div className="section-title">সাম্প্রতিক Sessions</div>
      <div className="card">
        {recentSessions.length === 0 ? (
          <div className="empty"><p>কোনো session নেই</p></div>
        ) : recentSessions.map(s => (
          <div key={s._id} className="list-item" style={{ cursor: 'default' }}>
            <div className="item-icon icon-green"><Icon name="clipboard" size={18} /></div>
            <div className="item-content">
              <div className="item-title">{s.subjectId?.name} — {s.section}</div>
              <div className="item-sub">{s.departmentId?.name} • {s.teacherId?.name} • {new Date(s.date).toLocaleDateString()}</div>
            </div>
            <div className="item-right">
              <div style={{ fontSize: 13, fontWeight: 600 }}>{s.presentCount}/{s.totalStudents}</div>
              <span className={`tag ${s.status === 'active' ? 'tag-green' : 'tag-gray'}`} style={{ fontSize: 10 }}>{s.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
