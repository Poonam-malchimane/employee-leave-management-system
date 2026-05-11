import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

interface AppLayoutProps {
  children: ReactNode
  title: string
}

export default function AppLayout({ children, title }: AppLayoutProps) {
  return (
    <div style={{ display: 'flex', backgroundColor: 'var(--bg-secondary)', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ marginLeft: '240px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar title={title} />
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto', backgroundColor: 'var(--bg-secondary)' }}>
          {children}
        </main>
      </div>
    </div>
  )
}