function Header({ onLogout, page, onPageChange }) {
  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '1px solid #e5e5e5',
      padding: '14px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#534AB7' }}>
        내구독어디가
      </h1>
      <div style={{ display: 'flex', gap: '4px' }}>
        <button
          onClick={() => onPageChange('dashboard')}
          style={navBtnStyle(page === 'dashboard')}
        >
          대시보드
        </button>
        <button
          onClick={() => onPageChange('analytics')}
          style={navBtnStyle(page === 'analytics')}
        >
          지출 분석
        </button>
      </div>
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

function navBtnStyle(active) {
  return {
    background: active ? '#f0eeff' : 'none',
    color: active ? '#534AB7' : '#888888',
    border: 'none',
    borderRadius: '8px',
    padding: '6px 14px',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: active ? '500' : '400',
  }
}

export default Header