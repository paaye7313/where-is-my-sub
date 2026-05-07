import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const statsGridStyle = `
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-bottom: 20px;
  }
  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: repeat(3, 1fr);
    }
    .stats-grid .most-expensive {
      grid-column: 1 / -1;
    }
  }
    @media (max-width: 480px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .stats-grid .most-expensive {
      grid-column: 1 / -1;
    }
  }
`

function AnalyticsPage({ subs }) {
  const [excluded, setExcluded] = useState([])
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')

  function toggleSub(id) {
    setExcluded(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    )
  }

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const filtered = subs.filter(sub => !excluded.includes(sub.id))

  const sortedSubs = [...filtered].sort((a, b) => {
    if (!sortKey) return b.price - a.price
    if (sortKey === 'name') {
      return sortDir === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    }
    const aVal = sortKey === 'yearly' ? a.price * 12 : a.price
    const bVal = sortKey === 'yearly' ? b.price * 12 : b.price
    return sortDir === 'asc' ? aVal - bVal : bVal - aVal
  })

  const totalMonthly = filtered.reduce((sum, sub) => sum + sub.price, 0)
  const totalYearly = totalMonthly * 12
  const mostExpensive = filtered.length > 0
    ? filtered.reduce((max, sub) => sub.price > max.price ? sub : max, filtered[0])
    : null

  const barData = [...filtered]
    .sort((a, b) => b.price - a.price)
    .map(sub => ({ name: sub.name, 월간: sub.price }))

  const colors = ['#534AB7', '#1D9E75', '#D85A30', '#D4537E', '#378ADD', '#BA7517', '#639922']

  return (
    <>
      <style>{statsGridStyle}</style>
      <div style={{ padding: '24px' }}>

        <div className="stats-grid">
          <div style={statStyle}>
            <div style={labelStyle}>이번 달 지출</div>
            <div style={valStyle}>₩{totalMonthly.toLocaleString()}</div>
          </div>
          <div style={statStyle}>
            <div style={labelStyle}>연간 환산</div>
            <div style={valStyle}>₩{totalYearly.toLocaleString()}</div>
          </div>
          <div style={statStyle}>
            <div style={labelStyle}>구독 수</div>
            <div style={valStyle}>{filtered.length}개</div>
          </div>
          <div className="most-expensive" style={statStyle}>
            <div style={labelStyle}>가장 비싼 구독</div>
            <div style={{ ...valStyle, fontSize: '15px' }}>
              {mostExpensive ? mostExpensive.name : '-'}
            </div>
            <div style={{ fontSize: '11px', color: '#888888', marginTop: '2px' }}>
              {mostExpensive ? `₩${mostExpensive.price.toLocaleString()}/월` : ''}
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={cardTitleStyle}>구독별 지출 비중</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
            {subs.map(sub => (
              <button
                key={sub.id}
                onClick={() => toggleSub(sub.id)}
                style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  border: '1px solid',
                  fontSize: '12px',
                  cursor: 'pointer',
                  borderColor: excluded.includes(sub.id) ? '#e5e5e5' : '#534AB7',
                  background: excluded.includes(sub.id) ? 'none' : '#f0eeff',
                  color: excluded.includes(sub.id) ? '#888888' : '#534AB7',
                  textDecoration: excluded.includes(sub.id) ? 'line-through' : 'none',
                }}
              >
                {sub.name}
              </button>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 4, right: 16, left: 16, bottom: 4 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₩${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={v => `₩${v.toLocaleString()}`} />
              <Bar dataKey="월간" radius={[6, 6, 0, 0]}>
                {barData.map((_, i) => (
                  <Cell key={i} fill={colors[i % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={cardStyle}>
          <div style={cardTitleStyle}>월 / 연간 환산 비교</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, cursor: 'pointer' }} onClick={() => handleSort('name')}>
                  구독 {sortKey === 'name' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                </th>
                <th style={{ ...thStyle, textAlign: 'right', cursor: 'pointer' }} onClick={() => handleSort('monthly')}>
                  월간 {sortKey === 'monthly' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                </th>
                <th style={{ ...thStyle, textAlign: 'right', cursor: 'pointer' }} onClick={() => handleSort('yearly')}>
                  연간 {sortKey === 'yearly' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedSubs.map(sub => (
                <tr key={sub.id}>
                  <td style={tdStyle}>{sub.name}</td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontWeight: '500' }}>
                    ₩{sub.price.toLocaleString()}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right', color: '#534AB7', fontWeight: '500' }}>
                    ₩{(sub.price * 12).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td style={{ ...tdStyle, fontWeight: '500' }}>합계</td>
                <td style={{ ...tdStyle, textAlign: 'right', fontWeight: '500' }}>
                  ₩{totalMonthly.toLocaleString()}
                </td>
                <td style={{ ...tdStyle, textAlign: 'right', fontWeight: '500', color: '#534AB7' }}>
                  ₩{totalYearly.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

      </div>
    </>
  )
}

const statStyle = {
  background: '#f5f5f5',
  borderRadius: '10px',
  padding: '14px',
}

const labelStyle = {
  fontSize: '11px',
  color: '#888888',
  marginBottom: '4px',
}

const valStyle = {
  fontSize: '20px',
  fontWeight: '500',
  color: '#1a1a1a',
}

const cardStyle = {
  background: '#ffffff',
  border: '1px solid #e5e5e5',
  borderRadius: '12px',
  padding: '16px',
  marginBottom: '12px',
}

const cardTitleStyle = {
  fontSize: '12px',
  fontWeight: '500',
  color: '#888888',
  marginBottom: '14px',
}

const thStyle = {
  padding: '8px 0',
  borderBottom: '1px solid #e5e5e5',
  color: '#888888',
  fontWeight: '500',
  textAlign: 'left',
}

const tdStyle = {
  padding: '10px 0',
  borderBottom: '1px solid #f5f5f5',
  color: '#1a1a1a',
}

export default AnalyticsPage