function SummaryBox({ totalMonthly, totalYearly, count }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '10px',
      padding: '16px',
    }}>
      <div style={boxStyle}>
        <div style={labelStyle}>이번 달 지출</div>
        <div style={valueStyle}>₩{totalMonthly.toLocaleString()}</div>
      </div>
      <div style={boxStyle}>
        <div style={labelStyle}>연간 환산</div>
        <div style={valueStyle}>₩{totalYearly.toLocaleString()}</div>
      </div>
      <div style={boxStyle}>
        <div style={labelStyle}>구독 중</div>
        <div style={valueStyle}>{count}개</div>
      </div>
    </div>
  )
}

const boxStyle = {
  background: '#ffffff',
  borderRadius: '12px',
  padding: '12px 8px',
  border: '1px solid #e5e5e5',
  textAlign: 'center',
}

const labelStyle = {
  fontSize: '11px',
  color: '#888888',
  marginBottom: '6px',
  wordBreak: 'keep-all',
}

const valueStyle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#1a1a1a',
  wordBreak: 'break-all',
}

export default SummaryBox