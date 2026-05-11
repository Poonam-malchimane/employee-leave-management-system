import { useEffect, useState } from 'react'
import EmployeeLayout from '../../components/layout/EmployeeLayout'
import { CalendarDays, CheckCircle, XCircle, Clock, Send } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/axiosConfig'

interface Leave {
  id: number
  reason: string
  startDate: string
  endDate: string
  status: string
}

export default function EmployeeDashboard() {
  const { user }        = useAuthStore()
  const navigate        = useNavigate()
  const [leaves, setLeaves]   = useState<Leave[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/leaves/my')
      .then(res => setLeaves(res.data))
      .catch(() => setLeaves([]))
      .finally(() => setLoading(false))
  }, [])

  const total    = leaves.length
  const approved = leaves.filter(l => l.status === 'APPROVED').length
  const pending  = leaves.filter(l => l.status === 'PENDING').length
  const rejected = leaves.filter(l => l.status === 'REJECTED').length

  const stats = [
    { label: 'Total Applied', value: total,    color: '#3b82f6', icon: CalendarDays },
    { label: 'Approved',      value: approved,  color: '#22c55e', icon: CheckCircle  },
    { label: 'Pending',       value: pending,   color: '#f59e0b', icon: Clock        },
    { label: 'Rejected',      value: rejected,  color: '#ef4444', icon: XCircle      },
  ]

  const recent = leaves.slice(0, 5)

  return (
    <EmployeeLayout title="My Dashboard">

      {/* Welcome */}
      <div style={{
        background: 'linear-gradient(135deg, #3b0764 0%, #7c3aed 50%, #a855f7 100%)',
        borderRadius: '14px', padding: '24px 28px',
        marginBottom: '24px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: '-20px', top: '-20px',
          width: '160px', height: '160px',
          background: 'rgba(255,255,255,0.05)', borderRadius: '50%',
        }} />
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'white', marginBottom: '4px' }}>
          Welcome, {user?.name?.split(' ')[0] || 'Employee'}! 👋
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '16px' }}>
          Manage your leaves and track your requests here.
        </p>
        <button
          onClick={() => navigate('/employee/apply')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px', borderRadius: '8px',
            backgroundColor: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white', fontSize: '13px', cursor: 'pointer',
          }}
        >
          <Send size={14} /> Apply for Leave
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
        {stats.map(stat => {
          const Icon = stat.icon
          return (
            <div key={stat.label} style={{
              backgroundColor: '#111111', border: '1px solid #1f1f1f',
              borderRadius: '12px', padding: '20px',
              borderLeft: `3px solid ${stat.color}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#555', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {stat.label}
                  </p>
                  <p style={{ fontSize: '28px', fontWeight: 600, color: '#f0f0f0' }}>
                    {loading ? '...' : stat.value}
                  </p>
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

      {/* Recent leaves */}
      <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #1f1f1f', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 500, color: '#e0e0e0' }}>Recent Requests</h3>
          <button onClick={() => navigate('/employee/my-leaves')}
            style={{ fontSize: '12px', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}>
            View all →
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1f1f1f', backgroundColor: '#0d0d0d' }}>
              {['Reason', 'From', 'To', 'Status'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', color: '#555', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#555' }}>Loading...</td></tr>
            ) : recent.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#555' }}>No leaves applied yet — <button onClick={() => navigate('/employee/apply')} style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}>Apply now</button></td></tr>
            ) : recent.map(leave => (
              <tr key={leave.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#e0e0e0' }}>{leave.reason}</td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#888' }}>{leave.startDate}</td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#888' }}>{leave.endDate}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span className={
                    leave.status === 'APPROVED' ? 'badge-success' :
                    leave.status === 'PENDING'  ? 'badge-warning' : 'badge-danger'
                  }>{leave.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </EmployeeLayout>
  )
}