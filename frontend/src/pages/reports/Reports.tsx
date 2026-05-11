import { useEffect, useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import api from '../../utils/axiosConfig'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend
} from 'recharts'
import { Download, TrendingUp, Users, CalendarDays, CheckCircle } from 'lucide-react'

interface DashboardData {
  total: number
  pending: number
  approved: number
  rejected: number
}

const monthlyData = [
  { month: 'Jan', approved: 10, rejected: 2, pending: 3 },
  { month: 'Feb', approved: 8,  rejected: 1, pending: 5 },
  { month: 'Mar', approved: 15, rejected: 3, pending: 2 },
  { month: 'Apr', approved: 12, rejected: 4, pending: 6 },
  { month: 'May', approved: 18, rejected: 2, pending: 4 },
  { month: 'Jun', approved: 9,  rejected: 1, pending: 3 },
]

const deptData = [
  { dept: 'Engineering', leaves: 24 },
  { dept: 'Marketing',   leaves: 18 },
  { dept: 'HR',          leaves: 12 },
  { dept: 'Finance',     leaves: 9  },
  { dept: 'Design',      leaves: 15 },
]

export default function Reports() {
  const [data, setData] = useState<DashboardData>({
    total: 42, pending: 8, approved: 28, rejected: 6
  })

  useEffect(() => {
    api.get('/api/leaves/dashboard/admin')
      .then(res => setData(res.data))
      .catch(() => {})
  }, [])

  const stats = [
    { label: 'Total Requests', value: data.total,    icon: CalendarDays, color: '#3b82f6' },
    { label: 'Approved',       value: data.approved, icon: CheckCircle,  color: '#22c55e' },
    { label: 'Approval Rate',  value: `${Math.round((data.approved / (data.total || 1)) * 100)}%`, icon: TrendingUp, color: '#a855f7' },
    { label: 'Pending Review', value: data.pending,  icon: Users,        color: '#f59e0b' },
  ]

  return (
    <AppLayout title="Reports & Analytics">

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
        {stats.map(stat => {
          const Icon = stat.icon
          return (
            <div key={stat.label} style={{
              backgroundColor: '#111111', border: '1px solid #1f1f1f',
              borderRadius: '12px', padding: '20px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#555', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {stat.label}
                  </p>
                  <p style={{ fontSize: '26px', fontWeight: 600, color: '#f0f0f0' }}>{stat.value}</p>
                </div>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '10px',
                  backgroundColor: `${stat.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={18} color={stat.color} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Line chart */}
      <div style={{
        backgroundColor: '#111111', border: '1px solid #1f1f1f',
        borderRadius: '12px', padding: '24px', marginBottom: '16px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 500, color: '#e0e0e0' }}>Leave Trends — 6 Months</h3>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', borderRadius: '7px', border: '1px solid #2a2a2a',
            backgroundColor: '#1a1a1a', color: '#888', cursor: 'pointer', fontSize: '12px',
          }}>
            <Download size={13} /> Export
          </button>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
            <XAxis dataKey="month" tick={{ fill: '#555', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#555', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', color: '#e0e0e0' }} />
            <Legend formatter={v => <span style={{ color: '#888', fontSize: '12px' }}>{v}</span>} />
            <Line type="monotone" dataKey="approved" stroke="#22c55e" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="pending"  stroke="#f59e0b" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar chart — by department */}
      <div style={{
        backgroundColor: '#111111', border: '1px solid #1f1f1f',
        borderRadius: '12px', padding: '24px',
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: 500, color: '#e0e0e0', marginBottom: '20px' }}>
          Leaves by Department
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={deptData} barSize={36}>
            <XAxis dataKey="dept" tick={{ fill: '#555', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#555', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', color: '#e0e0e0' }} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            <Bar dataKey="leaves" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </AppLayout>
  )
}