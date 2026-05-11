import { Bell, Sun, Moon, Search } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useThemeStore } from '../../store/themeStore'
import { useState } from 'react'

interface NavbarProps { title: string }

const notifications = [
  { id: 1, text: "Jane applied for sick leave",   time: "2m ago", unread: true  },
  { id: 2, text: "John leave was approved",        time: "1h ago", unread: true  },
  { id: 3, text: "New employee Alice was added",   time: "3h ago", unread: false },
]

export default function Navbar({ title }: NavbarProps) {
  const { user }                  = useAuthStore()
  const { isDark, toggleTheme }   = useThemeStore()
  const [showNotif, setShowNotif] = useState(false)
  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <div style={{
      height: '60px',
      backgroundColor: 'var(--bg-primary)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky', top: 0, zIndex: 50,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>

      {/* Left */}
      <div>
        <h1 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h1>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '9px', padding: '6px 12px',
        }}>
          <Search size={14} color="var(--text-muted)" />
          <input placeholder="Search..." style={{
            background: 'none', border: 'none', outline: 'none',
            color: 'var(--text-primary)', fontSize: '13px', width: '140px',
            fontFamily: 'inherit',
          }} />
        </div>

        {/* Dark mode toggle */}
        <button onClick={toggleTheme} style={{
          width: '36px', height: '36px', borderRadius: '9px',
          border: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-secondary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'var(--text-secondary)',
          transition: 'all 0.15s',
        }}>
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowNotif(!showNotif)} style={{
            width: '36px', height: '36px', borderRadius: '9px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-secondary)',
            position: 'relative',
          }}>
            <Bell size={16} />
            {unreadCount > 0 && (
              <div style={{
                position: 'absolute', top: '6px', right: '6px',
                width: '8px', height: '8px',
                backgroundColor: '#6366f1', borderRadius: '50%',
                border: '1.5px solid var(--bg-primary)',
              }} />
            )}
          </button>

          {/* Dropdown */}
          {showNotif && (
            <div style={{
              position: 'absolute', right: 0, top: '44px',
              width: '300px', backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              zIndex: 1000, overflow: 'hidden',
              animation: 'slideUp 0.15s ease',
            }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>Notifications</span>
                <span style={{ fontSize: '11px', color: '#6366f1', cursor: 'pointer' }}>Mark all read</span>
              </div>
              {notifications.map(n => (
                <div key={n.id} style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: n.unread ? 'rgba(99,102,241,0.04)' : 'transparent',
                  display: 'flex', gap: '10px', alignItems: 'flex-start',
                }}>
                  {n.unread && (
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#6366f1', marginTop: '5px', flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-primary)', marginBottom: '2px' }}>{n.text}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div style={{
          width: '34px', height: '34px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #818cf8, #6366f1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', fontWeight: 600, color: 'white',
          cursor: 'pointer', boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
        }}>
          {user?.name?.charAt(0).toUpperCase() || 'A'}
        </div>
      </div>
    </div>
  )
}