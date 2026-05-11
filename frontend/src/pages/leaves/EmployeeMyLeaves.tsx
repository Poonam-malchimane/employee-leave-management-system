import { useEffect, useState } from 'react'
import EmployeeLayout from '../../components/layout/EmployeeLayout'
import api from '../../utils/axiosConfig'

interface Leave {
  id: number
  reason: string
  startDate: string
  endDate: string
  status: string
}

export default function EmployeeMyLeaves() {
  const [leaves, setLeaves]   = useState<Leave[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('ALL')

  useEffect(() => {
    api.get('/api/leaves/my')
      .then(res => setLeaves(res.data))
      .catch(() => setLeaves([]))
      .finally(() => setLoading(false))
  }, [])

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
    <EmployeeLayout title="My Leaves">

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {(['ALL','PENDING','APPROVED','REJECTED'] as const).map(tab => (
          <button key={tab} onClick={() => setFilter(tab)}
            style={{
              padding: '7px 16px', borderRadius: '8px', border: 'none',
              cursor: 'pointer', fontSize: '12px', fontWeight: 500,
              backgroundColor: filter === tab ? '#7c3aed' : '#1a1a1a',
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
              {['#','Reason','From','To','Days','Status'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', color: '#555', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#555' }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#555' }}>No leaves found</td></tr>
            ) : filtered.map((leave, i) => {
              const days = Math.ceil((new Date(leave.endDate).getTime() - new Date(leave.startDate).getTime()) / (1000*60*60*24)) + 1
              return (
                <tr key={leave.id} style={{ borderBottom: '1px solid #1a1a1a' }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#141414'}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#555' }}>{i+1}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#e0e0e0' }}>{leave.reason}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#888' }}>{leave.startDate}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#888' }}>{leave.endDate}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#888' }}>{days}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className={
                      leave.status === 'APPROVED' ? 'badge-success' :
                      leave.status === 'PENDING'  ? 'badge-warning' : 'badge-danger'
                    }>{leave.status}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </EmployeeLayout>
  )
}