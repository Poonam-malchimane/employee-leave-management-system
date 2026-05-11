import { ReactNode } from 'react'
import EmployeeSidebar from './EmployeeSidebar'
import Navbar from './Navbar'

interface Props {
  children: ReactNode
  title: string
}

export default function EmployeeLayout({ children, title }: Props) {
  return (
    <div style={{ display: 'flex', backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <EmployeeSidebar />
      <div style={{ marginLeft: '240px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar title={title} />
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}