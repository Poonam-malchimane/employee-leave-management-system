import { Routes, Route, Navigate } from 'react-router-dom'
import Login                from './pages/auth/Login'
import AdminDashboard       from './pages/dashboard/AdminDashboard'
import EmployeeDashboard    from './pages/dashboard/EmployeeDashboard'
import EmployeeList         from './pages/employees/EmployeeList'
import LeaveList            from './pages/leaves/LeaveList'
import ApplyLeave           from './pages/leaves/ApplyLeave'
import MyLeaves             from './pages/leaves/MyLeaves'
import EmployeeApplyLeave   from './pages/leaves/EmployeeApplyLeave'
import EmployeeMyLeaves     from './pages/leaves/EmployeeMyLeaves'
import Profile              from './pages/settings/Profile'
import EmployeeProfile      from './pages/settings/EmployeeProfile'
import Reports              from './pages/reports/Reports'
import NotFound             from './pages/NotFound'
import { useAuthStore }     from './store/authStore'
import LeaveCalendar    from './pages/leaves/LeaveCalendar'
import AttendanceTracker from './pages/employees/AttendanceTracker'

function App() {
  const { isAuthenticated, user } = useAuthStore()

  const protect = (el: JSX.Element) =>
    isAuthenticated ? el : <Navigate to="/login" replace />

  const adminOnly = (el: JSX.Element) =>
    isAuthenticated && user?.role === 'ADMIN'
      ? el
      : <Navigate to="/login" replace />

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={
        isAuthenticated
          ? <Navigate to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/employee/dashboard'} replace />
          : <Login />
      } />

      {/* Admin routes */}
      <Route path="/admin/dashboard" element={adminOnly(<AdminDashboard />)}     />
      <Route path="/admin/employees" element={adminOnly(<EmployeeList />)}       />
      <Route path="/admin/leaves"    element={adminOnly(<LeaveList />)}          />
      <Route path="/admin/approvals" element={adminOnly(<LeaveList />)}          />
      <Route path="/admin/apply"     element={adminOnly(<ApplyLeave />)}         />
      <Route path="/admin/my-leaves" element={adminOnly(<MyLeaves />)}           />
      <Route path="/admin/settings"  element={adminOnly(<Profile />)}            />
      <Route path="/admin/reports"   element={adminOnly(<Reports />)}            />

      <Route path="/admin/calendar"   element={adminOnly(<LeaveCalendar />)}     />
      <Route path="/admin/attendance" element={adminOnly(<AttendanceTracker />)}  />

      {/* Employee routes */}
      <Route path="/employee/dashboard" element={protect(<EmployeeDashboard />)}    />
      <Route path="/employee/apply"     element={protect(<EmployeeApplyLeave />)}   />
      <Route path="/employee/my-leaves" element={protect(<EmployeeMyLeaves />)}     />
      <Route path="/employee/profile"   element={protect(<EmployeeProfile />)}      />

      {/* Fallback */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*"    element={<NotFound />} />
    </Routes>
  )
}

export default App