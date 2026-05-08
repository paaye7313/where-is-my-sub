import { useState } from 'react'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import AnalyticsPage from './pages/AnalyticsPage'
import AuthPage from './pages/AuthPage'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'))
  const [page, setPage] = useState('dashboard')
  const [subs, setSubs] = useState([])

  function handleLogin() {
    setIsLoggedIn(true)
  }

  function handleLogout() {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
  }

  if (!isLoggedIn) {
    return <AuthPage onLogin={handleLogin} />
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Header
        onLogout={handleLogout}
        page={page}
        onPageChange={setPage}
      />
      {page === 'dashboard'
        ? <Dashboard onSubsChange={setSubs} />
        : <AnalyticsPage subs={subs} />
      }
      <footer style={{
        textAlign: 'center',
        padding: '24px',
        fontSize: '12px',
        color: '#cccccc',
      }}>
        made by paaye7313 with Claude
      </footer>
    </div>
  )
}

export default App