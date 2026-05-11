import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Building2 } from 'lucide-react';
import api from '../../utils/axiosConfig';
import { useAuthStore } from '../../store/authStore';

export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [form, setForm]         = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    setError('')
    try {
      // Step 1 — Login to get token
      const { data } = await api.post('/api/users/login', form)
      const token = data.token

      // Step 2 — Store token first
      localStorage.setItem('token', token)

      // Step 3 — Fetch all users to find role
      const usersRes = await api.get('/api/users/all', {
        headers: { Authorization: `Bearer ${token}` }
      })

      const currentUser = usersRes.data.find(
        (u: any) => u.email === form.email
      )

      const user = {
        id:    currentUser?.id   || 1,
        name:  currentUser?.name || form.email.split('@')[0],
        email: form.email,
        role:  (currentUser?.role || 'EMPLOYEE') as 'ADMIN' | 'MANAGER' | 'EMPLOYEE',
      }

      setAuth(token, user)

      // Step 4 — Redirect based on role
      const role = user.role
      if      (role === 'ADMIN')   navigate('/admin/dashboard')
      else if (role === 'MANAGER') navigate('/manager/dashboard')
      else                         navigate('/employee/dashboard')

    } catch (err: any) {
      console.error('Login error:', err.response?.data)
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Invalid email or password.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Glow effect */}
      <div style={{
        position: 'absolute',
        top: '25%', left: '50%',
        transform: 'translateX(-50%)',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '400px', position: 'relative' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '52px', height: '52px',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 0 24px rgba(37,99,235,0.3)',
          }}>
            <Building2 size={26} color="white" />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#f0f0f0', marginBottom: '6px' }}>
            Welcome back
          </h1>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Sign in to your HRMS account
          </p>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: '#111111',
          border: '1px solid #222222',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
        }}>

          {error && (
            <div style={{
              marginBottom: '16px',
              padding: '10px 14px',
              backgroundColor: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '8px',
              color: '#f87171',
              fontSize: '13px',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#aaa', marginBottom: '6px' }}>
                Email address
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={handleChange}
                className="input"
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#aaa' }}>
                  Password
                </label>
                <a href="/forgot-password"
                   style={{ fontSize: '12px', color: '#3b82f6', textDecoration: 'none' }}>
                  Forgot password?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="input"
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    cursor: 'pointer', color: '#555', padding: 0,
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '8px', fontSize: '14px', padding: '11px',
              }}
            >
              {loading && (
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              )}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

          </form>
        </div>

        <p style={{ textAlign: 'center', color: '#444', fontSize: '12px', marginTop: '24px' }}>
          Employee & Leave Management System © 2025
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}