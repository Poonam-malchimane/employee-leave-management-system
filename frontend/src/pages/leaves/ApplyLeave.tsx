import { useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { CalendarDays, Send } from 'lucide-react'
import api from '../../utils/axiosConfig'

export default function ApplyLeave() {
  const [form, setForm]       = useState({ reason: '', startDate: '', endDate: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError]     = useState('')

  const days = form.startDate && form.endDate
    ? Math.max(0, Math.ceil(
        (new Date(form.endDate).getTime() - new Date(form.startDate).getTime())
        / (1000 * 60 * 60 * 24)
      ) + 1)
    : 0

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault()
   if (!form.reason || !form.startDate || !form.endDate) {
     setError('Please fill in all fields.')
     return
   }
   if (new Date(form.endDate) < new Date(form.startDate)) {
     setError('End date cannot be before start date.')
     return
   }
   setLoading(true)
   setError('')
   try {
     const token = localStorage.getItem('token')
     console.log('Token:', token)
     console.log('Form data:', form)

     const response = await api.post('/api/leaves/apply', {
       reason:    form.reason,
       startDate: form.startDate,
       endDate:   form.endDate,
     })

     console.log('Response:', response.data)
     setSuccess('Leave applied successfully! Waiting for approval.')
     setForm({ reason: '', startDate: '', endDate: '' })
     setTimeout(() => setSuccess(''), 4000)
   } catch (err: any) {
     console.error('Apply leave error:', err.response?.data)
     setError(
       err.response?.data?.message ||
       err.response?.data?.error ||
       'Failed to apply leave.'
     )
   } finally {
     setLoading(false)
   }
 }
  return (
    <AppLayout title="Apply for Leave">
      <div style={{ maxWidth: '600px' }}>

        {success && (
          <div style={{ marginBottom: '16px', padding: '12px 16px', backgroundColor: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '8px', color: '#4ade80', fontSize: '13px' }}>
            ✅ {success}
          </div>
        )}
        {error && (
          <div style={{ marginBottom: '16px', padding: '12px 16px', backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#f87171', fontSize: '13px' }}>
            {error}
          </div>
        )}

        <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f', borderRadius: '14px', padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarDays size={20} color="#3b82f6" />
            </div>
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#f0f0f0' }}>New Leave Request</h2>
              <p style={{ fontSize: '12px', color: '#555' }}>Fill in the details below</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* Reason */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#888', marginBottom: '8px' }}>
                Reason for Leave
              </label>
              <textarea
                placeholder="Describe your reason for leave..."
                value={form.reason}
                onChange={e => setForm({ ...form, reason: e.target.value })}
                rows={3}
                style={{
                  width: '100%', backgroundColor: '#1a1a1a',
                  border: '1px solid #2a2a2a', borderRadius: '8px',
                  padding: '10px 12px', color: '#e0e0e0', fontSize: '13px',
                  outline: 'none', resize: 'vertical', fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Date row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#888', marginBottom: '8px' }}>
                  Start Date
                </label>
                <input
                  type="date"
                  className="input"
                  value={form.startDate}
                  onChange={e => setForm({ ...form, startDate: e.target.value })}
                  style={{ colorScheme: 'dark' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#888', marginBottom: '8px' }}>
                  End Date
                </label>
                <input
                  type="date"
                  className="input"
                  value={form.endDate}
                  onChange={e => setForm({ ...form, endDate: e.target.value })}
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>

            {/* Days preview */}
            {days > 0 && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: 'rgba(37,99,235,0.06)',
                border: '1px solid rgba(37,99,235,0.15)',
                borderRadius: '8px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontSize: '13px', color: '#888' }}>Total leave days</span>
                <span style={{ fontSize: '20px', fontWeight: 600, color: '#60a5fa' }}>{days} {days === 1 ? 'day' : 'days'}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '11px' }}
            >
              <Send size={15} />
              {loading ? 'Submitting...' : 'Submit Leave Request'}
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  )
}