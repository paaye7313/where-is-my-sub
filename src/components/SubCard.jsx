function SubCard({ name, price, billingDate, cycle }) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e5e5e5',
      borderRadius: '12px',
      padding: '14px 18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: '#f0eeff',
          color: '#534AB7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '600',
          fontSize: '16px',
        }}>
          {name[0]}
        </div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a' }}>
            {name}
          </div>
          <div style={{ fontSize: '12px', color: '#888888', marginTop: '2px' }}>
            매월 {billingDate}일 · {cycle}
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
          ₩{price.toLocaleString()}
        </div>
      </div>
    </div>
  )
}

export default SubCard