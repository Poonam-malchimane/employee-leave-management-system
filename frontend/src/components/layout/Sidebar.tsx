import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, CalendarDays, ClipboardList,
  BarChart3, Settings, Building2, LogOut, ChevronRight,
  Send, BookOpen, Clock
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const navItems = [
  { label: 'Dashboard',    icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'Employees',    icon: Users,            path: '/admin/employees' },
  { label: 'Leaves',       icon: CalendarDays,     path: '/admin/leaves'    },
  { label: 'Approvals',    icon: ClipboardList,    path: '/admin/approvals' },
  { label: 'Calendar',     icon: Clock,            path: '/admin/calendar'  },
  { label: 'Attendance',   icon: BarChart3,        path: '/admin/attendance'},
  { label: 'Reports',      icon: BarChart3,        path: '/admin/reports'   },
  { label: 'Settings',     icon: Settings,         path: '/admin/settings'  },
]

export default function Sidebar() {
  const navigate         = useNavigate()
  const location         = useLocation()
  const { user, logout } = useAuthStore()

  return (
    <div style={{
      width: '240px', minHeight: '100vh',
      background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', left: 0, top: 0, zIndex: 100,
      boxShadow: '4px 0 24px rgba(0,0,0,0.12)',
    }}>

      {/* Logo */}
      <div style={{
        padding: '22px 20px 18px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <div style={{
          width: '36px', height: '36px',
          background: 'linear-gradient(135deg, #818cf8, #6366f1)',
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(99,102,241,0.4)', flexShrink: 0,
        }}>
          <Building2 size={18} color="white" />
        </div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'white', letterSpacing: '-0.3px' }}>HRMS</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Admin Portal</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '14px 10px', overflowY: 'auto' }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <button key={item.path} onClick={() => navigate(item.path)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 12px', marginBottom: '2px', borderRadius: '9px',
                border: isActive ? '1px solid rgba(129,140,248,0.3)' : '1px solid transparent',
                cursor: 'pointer', textAlign: 'left',
                backgroundColor: isActive ? 'rgba(99,102,241,0.25)' : 'transparent',
                color: isActive ? '#c7d2fe' : 'rgba(255,255,255,0.45)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.06)'
                  ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.8)'
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
                  ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.45)'
                }
              }}
            >
              <Icon size={16} />
              <span style={{ fontSize: '13px', fontWeight: isActive ? 500 : 400, flex: 1 }}>
                {item.label}
              </span>
              {isActive && <ChevronRight size={13} style={{ opacity: 0.6 }} />}
            </button>
          )
        })}
      </nav>

      {/* User + logout */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 12px', marginBottom: '4px',
          backgroundColor: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '9px',
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #818cf8, #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: 600, color: 'white', flexShrink: 0,
          }}>
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.9)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'Admin'}
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>{user?.role}</div>
          </div>
        </div>
        <button onClick={() => { useAuthStore.getState().logout(); useNavigate()('/login') }}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '9px 12px', borderRadius: '9px', border: 'none',
            cursor: 'pointer', backgroundColor: 'transparent',
            color: 'rgba(255,255,255,0.35)', transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(239,68,68,0.12)'
            ;(e.currentTarget as HTMLButtonElement).style.color = '#fca5a5'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
            ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.35)'
          }}
        >
          <LogOut size={15} />
          <span style={{ fontSize: '13px' }}>Sign out</span>
        </button>
      </div>
    </div>
  )
}