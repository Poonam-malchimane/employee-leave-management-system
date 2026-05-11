import { useNavigate } from 'react-router-dom'
import { Home, AlertTriangle } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#0a0a0a',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexDirection: 'column',
      gap: '16px', padding: '24px', textAlign: 'center',
    }}>
      <div style={{
        width: '64px', height: '64px', borderRadius: '16px',
        backgroundColor: 'rgba(245,158,11,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '8px',
      }}>
        <AlertTriangle size={32} color="#f59e0b" />
      </div>
      <h1 style={{ fontSize: '72px', fontWeight: 700, color: '#1f1f1f', lineHeight: 1 }}>
        404
      </h1>
      <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#f0f0f0' }}>
        Page not found
      </h2>
      <p style={{ fontSize: '14px', color: '#555', maxWidth: '320px' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => navigate('/admin/dashboard')}
        className="btn-primary"
        style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}
      >
        <Home size={15} /> Go to Dashboard
      </button>
    </div>
  )
}