export default function LoadingSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '60px', gap: '16px',
    }}>
      <div style={{
        width: '36px', height: '36px',
        border: '3px solid #1f1f1f',
        borderTop: '3px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <span style={{ fontSize: '13px', color: '#555' }}>{text}</span>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}