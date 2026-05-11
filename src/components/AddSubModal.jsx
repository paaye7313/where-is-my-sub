import { useState } from 'react'

const EMOJI_OPTIONS = ['📦', '📺', '🎵', '🎮', '📚', '🎬', '💪', '🍔', '✈️', '💻', '🎨', '🛒', '📰', '☁️', '🔧']
const COLOR_OPTIONS = ['#534AB7', '#1D9E75', '#D85A30', '#D4537E', '#378ADD', '#BA7517', '#639922', '#7B4F9E', '#2B8C8C', '#C0392B']

function AddSubModal({ onClose, onAdd, onEdit, editData }) {
  const [icon, setIcon] = useState(editData?.icon || '📦')
  const [color, setColor] = useState(editData?.color || '#534AB7')

  function handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    const subData = {
      id: editData ? editData.id : Date.now(),
      name: form.name.value,
      price: Number(form.price.value),
      billingDate: Number(form.billingDate.value),
      cycle: form.cycle.value,
      icon,
      color,
    }
    if (editData) {
      onEdit(subData)
    } else {
      onAdd(subData)
    }
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
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600' }}>
            {editData ? '구독 수정' : '구독 추가'}
          </h2>
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
            <input name="name" required placeholder="예: Netflix" defaultValue={editData?.name} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>월 금액 (원)</label>
            <input name="price" type="number" required placeholder="예: 17000" defaultValue={editData?.price} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>결제일</label>
            <input name="billingDate" type="number" min="1" max="31" required placeholder="예: 17" defaultValue={editData?.billingDate} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>결제 주기</label>
            <select name="cycle" defaultValue={editData?.cycle} style={inputStyle}>
              <option value="월간">월간</option>
              <option value="연간">연간</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>아이콘</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {EMOJI_OPTIONS.map(e => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setIcon(e)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    border: icon === e ? '2px solid #534AB7' : '1px solid #e5e5e5',
                    background: icon === e ? '#f0eeff' : '#ffffff',
                    fontSize: '20px',
                    cursor: 'pointer',
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>색상</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {COLOR_OPTIONS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: c,
                    border: color === c ? '3px solid #1a1a1a' : '2px solid transparent',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>
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
            {editData ? '수정하기' : '추가하기'}
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