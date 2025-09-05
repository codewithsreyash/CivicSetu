import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { BASE_URL, DEFAULT_PAGE_SIZE } from '../config';

type Report = {
  _id: string;
  title: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  assignedDepartment?: string;
  reportedBy: { name: string; email: string };
  createdAt: string;
};

const statuses = ['pending', 'in_progress', 'resolved', 'rejected'] as const;
const priorities = ['low', 'medium', 'high'] as const;

const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [status, setStatus] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [priority, setPriority] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [pages, setPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchReports();
  }, [status, category, priority, page]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/departments/categories`);
      setCategories(res.data);
    } catch (e) {
      console.error('Failed to load categories', e);
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(DEFAULT_PAGE_SIZE));
      if (status) params.set('status', status);
      if (category) params.set('category', category);
      if (priority) params.set('priority', priority);
      const res = await axios.get(`${BASE_URL}/api/reports?${params.toString()}`);
      setReports(res.data.reports);
      setPages(res.data.pages);
    } catch (e) {
      console.error('Failed to load reports', e);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: Report['status']) => {
    try {
      setUpdatingId(id);
      const res = await axios.put(`${BASE_URL}/api/reports/${id}/status`, { status: newStatus });
      setReports((prev) => prev.map((r) => (r._id === id ? { ...r, status: res.data.status } : r)));
    } catch (e) {
      console.error('Failed to update status', e);
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleString();

  return (
    <div>
      <h2>Reports</h2>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }}>
          <option value="">All Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
        <select value={category} onChange={(e) => { setPage(1); setCategory(e.target.value); }}>
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={priority} onChange={(e) => { setPage(1); setPriority(e.target.value); }}>
          <option value="">All Priorities</option>
          {priorities.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Title</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned Dept</th>
              <th>Reporter</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r._id}>
                <td style={{ textAlign: 'left' }}>{r.title}</td>
                <td>{r.category}</td>
                <td>{r.priority}</td>
                <td>{r.status.replace('_', ' ')}</td>
                <td>{r.assignedDepartment || '-'}</td>
                <td>{r.reportedBy?.name}</td>
                <td>{formatDate(r.createdAt)}</td>
                <td>
                  <select
                    value={r.status}
                    onChange={(e) => updateStatus(r._id, e.target.value as Report['status'])}
                    disabled={updatingId === r._id}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s.replace('_', ' ')}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center' }}>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
        <span>
          Page {page} / {pages}
        </span>
        <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page >= pages}>Next</button>
      </div>
    </div>
  );
};

export default ReportsPage;


