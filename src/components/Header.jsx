function Header({ onLogout }) {
  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '1px solid #e5e5e5',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#534AB7' }}>
        내구독어디가
      </h1>
      <button onClick={onLogout} style={{
        background: 'none',
        border: '1px solid #e5e5e5',
        borderRadius: '8px',
        padding: '6px 14px',
        fontSize: '13px',
        cursor: 'pointer',
        color: '#888888',
      }}>
        로그아웃
      </button>
    </header>
  )
}

export default Header