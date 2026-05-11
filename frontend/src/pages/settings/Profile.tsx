import { useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { useAuthStore } from '../../store/authStore'
import { User, Mail, Shield, Save } from 'lucide-react'

export default function Profile() {
  const { user } = useAuthStore()
  const [success, setSuccess] = useState('')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess('Profile updated successfully!')
    setTimeout(() => setSuccess(''), 3000)
  }

  return (
    <AppLayout title="My Profile">
      <div style={{ maxWidth: '600px' }}>

        {success && (
          <div style={{ marginBottom: '16px', padding: '12px 16px', backgroundColor: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '8px', color: '#4ade80', fontSize: '13px' }}>
            ✅ {success}
          </div>
        )}

        {/* Avatar card */}
        <div style={{
          backgroundColor: '#111111', border: '1px solid #1f1f1f',
          borderRadius: '14px', padding: '28px',
          display: 'flex', alignItems: 'center', gap: '20px',
          marginBottom: '16px',
        }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', fontWeight: 700, color: 'white', flexShrink: 0,
          }}>
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#f0f0f0', marginBottom: '4px' }}>
              {user?.name || 'Admin User'}
            </h2>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>{user?.email}</p>
            <span className="badge-info">{user?.role || 'ADMIN'}</span>
          </div>
        </div>

        {/* Edit form */}
        <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f', borderRadius: '14px', padding: '28px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 500, color: '#e0e0e0', marginBottom: '20px' }}>
            Account Information
          </h3>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#888', marginBottom: '8px' }}>
                <User size={13} /> Full Name
              </label>
              <input className="input" defaultValue={user?.name || ''} placeholder="Your name" />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#888', marginBottom: '8px' }}>
                <Mail size={13} /> Email Address
              </label>
              <input className="input" defaultValue={user?.email || ''} placeholder="your@email.com" disabled
                style={{ opacity: 0.5, cursor: 'not-allowed' }} />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#888', marginBottom: '8px' }}>
                <Shield size={13} /> Role
              </label>
              <input className="input" defaultValue={user?.role || ''} disabled
                style={{ opacity: 0.5, cursor: 'not-allowed' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '8px' }}>
                New Password (leave blank to keep current)
              </label>
              <input className="input" type="password" placeholder="••••••••" />
            </div>
            <button type="submit" className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '11px' }}>
              <Save size={15} /> Save Changes
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  )
}