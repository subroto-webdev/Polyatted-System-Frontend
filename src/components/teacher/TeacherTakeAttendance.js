import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Icon from '../common/Icon';
import toast from 'react-hot-toast';

export default function TeacherTakeAttendance() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState('select'); // select | mark | done

  useEffect(() => {
    api.get('/subjects').then(r => setSubjects(r.data.subjects || [])).finally(() => setLoading(false));
    // Check for any active session
    api.get('/sessions?status=active').then(r => {
      if (r.data.sessions?.length > 0) {
        const active = r.data.sessions[0];
        setSession(active);
        // Set selectedSubject from session data so 'done' step shows correct subject name
        if (active.subjectId) {
          setSelectedSubject(active.subjectId);
        }
        // Load students for this session
        loadStudentsForSession(active);
        setStep('mark');
      }
    }).catch(() => {});
  }, []);

  const loadStudentsForSession = async (sess) => {
    try {
      const params = {
        role: 'student',
        departmentId: sess.departmentId?._id || sess.departmentId,
        semester: sess.semester,
        section: sess.section
      };
      // session-এ shift থাকলে সেই shift-এর students আনো
      if (sess.shift) params.shift = sess.shift;

      const res = await api.get('/users', { params });
      const stds = res.data.users || [];
      setStudents(stds);
      // Load existing attendance
      const attRes = await api.get(`/attendance/session/${sess._id}`);
      const existing = {};
      attRes.data.attendance.forEach(a => { existing[a.studentId._id] = a.status; });
      // Default remaining to 'present'
      const attMap = {};
      stds.forEach(s => { attMap[s._id] = existing[s._id] || 'present'; });
      setAttendance(attMap);
    } catch (e) { console.error(e); }
  };

  const startSession = async (subject) => {
    setSelectedSubject(subject);
    setSaving(true);
    try {
      const res = await api.post('/sessions', {
        departmentId: subject.departmentId?._id || subject.departmentId,
        subjectId: subject._id,
        semester: subject.semester,
        section: subject.section
      });
      const sess = res.data.session;
      setSession(sess);
      await loadStudentsForSession(sess);
      setStep('mark');
      toast.success(`Session শুরু হয়েছে: ${subject.name}`);
    } catch (err) { toast.error(err.response?.data?.message || 'Session শুরু করতে সমস্যা'); }
    finally { setSaving(false); }
  };

  const toggleStudent = (studentId) => {
    setAttendance(prev => ({ ...prev, [studentId]: prev[studentId] === 'present' ? 'absent' : 'present' }));
  };

  const markAll = (status) => {
    const updated = {};
    students.forEach(s => { updated[s._id] = status; });
    setAttendance(updated);
  };

  const saveAndEndSession = async () => {
    if (!session) return;
    setSaving(true);
    try {
      // Save manual attendance
      const attendanceList = students.map(s => ({ studentId: s._id, status: attendance[s._id] || 'absent' }));
      await api.post('/attendance/manual', { sessionId: session._id, attendanceList });
      // End session
      await api.put(`/sessions/${session._id}/end`);
      toast.success('Attendance সংরক্ষিত ও session শেষ হয়েছে!');
      setStep('done');
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  const resetAll = () => {
    setSession(null); setSelectedSubject(null);
    setStudents([]); setAttendance({});
    setStep('select');
    api.get('/subjects').then(r => setSubjects(r.data.subjects || []));
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  const presentCount = Object.values(attendance).filter(v => v === 'present').length;
  const absentCount = students.length - presentCount;

  if (step === 'done') return (
    <div className="page">
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--primary)' }}>
          <Icon name="check" size={32} />
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Attendance সম্পন্ন!</h3>
        <p style={{ color: 'var(--txt2)', marginBottom: 24 }}>{selectedSubject?.name} — Section {selectedSubject?.section}</p>
        <div className="stats-grid" style={{ maxWidth: 300, margin: '0 auto 24px' }}>
          <div className="stat-card stat-green"><div className="stat-val">{presentCount}</div><div className="stat-lbl">Present</div></div>
          <div className="stat-card stat-red"><div className="stat-val">{absentCount}</div><div className="stat-lbl">Absent</div></div>
        </div>
        <button className="btn-primary" style={{ maxWidth: 200, margin: '0 auto' }} onClick={resetAll}>
          নতুন Attendance নিন
        </button>
      </div>
    </div>
  );

  if (step === 'mark') return (
    <div>
      <div className="action-bar">
        <button className="btn-icon" onClick={() => { if(window.confirm('Session বাতিল করবেন?')) { api.put(`/sessions/${session?._id}/end`).catch(()=>{}); resetAll(); } }}>
          <Icon name="chevronLeft" size={18} />
        </button>
        <div style={{ flex: 1 }}>
          <div className="action-bar-title">{session?.subjectId?.name}</div>
          <div style={{ fontSize: 12, color: 'var(--txt2)' }}>Sem {session?.semester} • Section {session?.section}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="tag tag-green">{presentCount}P</span>
          <span className="tag tag-red">{absentCount}A</span>
        </div>
      </div>

      <div style={{ padding: '12px 16px', background: 'var(--bg)', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8 }}>
        <button className="btn-success btn-sm" onClick={() => markAll('present')}><Icon name="check" size={14} /> সবাই Present</button>
        <button className="btn-danger btn-sm" onClick={() => markAll('absent')}><Icon name="x" size={14} /> সবাই Absent</button>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: 'var(--txt2)', alignSelf: 'center' }}>{students.length} জন</span>
      </div>

      <div style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
        {students.length === 0 ? (
          <div className="empty"><p>এই class-এ কোনো student নেই</p></div>
        ) : students.map(s => (
          <div key={s._id} className="att-row">
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
              {s.name.charAt(0)}
            </div>
            <div className="att-student-info">
              <div className="att-student-name">{s.name}</div>
              <div className="att-student-id">{s.studentId}</div>
            </div>
            <div className="att-toggle">
              <button className={`att-btn ${attendance[s._id] === 'present' ? 'present' : 'p-hover'}`} onClick={() => toggleStudent(s._id)}>
                {attendance[s._id] === 'present' ? '✓ P' : 'P'}
              </button>
              <button className={`att-btn ${attendance[s._id] === 'absent' ? 'absent' : 'a-hover'}`} onClick={() => { setAttendance(p => ({ ...p, [s._id]: 'absent' })); }}>
                {attendance[s._id] === 'absent' ? '✗ A' : 'A'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: 16 }}>
        <button className="btn-primary" onClick={saveAndEndSession} disabled={saving || students.length === 0}>
          {saving ? <><div className="spinner spinner-sm" /> সংরক্ষণ হচ্ছে...</> : <><Icon name="check" size={16} /> Attendance সংরক্ষণ ও Session শেষ</>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Attendance নিন</h2>
        <p className="page-sub">কোন subject-এর attendance নেবেন?</p>
      </div>

      {subjects.length === 0 ? (
        <div className="card">
          <div className="empty">
            <div className="empty-icon"><Icon name="book" size={24} /></div>
            <p>কোনো subject নেই। আগে "Subjects" থেকে subject তৈরি করুন।</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
          {subjects.map(s => (
            <div key={s._id} className="subject-card" onClick={() => !saving && startSession(s)}>
              <div className="subject-code">{s.code}</div>
              <div className="subject-name">{s.name}</div>
              <div className="subject-meta">{s.departmentId?.name} • Sem {s.semester} • Sec {s.section}</div>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--primary)', fontSize: 13, fontWeight: 600 }}>
                <Icon name="play" size={14} /> Attendance শুরু করুন
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
