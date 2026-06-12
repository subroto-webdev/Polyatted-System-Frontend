import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Icon from '../common/Icon';
import toast from 'react-hot-toast';

export default function TeacherSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', code: '', departmentId: '', semester: '', section: '' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([api.get('/subjects'), api.get('/departments/public')])
      .then(([s, d]) => { setSubjects(s.data.subjects || []); setDepartments(d.data.departments || []); })
      .catch(console.error).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  const openCreate = () => { setEditItem(null); setForm({ name: '', code: '', departmentId: '', semester: '', section: '' }); setShowModal(true); };
  const openEdit = (s) => { setEditItem(s); setForm({ name: s.name, code: s.code, departmentId: s.departmentId?._id || '', semester: s.semester, section: s.section }); setShowModal(true); };

  const handleSubmit = async () => {
    if (!form.name || !form.code || !form.departmentId || !form.semester || !form.section) return toast.error('সব field পূরণ করুন');
    setSaving(true);
    try {
      if (editItem) {
        await api.put(`/subjects/${editItem._id}`, form);
        toast.success('Subject updated!');
      } else {
        await api.post('/subjects', form);
        toast.success('Subject তৈরি হয়েছে!');
      }
      setShowModal(false);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('এই subject delete করবেন?')) return;
    try { await api.delete(`/subjects/${id}`); toast.success('Deleted'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  // Group by dept/sem/section
  const grouped = {};
  subjects.forEach(s => {
    const key = `${s.departmentId?.name} — Semester ${s.semester} Section ${s.section}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(s);
  });

  return (
    <div className="page">
      <div className="page-header flex justify-between items-center">
        <div>
          <h2 className="page-title">আমার Subjects</h2>
          <p className="page-sub">Subject তৈরি ও পরিচালনা করুন</p>
        </div>
        <button className="btn-primary" style={{ width: 'auto', padding: '9px 18px' }} onClick={openCreate}>
          <Icon name="plus" size={16} /> New Subject
        </button>
      </div>

      {subjects.length === 0 ? (
        <div className="card">
          <div className="empty">
            <div className="empty-icon"><Icon name="book" size={24} /></div>
            <p>কোনো subject নেই।<br />উপরের বোতাম দিয়ে তৈরি করুন।</p>
          </div>
        </div>
      ) : Object.entries(grouped).map(([group, items]) => (
        <div key={group} style={{ marginBottom: 20 }}>
          <div className="section-title">{group}</div>
          <div className="card">
            {items.map(s => (
              <div key={s._id} className="list-item">
                <div className="item-icon icon-green"><Icon name="book" size={18} /></div>
                <div className="item-content">
                  <div className="item-title">{s.name}</div>
                  <div className="item-sub">Code: {s.code} • {s.departmentId?.name}</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn-icon" onClick={() => openEdit(s)} title="Edit"><Icon name="edit" size={16} /></button>
                  <button className="btn-icon" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(s._id)} title="Delete"><Icon name="trash" size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {showModal && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-sheet">
            <div className="modal-handle" />
            <div className="modal-title">{editItem ? 'Subject Edit' : 'নতুন Subject তৈরি'}</div>
            <div className="form-group">
              <label className="form-label">Subject Name *</label>
              <input className="form-input" placeholder="যেমন: Data Structure" value={form.name} onChange={set('name')} />
            </div>
            <div className="form-group">
              <label className="form-label">Subject Code *</label>
              <input className="form-input" placeholder="যেমন: CST-301" value={form.code} onChange={set('code')} />
            </div>
            <div className="form-group">
              <label className="form-label">Department *</label>
              <select className="form-select" value={form.departmentId} onChange={set('departmentId')}>
                <option value="">-- Department বেছে নিন --</option>
                {departments.map(d => <option key={d._id} value={d._id}>{d.name} ({d.code})</option>)}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Semester *</label>
                <select className="form-select" value={form.semester} onChange={set('semester')}>
                  <option value="">--</option>
                  {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}rd/th</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Section *</label>
                <select className="form-select" value={form.section} onChange={set('section')}>
                  <option value="">--</option>
                  {['A','B','C','D'].map(s => <option key={s} value={s}>Section {s}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>বাতিল</button>
              <button className="btn-primary" onClick={handleSubmit} disabled={saving}>
                {saving ? <><div className="spinner spinner-sm" /> সংরক্ষণ...</> : editItem ? 'Update' : 'তৈরি করুন'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
