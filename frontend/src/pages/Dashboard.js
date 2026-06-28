import { useEffect, useState } from 'react';
import { getStats } from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#e87c2e','#f0a050','#4a9ede','#3db87a','#e05454'];

const fmt = (n) => '₹' + (n >= 100000
  ? (n / 100000).toFixed(1) + 'L'
  : Number(n).toLocaleString('en-IN'));

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then(r => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (!stats)  return <div className="loading">Could not load stats. Is the backend running?</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard <span>Overview</span></h1>
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>Car Sales Management System</span>
      </div>

      <div className="stats-grid">
        {[
          { label: 'Total Sales',   value: stats.totalSales,                        accent: false },
          { label: 'Total Revenue', value: fmt(stats.totalRevenue),                  accent: true  },
          { label: 'Cars Listed',   value: stats.totalCars,                          accent: false },
          { label: 'Customers',     value: stats.totalCustomers,                     accent: false },
          { label: 'Dealers',       value: stats.totalDealers,                       accent: false },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-label">{s.label}</div>
            <div className={`stat-value ${s.accent ? 'accent' : ''}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="card">
          <div className="chart-title">Monthly Sales — 2024</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.monthlySales}>
              <XAxis dataKey="month" tick={{ fill: '#7a7870', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#7a7870', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1c1e22', border: '1px solid #2a2d33', borderRadius: 8 }}
                labelStyle={{ color: '#e8e6e0' }}
                formatter={(v) => [v, 'Sales']}
              />
              <Bar dataKey="count" fill="#e87c2e" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="chart-title">Top Car Brands</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={stats.topBrands} dataKey="units_sold" nameKey="brand" cx="50%" cy="50%" outerRadius={80} label={({ brand, percent }) => `${brand} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                {stats.topBrands.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1c1e22', border: '1px solid #2a2d33', borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div className="chart-title">Revenue by State</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.revenueByState} layout="vertical">
              <XAxis type="number" tick={{ fill: '#7a7870', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => fmt(v)} />
              <YAxis type="category" dataKey="state_name" width={110} tick={{ fill: '#e8e6e0', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1c1e22', border: '1px solid #2a2d33', borderRadius: 8 }}
                formatter={(v) => [fmt(v), 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#4a9ede" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
