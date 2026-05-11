import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px',
      zIndex: 9999, animation: 'slideUp 0.2s ease',
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '12px 16px', borderRadius: '10px',
      backgroundColor: type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
      border: `1px solid ${type === 'success' ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      minWidth: '280px', maxWidth: '380px',
    }}>
      {type === 'success'
        ? <CheckCircle size={18} color="#4ade80" />
        : <XCircle    size={18} color="#f87171" />
      }
      <span style={{
        fontSize: '13px', flex: 1,
        color: type === 'success' ? '#4ade80' : '#f87171',
      }}>
        {message}
      </span>
      <button onClick={onClose} style={{
        background: 'none', border: 'none',
        cursor: 'pointer', color: '#555', padding: 0,
      }}>
        <X size={14} />
      </button>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(16px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  )
}