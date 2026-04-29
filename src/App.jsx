import { useState } from 'react'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import AuthPage from './pages/AuthPage'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'))

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
      <Header onLogout={handleLogout} />
      <Dashboard />
    </div>
  )
}

export default App