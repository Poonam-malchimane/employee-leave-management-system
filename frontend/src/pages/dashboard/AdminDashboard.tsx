import { useEffect, useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { Users, CalendarDays, CheckCircle, XCircle, Clock } from 'lucide-react'
import api from '../../utils/axiosConfig'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'

interface DashboardData {
  total: number
  pending: number
  approved: number
  rejected: number
}

const COLORS = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b']

const monthlyData = [
  { month: 'Jan', leaves: 12 },
  { month: 'Feb', leaves: 8  },
  { month: 'Mar', leaves: 15 },
  { month: 'Apr', leaves: 10 },
  { month: 'May', leaves: 18 },
  { month: 'Jun', leaves: 7  },
]

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData>({
    total: 0, pending: 0, approved: 0, rejected: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/leaves/dashboard/admin')
      .then(res => setData(res.data))
      .catch(() => {
        // Use mock data if API fails
        setData({ total: 42, pending: 8, approved: 28, rejected: 6 })
      })
      .finally(() => setLoading(false))
  }, [])

  const stats = [
    { label: 'Total Leaves',    value: data.total,    icon: CalendarDays, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)'  },
    { label: 'Pending',         value: data.pending,  icon: Clock,        color: '#f59e0b', bg: 'rgba(245,158,11,0.08)'  },
    { label: 'Approved',        value: data.approved, icon: CheckCircle,  color: '#22c55e', bg: 'rgba(34,197,94,0.08)'   },
    { label: 'Rejected',        value: data.rejected, icon: XCircle,      color: '#ef4444', bg: 'rgba(239,68,68,0.08)'   },
  ]

  const pieData = [
    { name: 'Pending',  value: data.pending  },
    { name: 'Approved', value: data.approved },
    { name: 'Rejected', value: data.rejected },
  ]

  return (
    <AppLayout title="Dashboard">

      {/* Welcome banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)',
        borderRadius: '14px', padding: '24px 28px',
        marginBottom: '24px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: '-20px', top: '-20px',
          width: '160px', height: '160px',
          background: 'rgba(255,255,255,0.05)', borderRadius: '50%',
        }} />
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'white', marginBottom: '4px' }}>
          Good morning, Admin! 👋
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
          Here's what's happening with your team today.
        </p>
      </div>

      {/* Stat cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px', marginBottom: '24px',
      }}>
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} style={{
              backgroundColor: '#111111',
              border: '1px solid #1f1f1f',
              borderRadius: '12px', padding: '20px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>{stat.label}</p>
                  <p style={{ fontSize: '28px', fontWeight: 600, color: '#f0f0f0' }}>
                    {loading ? '...' : stat.value}
                  </p>
                </div>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  backgroundColor: stat.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={20} color={stat.color} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '16px', marginBottom: '24px' }}>

        {/* Bar chart */}
        <div style={{
          backgroundColor: '#111111', border: '1px solid #1f1f1f',
          borderRadius: '12px', padding: '20px',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 500, color: '#e0e0e0', marginBottom: '20px' }}>
            Monthly Leave Trends
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barSize={32}>
              <XAxis dataKey="month" tick={{ fill: '#555', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#555', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', color: '#e0e0e0' }}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              />
              <Bar dataKey="leaves" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div style={{
          backgroundColor: '#111111', border: '1px solid #1f1f1f',
          borderRadius: '12px', padding: '20px',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 500, color: '#e0e0e0', marginBottom: '20px' }}>
            Leave Status
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData} cx="50%" cy="50%"
                innerRadius={55} outerRadius={85}
                paddingAngle={3} dataKey="value"
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i + 1]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', color: '#e0e0e0' }}
              />
              <Legend
                formatter={(value) => <span style={{ color: '#888', fontSize: '12px' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent leaves table */}
      <div style={{
        backgroundColor: '#111111', border: '1px solid #1f1f1f',
        borderRadius: '12px', padding: '20px',
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: 500, color: '#e0e0e0', marginBottom: '16px' }}>
          Recent Leave Requests
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1f1f1f' }}>
              {['Employee', 'Type', 'From', 'To', 'Days', 'Status'].map(h => (
                <th key={h} style={{
                  textAlign: 'left', padding: '8px 12px',
                  fontSize: '11px', color: '#555',
                  fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Jane Employee', type: 'Sick',   from: '2025-05-01', to: '2025-05-02', days: 2, status: 'APPROVED' },
              { name: 'John Manager',  type: 'Casual', from: '2025-05-05', to: '2025-05-05', days: 1, status: 'PENDING'  },
              { name: 'Alice Smith',   type: 'Earned', from: '2025-05-10', to: '2025-05-12', days: 3, status: 'PENDING'  },
              { name: 'Bob Jones',     type: 'Sick',   from: '2025-04-28', to: '2025-04-28', days: 1, status: 'REJECTED' },
            ].map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #1a1a1a' }}>
                <td style={{ padding: '12px', fontSize: '13px', color: '#ccc' }}>{row.name}</td>
                <td style={{ padding: '12px', fontSize: '13px', color: '#888' }}>{row.type}</td>
                <td style={{ padding: '12px', fontSize: '13px', color: '#888' }}>{row.from}</td>
                <td style={{ padding: '12px', fontSize: '13px', color: '#888' }}>{row.to}</td>
                <td style={{ padding: '12px', fontSize: '13px', color: '#888' }}>{row.days}</td>
                <td style={{ padding: '12px' }}>
                  <span className={
                    row.status === 'APPROVED' ? 'badge-success' :
                    row.status === 'PENDING'  ? 'badge-warning' : 'badge-danger'
                  }>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </AppLayout>
  )
}