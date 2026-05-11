import { useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react'

const employees = [
  { id:1, name:'Admin User',    role:'ADMIN',    avatar:'A' },
  { id:2, name:'John Manager',  role:'MANAGER',  avatar:'J' },
  { id:3, name:'Jane Employee', role:'EMPLOYEE', avatar:'J' },
  { id:4, name:'Alice Smith',   role:'EMPLOYEE', avatar:'A' },
  { id:5, name:'Bob Jones',     role:'EMPLOYEE', avatar:'B' },
]

type Status = 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE'

export default function AttendanceTracker() {
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  const [attendance, setAttendance] = useState<Record<number, Status>>({
    1: 'PRESENT', 2: 'PRESENT', 3: 'LATE', 4: 'ABSENT', 5: 'LEAVE'
  })
  const [saved, setSaved] = useState(false)

  const setStatus = (id: number, status: Status) => {
    setAttendance(prev => ({ ...prev, [id]: status }))
    setSaved(false)
  }

  const counts = {
    PRESENT: Object.values(attendance).filter(s => s === 'PRESENT').length,
    ABSENT:  Object.values(attendance).filter(s => s === 'ABSENT').length,
    LATE:    Object.values(attendance).filter(s => s === 'LATE').length,
    LEAVE:   Object.values(attendance).filter(s => s === 'LEAVE').length,
  }

  const rate = Math.round((counts.PRESENT / employees.length) * 100)

  const statusConfig: Record<Status, { label: string; color: string; bg: string; border: string }> = {
    PRESENT: { label:'Present', color:'#15803d', bg:'#dcfce7', border:'#bbf7d0' },
    ABSENT:  { label:'Absent',  color:'#b91c1c', bg:'#fee2e2', border:'#fecaca' },
    LATE:    { label:'Late',    color:'#a16207', bg:'#fef9c3', border:'#fde68a' },
    LEAVE:   { label:'Leave',   color:'#1d4ed8', bg:'#dbeafe', border:'#bfdbfe' },
  }

  return (
    <AppLayout title="Attendance Tracker">

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '14px', marginBottom: '24px' }}>
        {[
          { label:'Attendance Rate', value:`${rate}%`,        icon: TrendingUp, color:'#6366f1', bg:'rgba(99,102,241,0.08)'  },
          { label:'Present',         value: counts.PRESENT,   icon: CheckCircle, color:'#22c55e', bg:'rgba(34,197,94,0.08)'  },
          { label:'Absent',          value: counts.ABSENT,    icon: XCircle,    color:'#ef4444', bg:'rgba(239,68,68,0.08)'  },
          { label:'Late',            value: counts.LATE,      icon: Clock,      color:'#f59e0b', bg:'rgba(245,158,11,0.08)' },
          { label:'On Leave',        value: counts.LEAVE,     icon: Clock,      color:'#3b82f6', bg:'rgba(59,130,246,0.08)' },
        ].map(stat => {
          const Icon = stat.icon
          return (
            <div key={stat.label} style={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px', padding: '16px',
              boxShadow: 'var(--card-shadow)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.label}</p>
                  <p style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text-primary)' }}>{stat.value}</p>
                </div>
                <div style={{ width: '36px', height: '36px', borderRadius: '9px', backgroundColor: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={17} color={stat.color} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Date picker + save */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>Date:</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            className="input" style={{ width: '160px', colorScheme: 'light' }} />
        </div>
        <button
          className="btn-primary"
          onClick={() => setSaved(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          {saved ? '✓ Saved!' : 'Save Attendance'}
        </button>
      </div>

      {/* Attendance table */}
      <div style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '14px', overflow: 'hidden', boxShadow: 'var(--card-shadow)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
              {['Employee', 'Role', 'Status', 'Mark Attendance'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => {
              const status = attendance[emp.id] || 'PRESENT'
              const cfg    = statusConfig[status]
              return (
                <tr key={emp.id}
                  style={{ borderBottom: '1px solid var(--border-color)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'var(--bg-secondary)'}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '34px', height: '34px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #818cf8, #6366f1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '13px', fontWeight: 600, color: 'white',
                      }}>
                        {emp.avatar}
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{emp.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className={emp.role === 'ADMIN' ? 'badge-danger' : emp.role === 'MANAGER' ? 'badge-warning' : 'badge-info'}>
                      {emp.role}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      fontSize: '11px', fontWeight: 500, padding: '3px 9px',
                      borderRadius: '9999px', display: 'inline-block',
                      backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
                    }}>
                      {cfg.label}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {(['PRESENT','ABSENT','LATE','LEAVE'] as Status[]).map(s => (
                        <button key={s} onClick={() => setStatus(emp.id, s)}
                          style={{
                            padding: '4px 10px', borderRadius: '6px', border: 'none',
                            cursor: 'pointer', fontSize: '11px', fontWeight: 500,
                            backgroundColor: status === s ? statusConfig[s].bg : 'var(--bg-secondary)',
                            color: status === s ? statusConfig[s].color : 'var(--text-muted)',
                            border: status === s ? `1px solid ${statusConfig[s].border}` : '1px solid var(--border-color)',
                            transition: 'all 0.1s',
                          }}>
                          {s.charAt(0) + s.slice(1).toLowerCase()}
                        </button>
                      ))}
                    </div>
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