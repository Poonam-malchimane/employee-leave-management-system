import { useEffect, useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { CheckCircle, XCircle, Clock, Filter } from 'lucide-react'
import api from '../../utils/axiosConfig'

interface Leave {
  id: number
  reason: string
  startDate: string
  endDate: string
  status: string
  userId?: number
}

export default function LeaveList() {
  const [leaves, setLeaves]     = useState<Leave[]>([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('ALL')
  const [success, setSuccess]   = useState('')
  const [error, setError]       = useState('')

  const fetchLeaves = () => {
    api.get('/api/leaves/all')
      .then(res => setLeaves(res.data))
      .catch(() => setLeaves([
        { id: 1, reason: 'Fever',        startDate: '2025-05-01', endDate: '2025-05-02', status: 'PENDING'  },
        { id: 2, reason: 'Family event', startDate: '2025-05-05', endDate: '2025-05-05', status: 'APPROVED' },
        { id: 3, reason: 'Vacation',     startDate: '2025-05-10', endDate: '2025-05-12', status: 'PENDING'  },
        { id: 4, reason: 'Medical',      startDate: '2025-04-28', endDate: '2025-04-28', status: 'REJECTED' },
      ]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchLeaves() }, [])

  const handleApprove = async (id: number) => {
    try {
      await api.put(`/api/leaves/approve/${id}`)
      setSuccess('Leave approved!')
      fetchLeaves()
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Failed to approve leave.')
    }
  }

  const handleReject = async (id: number) => {
    try {
      await api.put(`/api/leaves/reject/${id}`)
      setSuccess('Leave rejected.')
      fetchLeaves()
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Failed to reject leave.')
    }
  }

  const filtered = filter === 'ALL'
    ? leaves
    : leaves.filter(l => l.status === filter)

  const counts = {
    ALL:      leaves.length,
    PENDING:  leaves.filter(l => l.status === 'PENDING').length,
    APPROVED: leaves.filter(l => l.status === 'APPROVED').length,
    REJECTED: leaves.filter(l => l.status === 'REJECTED').length,
  }

  return (
    <AppLayout title="Leave Requests">

      {success && (
        <div style={{ marginBottom: '16px', padding: '10px 16px', backgroundColor: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '8px', color: '#4ade80', fontSize: '13px' }}>
          {success}
        </div>
      )}
      {error && (
        <div style={{ marginBottom: '16px', padding: '10px 16px', backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#f87171', fontSize: '13px' }}>
          {error}
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map(tab => (
          <button key={tab} onClick={() => setFilter(tab)}
            style={{
              padding: '7px 16px', borderRadius: '8px', border: 'none',
              cursor: 'pointer', fontSize: '12px', fontWeight: 500,
              backgroundColor: filter === tab ? '#2563eb' : '#1a1a1a',
              color: filter === tab ? 'white' : '#888',
              transition: 'all 0.15s',
            }}>
            {tab} ({counts[tab]})
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1f1f1f', backgroundColor: '#0d0d0d' }}>
              {['#', 'Reason', 'From', 'To', 'Status', 'Actions'].map(h => (
                <th key={h} style={{
                  textAlign: 'left', padding: '12px 16px',
                  fontSize: '11px', color: '#555',
                  fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#555' }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#555' }}>No leave requests found</td></tr>
            ) : filtered.map((leave, i) => (
              <tr key={leave.id}
                style={{ borderBottom: '1px solid #1a1a1a' }}
                onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#141414'}
                onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent'}
              >
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#555' }}>{i + 1}</td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#e0e0e0', maxWidth: '200px' }}>{leave.reason}</td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#888' }}>{leave.startDate}</td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#888' }}>{leave.endDate}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span className={
                    leave.status === 'APPROVED' ? 'badge-success' :
                    leave.status === 'PENDING'  ? 'badge-warning' : 'badge-danger'
                  }>
                    {leave.status}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  {leave.status === 'PENDING' ? (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => handleApprove(leave.id)}
                        style={{
                          padding: '5px 10px', borderRadius: '6px', border: 'none',
                          backgroundColor: 'rgba(34,197,94,0.08)', color: '#4ade80',
                          cursor: 'pointer', fontSize: '12px',
                          display: 'flex', alignItems: 'center', gap: '4px',
                        }}>
                        <CheckCircle size={13} /> Approve
                      </button>
                      <button onClick={() => handleReject(leave.id)}
                        style={{
                          padding: '5px 10px', borderRadius: '6px', border: 'none',
                          backgroundColor: 'rgba(239,68,68,0.08)', color: '#f87171',
                          cursor: 'pointer', fontSize: '12px',
                          display: 'flex', alignItems: 'center', gap: '4px',
                        }}>
                        <XCircle size={13} /> Reject
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '12px', color: '#444' }}>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </AppLayout>
  )
}