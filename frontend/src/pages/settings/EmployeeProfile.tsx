import EmployeeLayout from '../../components/layout/EmployeeLayout'
import { useAuthStore } from '../../store/authStore'
import { Mail, Shield, User } from 'lucide-react'

export default function EmployeeProfile() {
  const { user } = useAuthStore()

  return (
    <EmployeeLayout title="My Profile">
      <div style={{ maxWidth: '560px' }}>

        {/* Avatar */}
        <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f', borderRadius: '14px', padding: '28px', display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 700, color: 'white', flexShrink: 0 }}>
            {user?.name?.charAt(0).toUpperCase() || 'E'}
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#f0f0f0', marginBottom: '4px' }}>{user?.name}</h2>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>{user?.email}</p>
            <span className="badge-info">{user?.role}</span>
          </div>
        </div>

        {/* Info */}
        <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f', borderRadius: '14px', padding: '28px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 500, color: '#e0e0e0', marginBottom: '20px' }}>Account Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: User,   label: 'Full Name', value: user?.name  },
              { icon: Mail,   label: 'Email',     value: user?.email },
              { icon: Shield, label: 'Role',      value: user?.role  },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', backgroundColor: '#1a1a1a', borderRadius: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <item.icon size={16} color="#a78bfa" />
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#555', marginBottom: '2px' }}>{item.label}</p>
                  <p style={{ fontSize: '13px', color: '#e0e0e0', fontWeight: 500 }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </EmployeeLayout>
  )
}