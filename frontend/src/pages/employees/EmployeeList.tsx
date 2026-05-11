import { useEffect, useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { Users, Plus, Search, Trash2, Pencil, Eye } from 'lucide-react'
import api from '../../utils/axiosConfig'

interface Employee {
  id: number
  name: string
  email: string
  role: string
}

export default function EmployeeList() {
  const [employees, setEmployees]   = useState<Employee[]>([])
  const [search, setSearch]         = useState('')
  const [loading, setLoading]       = useState(true)
  const [showModal, setShowModal]   = useState(false)
  const [form, setForm]             = useState({ name: '', email: '', password: '', role: 'EMPLOYEE' })
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState('')
  const [success, setSuccess]       = useState('')

  const fetchEmployees = () => {
    api.get('/api/users/all')
      .then(res => setEmployees(res.data))
      .catch(() => setEmployees([
        { id: 1, name: 'Admin User',    email: 'admin@hrms.com',    role: 'ADMIN'    },
        { id: 2, name: 'John Manager',  email: 'manager@hrms.com',  role: 'MANAGER'  },
        { id: 3, name: 'Jane Employee', email: 'employee@hrms.com', role: 'EMPLOYEE' },
      ]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchEmployees() }, [])

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await api.post('/api/users/add', form)
      setSuccess('Employee added successfully!')
      setShowModal(false)
      setForm({ name: '', email: '', password: '', role: 'EMPLOYEE' })
      fetchEmployees()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add employee.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this employee?')) return
    try {
      await api.delete(`/api/users/delete/${id}`)
      setEmployees(prev => prev.filter(e => e.id !== id))
      setSuccess('Employee deleted.')
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Failed to delete employee.')
    }
  }

  const roleColor = (role: string) => {
    if (role === 'ADMIN')    return 'badge-danger'
    if (role === 'MANAGER')  return 'badge-warning'
    return 'badge-info'
  }

  return (
    <AppLayout title="Employees">

      {/* Success / Error banners */}
      {success && (
        <div style={{ marginBottom: '16px', padding: '10px 16px', backgroundColor: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '8px', color: '#4ade80', fontSize: '13px' }}>
          {success}
        </div>
      )}
      {error && (
        <div style={{ marginBottom: '16px', padding: '10px 16px', backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#f87171', fontSize: '13px' }}>
          {error}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#f0f0f0' }}>All Employees</h2>
          <p style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>{employees.length} total employees</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
        >
          <Plus size={15} /> Add Employee
        </button>
      </div>

      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        backgroundColor: '#111111', border: '1px solid #1f1f1f',
        borderRadius: '8px', padding: '8px 14px', marginBottom: '16px',
        maxWidth: '320px',
      }}>
        <Search size={14} color="#555" />
        <input
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ background: 'none', border: 'none', outline: 'none', color: '#ccc', fontSize: '13px', width: '100%' }}
        />
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1f1f1f', backgroundColor: '#0d0d0d' }}>
              {['#', 'Name', 'Email', 'Role', 'Actions'].map(h => (
                <th key={h} style={{
                  textAlign: 'left', padding: '12px 16px',
                  fontSize: '11px', color: '#555',
                  fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#555' }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#555' }}>No employees found</td></tr>
            ) : filtered.map((emp, i) => (
              <tr key={emp.id} style={{ borderBottom: '1px solid #1a1a1a', transition: 'background 0.1s' }}
                onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#141414'}
                onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent'}
              >
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#555' }}>{i + 1}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '34px', height: '34px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '13px', fontWeight: 600, color: 'white', flexShrink: 0,
                    }}>
                      {emp.name.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#e0e0e0' }}>{emp.name}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#888' }}>{emp.email}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span className={roleColor(emp.role)}>{emp.role}</span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button style={{
                      padding: '5px 10px', borderRadius: '6px', border: 'none',
                      backgroundColor: 'rgba(239,68,68,0.08)', color: '#f87171',
                      cursor: 'pointer', fontSize: '12px',
                      display: 'flex', alignItems: 'center', gap: '4px',
                    }}
                      onClick={() => handleDelete(emp.id)}
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Employee Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '16px',
        }}>
          <div style={{
            backgroundColor: '#111111', border: '1px solid #222',
            borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '440px',
            boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#f0f0f0' }}>Add New Employee</h3>
              <button onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '20px' }}>×</button>
            </div>

            {error && (
              <div style={{ marginBottom: '16px', padding: '10px', backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#f87171', fontSize: '13px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Full Name</label>
                <input className="input" placeholder="John Doe"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Email</label>
                <input className="input" type="email" placeholder="john@company.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Password</label>
                <input className="input" type="password" placeholder="••••••••"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Role</label>
                <select className="input"
                  value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  <option value="EMPLOYEE">Employee</option>
                  <option value="MANAGER">Manager</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowModal(false)}
                  className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" disabled={saving}
                  className="btn-primary" style={{ flex: 1 }}>
                  {saving ? 'Adding...' : 'Add Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AppLayout>
  )
}