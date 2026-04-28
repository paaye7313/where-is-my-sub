import SummaryBox from '../components/SummaryBox'
import SubCard from '../components/SubCard'

const mockData = [
  { id: 1, name: 'Netflix', price: 17000, billingDate: 17, cycle: '월간' },
  { id: 2, name: 'Spotify', price: 10900, billingDate: 23, cycle: '월간' },
  { id: 3, name: '유튜브 프리미엄', price: 14900, billingDate: 5, cycle: '월간' },
  { id: 4, name: 'ChatGPT Plus', price: 27000, billingDate: 25, cycle: '월간' },
]

function Dashboard() {
  const totalMonthly = mockData.reduce((sum, sub) => sum + sub.price, 0)
  const totalYearly = totalMonthly * 12

  return (
    <div>
      <SummaryBox
        totalMonthly={totalMonthly}
        totalYearly={totalYearly}
        count={mockData.length}
      />
      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {mockData.map(sub => (
          <SubCard
            key={sub.id}
            name={sub.name}
            price={sub.price}
            billingDate={sub.billingDate}
            cycle={sub.cycle}
          />
        ))}
      </div>
    </div>
  )
}

export default Dashboard