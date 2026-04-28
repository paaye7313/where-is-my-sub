function Header() {
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
      <button style={{
        background: '#534AB7',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        padding: '8px 16px',
        fontSize: '13px',
        cursor: 'pointer'
      }}>
        + 구독 추가
      </button>
    </header>
  )
}

export default Header