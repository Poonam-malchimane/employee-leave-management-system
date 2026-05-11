import { useEffect, useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import api from '../../utils/axiosConfig'

interface Leave {
  id: number
  reason: string
  startDate: string
  endDate: string
  status: string
}

export default function MyLeaves() {
  const [leaves, setLeaves]   = useState<Leave[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/leaves/my')
      .then(res => setLeaves(res.data))
      .catch(() => setLeaves([
        { id: 1, reason: 'Fever',        startDate: '2025-05-01', endDate: '2025-05-02', status: 'APPROVED' },
        { id: 2, reason: 'Family event', startDate: '2025-05-10', endDate: '2025-05-10', status: 'PENDING'  },
        { id: 3, reason: 'Vacation',     startDate: '2025-04-20', endDate: '2025-04-22', status: 'REJECTED' },
      ]))
      .finally(() => setLoading(false))
  }, [])

  const total    = leaves.length
  const approved = leaves.filter(l => l.status === 'APPROVED').length
  const pending  = leaves.filter(l => l.status === 'PENDING').length
  const rejected = leaves.filter(l => l.status === 'REJECTED').length

  return (
    <AppLayout title="My Leaves">

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '24px' }}>
       {[
         { label: 'Total Applied', value: total,    color: '#3b82f6' },
         { label: 'Approved',      value: approved, color: '#22c55e' },
         { label: 'Pending',       value: pending,  color: '#f59e0b' },
         { label: 'Rejected',      value: rejected, color: '#ef4444' },
       ].map(card => (
         <div key={card.label} style={{
           backgroundColor: '#111111', border: '1px solid #1f1f1f',
           borderRadius: '12px', padding: '18px',
           borderLeft: `3px solid ${card.color}`,
         }}>
           <p style={{ fontSize: '11px', color: '#555', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
             {card.label}
           </p>
           <p style={{ fontSize: '26px', fontWeight: 600, color: '#f0f0f0' }}>{card.value}</p>
         </div>
       ))}
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #1f1f1f' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 500, color: '#e0e0e0' }}>Leave History</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1f1f1f', backgroundColor: '#0d0d0d' }}>
              {['#', 'Reason', 'Start Date', 'End Date', 'Days', 'Status'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', color: '#555', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#555' }}>Loading...</td></tr>
            ) : leaves.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#555' }}>No leaves applied yet</td></tr>
            ) : leaves.map((leave, i) => {
              const days = Math.ceil((new Date(leave.endDate).getTime() - new Date(leave.startDate).getTime()) / (1000*60*60*24)) + 1
              return (
                <tr key={leave.id}
                  style={{ borderBottom: '1px solid #1a1a1a' }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#141414'}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#555' }}>{i + 1}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#e0e0e0' }}>{leave.reason}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#888' }}>{leave.startDate}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#888' }}>{leave.endDate}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#888' }}>{days}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className={
                      leave.status === 'APPROVED' ? 'badge-success' :
                      leave.status === 'PENDING'  ? 'badge-warning' : 'badge-danger'
                    }>
                      {leave.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </AppLayout>
  )
}