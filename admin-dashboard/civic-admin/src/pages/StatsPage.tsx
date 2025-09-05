import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';

type Stat = { _id: string; count: number };

const StatsPage: React.FC = () => {
  const [statusStats, setStatusStats] = useState<Stat[]>([]);
  const [categoryStats, setCategoryStats] = useState<Stat[]>([]);
  const [priorityStats, setPriorityStats] = useState<Stat[]>([]);
  const [dailyReports, setDailyReports] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/reports/stats`);
      setStatusStats(res.data.statusStats);
      setCategoryStats(res.data.categoryStats);
      setPriorityStats(res.data.priorityStats);
      setDailyReports(res.data.dailyReports);
    } catch (e) {
      console.error('Failed to load stats', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Analytics</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          <div>
            <h3>Status</h3>
            <ul>
              {statusStats.map((s) => (
                <li key={s._id}>{s._id || 'unknown'}: {s.count}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Priority</h3>
            <ul>
              {priorityStats.map((s) => (
                <li key={s._id}>{s._id || 'unknown'}: {s.count}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Category</h3>
            <ul>
              {categoryStats.map((s) => (
                <li key={s._id}>{s._id || 'unknown'}: {s.count}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Last 30 days</h3>
            <ul>
              {dailyReports.map((d) => (
                <li key={d._id}>{d._id}: {d.count}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsPage;


