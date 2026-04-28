function AddSubModal({ onClose, onAdd }) {
  function handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    const newSub = {
      id: Date.now(),
      name: form.name.value,
      price: Number(form.price.value),
      billingDate: Number(form.billingDate.value),
      cycle: form.cycle.value,
    }
    onAdd(newSub)
    onClose()
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '28px',
        width: '400px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600' }}>구독 추가</h2>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#888888',
          }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={labelStyle}>서비스 이름</label>
            <input name="name" required placeholder="예: Netflix" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>월 금액 (원)</label>
            <input name="price" type="number" required placeholder="예: 17000" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>결제일</label>
            <input name="billingDate" type="number" min="1" max="31" required placeholder="예: 17" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>결제 주기</label>
            <select name="cycle" style={inputStyle}>
              <option value="월간">월간</option>
              <option value="연간">연간</option>
            </select>
          </div>
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
            추가하기
          </button>
        </form>
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

export default AddSubModal