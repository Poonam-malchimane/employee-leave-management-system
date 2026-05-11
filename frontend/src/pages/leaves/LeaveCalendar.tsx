import { useEffect, useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import api from '../../utils/axiosConfig'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Leave {
  id: number
  reason: string
  startDate: string
  endDate: string
  status: string
}

export default function LeaveCalendar() {
  const [leaves, setLeaves]   = useState<Leave[]>([])
  const [current, setCurrent] = useState(new Date())

  useEffect(() => {
    api.get('/api/leaves/all')
      .then(res => setLeaves(res.data))
      .catch(() => setLeaves([
        { id:1, reason:'Fever',      startDate:'2026-05-05', endDate:'2026-05-06', status:'APPROVED' },
        { id:2, reason:'Vacation',   startDate:'2026-05-12', endDate:'2026-05-14', status:'PENDING'  },
        { id:3, reason:'Family',     startDate:'2026-05-20', endDate:'2026-05-20', status:'APPROVED' },
        { id:4, reason:'Medical',    startDate:'2026-05-25', endDate:'2026-05-26', status:'REJECTED' },
      ]))
  }, [])

  const year  = current.getFullYear()
  const month = current.getMonth()

  const monthName = current.toLocaleString('default', { month: 'long' })
  const firstDay  = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => setCurrent(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrent(new Date(year, month + 1, 1))

  const getLeavesForDay = (day: number) => {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    return leaves.filter(l => {
      const start = new Date(l.startDate)
      const end   = new Date(l.endDate)
      const date  = new Date(dateStr)
      return date >= start && date <= end
    })
  }

  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

  return (
    <AppLayout title="Leave Calendar">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>

        {/* Calendar */}
        <div className="card">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {monthName} {year}
            </h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={prevMonth} style={{
                width: '32px', height: '32px', borderRadius: '8px',
                border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-secondary)',
              }}>
                <ChevronLeft size={16} />
              </button>
              <button onClick={nextMonth} style={{
                width: '32px', height: '32px', borderRadius: '8px',
                border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-secondary)',
              }}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '4px', marginBottom: '8px' }}>
            {days.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', padding: '4px' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '4px' }}>
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dayLeaves = getLeavesForDay(day)
              const isToday = new Date().getDate() === day &&
                              new Date().getMonth() === month &&
                              new Date().getFullYear() === year
              return (
                <div key={day} style={{
                  minHeight: '64px', padding: '6px',
                  borderRadius: '8px',
                  backgroundColor: isToday ? 'rgba(99,102,241,0.08)' : 'var(--bg-secondary)',
                  border: isToday ? '1.5px solid #6366f1' : '1px solid var(--border-color)',
                  transition: 'all 0.1s',
                  cursor: dayLeaves.length > 0 ? 'pointer' : 'default',
                }}>
                  <div style={{
                    fontSize: '12px', fontWeight: isToday ? 600 : 400,
                    color: isToday ? '#6366f1' : 'var(--text-primary)',
                    marginBottom: '3px',
                  }}>
                    {day}
                  </div>
                  {dayLeaves.slice(0, 2).map(l => (
                    <div key={l.id} style={{
                      fontSize: '9px', fontWeight: 500, padding: '1px 5px',
                      borderRadius: '4px', marginBottom: '2px',
                      backgroundColor:
                        l.status === 'APPROVED' ? '#dcfce7' :
                        l.status === 'PENDING'  ? '#fef9c3' : '#fee2e2',
                      color:
                        l.status === 'APPROVED' ? '#15803d' :
                        l.status === 'PENDING'  ? '#a16207' : '#b91c1c',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {l.reason}
                    </div>
                  ))}
                  {dayLeaves.length > 2 && (
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                      +{dayLeaves.length - 2} more
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Sidebar — this month leaves */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Legend */}
          <div className="card">
            <h3 style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '12px' }}>Legend</h3>
            {[
              { label: 'Approved', color: '#dcfce7', text: '#15803d' },
              { label: 'Pending',  color: '#fef9c3', text: '#a16207' },
              { label: 'Rejected', color: '#fee2e2', text: '#b91c1c' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: l.color, flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{l.label}</span>
              </div>
            ))}
          </div>

          {/* This month leaves */}
          <div className="card" style={{ flex: 1 }}>
            <h3 style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '12px' }}>
              {monthName} Leaves
            </h3>
            {leaves.filter(l => {
              const d = new Date(l.startDate)
              return d.getMonth() === month && d.getFullYear() === year
            }).length === 0 ? (
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>
                No leaves this month
              </p>
            ) : leaves.filter(l => {
              const d = new Date(l.startDate)
              return d.getMonth() === month && d.getFullYear() === year
            }).map(leave => (
              <div key={leave.id} style={{
                padding: '10px', marginBottom: '8px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '8px',
                borderLeft: `3px solid ${leave.status === 'APPROVED' ? '#22c55e' : leave.status === 'PENDING' ? '#f59e0b' : '#ef4444'}`,
              }}>
                <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '3px' }}>{leave.reason}</p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{leave.startDate} → {leave.endDate}</p>
                <span className={
                  leave.status === 'APPROVED' ? 'badge-success' :
                  leave.status === 'PENDING'  ? 'badge-warning' : 'badge-danger'
                } style={{ marginTop: '5px' }}>{leave.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}