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
    </header>
  )
}

export default Header