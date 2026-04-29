import { useState } from 'react'
import { login, register } from '../api'

function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      if (isLogin) {
        const res = await login(email, password)
        localStorage.setItem('token', res.data.token)
        onLogin()
      } else {
        await register(email, password)
        setIsLogin(true)
        setError('회원가입 성공! 로그인해줘요 😊')
      }
    } catch (err) {
      setError(err.response?.data?.message || '오류가 발생했어요')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '36px',
        width: '400px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
      }}>
        <h1 style={{
          fontSize: '22px',
          fontWeight: '600',
          color: '#534AB7',
          marginBottom: '8px',
          textAlign: 'center',
        }}>
          내구독어디가
        </h1>
        <p style={{
          fontSize: '13px',
          color: '#888888',
          textAlign: 'center',
          marginBottom: '28px',
        }}>
          {isLogin ? '로그인하고 구독을 관리해요' : '계정을 만들어요'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={labelStyle}>이메일</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@email.com"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>비밀번호</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              style={inputStyle}
            />
          </div>

          {error && (
            <div style={{
              fontSize: '13px',
              color: error.includes('성공') ? '#0F6E56' : '#d94f4f',
              textAlign: 'center',
            }}>
              {error}
            </div>
          )}

          <button type="submit" style={{
            marginTop: '8px',
            background: '#534AB7',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
          }}>
            {isLogin ? '로그인' : '회원가입'}
          </button>
        </form>

        <p style={{
          fontSize: '13px',
          color: '#888888',
          textAlign: 'center',
          marginTop: '20px',
        }}>
          {isLogin ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}
          <span
            onClick={() => { setIsLogin(!isLogin); setError('') }}
            style={{ color: '#534AB7', cursor: 'pointer', marginLeft: '6px', fontWeight: '500' }}
          >
            {isLogin ? '회원가입' : '로그인'}
          </span>
        </p>
      </div>
    </div>
  )
}

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  color: '#888888',
  marginBottom: '6px',
}

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #e5e5e5',
  borderRadius: '8px',
  fontSize: '14px',
  outline: 'none',
}

export default AuthPage