import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, CalendarDays,
  ClipboardList, User, Building2,
  LogOut, ChevronRight, Send
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const navItems = [
  { label: 'Dashboard',   icon: LayoutDashboard, path: '/employee/dashboard' },
  { label: 'Apply Leave', icon: Send,             path: '/employee/apply'     },
  { label: 'My Leaves',   icon: ClipboardList,    path: '/employee/my-leaves' },
  { label: 'Calendar',    icon: CalendarDays,     path: '/employee/calendar'  },
  { label: 'Profile',     icon: User,             path: '/employee/profile'   },
]

export default function EmployeeSidebar() {
  const navigate         = useNavigate()
  const location         = useLocation()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{
      width: '240px', minHeight: '100vh',
      backgroundColor: '#111111',
      borderRight: '1px solid #1f1f1f',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', left: 0, top: 0, zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{
        padding: '20px 20px 16px',
        borderBottom: '1px solid #1f1f1f',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <div style={{
          width: '34px', height: '34px',
          background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
          borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 12px rgba(124,58,237,0.3)', flexShrink: 0,
        }}>
          <Building2 size={18} color="white" />
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#f0f0f0' }}>HRMS</div>
          <div style={{ fontSize: '11px', color: '#555' }}>Employee Portal</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px' }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <button key={item.path} onClick={() => navigate(item.path)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 12px', marginBottom: '2px', borderRadius: '8px',
                border: 'none', cursor: 'pointer', textAlign: 'left',
                backgroundColor: isActive ? 'rgba(124,58,237,0.12)' : 'transparent',
                color: isActive ? '#a78bfa' : '#888',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1a1a1a'
                  ;(e.currentTarget as HTMLButtonElement).style.color = '#ccc'
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
                  ;(e.currentTarget as HTMLButtonElement).style.color = '#888'
                }
              }}
            >
              <Icon size={17} />
              <span style={{ fontSize: '13px', fontWeight: isActive ? 500 : 400, flex: 1 }}>
                {item.label}
              </span>
              {isActive && <ChevronRight size={14} />}
            </button>
          )
        })}
      </nav>

      {/* User + logout */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid #1f1f1f' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 12px', marginBottom: '4px',
          backgroundColor: '#1a1a1a', borderRadius: '8px',
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: 600, color: 'white', flexShrink: 0,
          }}>
            {user?.name?.charAt(0).toUpperCase() || 'E'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '12px', fontWeight: 500, color: '#e0e0e0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'Employee'}
            </div>
            <div style={{ fontSize: '11px', color: '#555' }}>{user?.role}</div>
          </div>
        </div>
        <button onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '9px 12px', borderRadius: '8px', border: 'none',
            cursor: 'pointer', backgroundColor: 'transparent', color: '#666',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(239,68,68,0.08)'
            ;(e.currentTarget as HTMLButtonElement).style.color = '#f87171'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
            ;(e.currentTarget as HTMLButtonElement).style.color = '#666'
          }}
        >
          <LogOut size={16} />
          <span style={{ fontSize: '13px' }}>Sign out</span>
        </button>
      </div>
    </div>
  )
}