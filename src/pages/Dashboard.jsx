import { useState } from 'react'
import SummaryBox from '../components/SummaryBox'
import SubCard from '../components/SubCard'
import AddSubModal from '../components/AddSubModal'

const initialData = [
  { id: 1, name: 'Netflix', price: 17000, billingDate: 17, cycle: '월간' },
  { id: 2, name: 'Spotify', price: 10900, billingDate: 23, cycle: '월간' },
  { id: 3, name: '유튜브 프리미엄', price: 14900, billingDate: 5, cycle: '월간' },
  { id: 4, name: 'ChatGPT Plus', price: 27000, billingDate: 25, cycle: '월간' },
]

function Dashboard() {
  const [subs, setSubs] = useState(initialData)
  const [showModal, setShowModal] = useState(false)
  const [editData, setEditData] = useState(null)

  const totalMonthly = subs.reduce((sum, sub) => sum + sub.price, 0)
  const totalYearly = totalMonthly * 12

  function handleAdd(newSub) {
    setSubs([...subs, newSub])
  }

  function handleEdit(updated) {
    setSubs(subs.map(sub => sub.id === updated.id ? updated : sub))
  }

  function handleDelete(id) {
    setSubs(subs.filter(sub => sub.id !== id))
  }

  function openEdit(sub) {
    setEditData(sub)
    setShowModal(true)
  }

  function closeModal() {
    setEditData(null)
    setShowModal(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 24px 0' }}>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: '#534AB7',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          + 구독 추가
        </button>
      </div>
      <SummaryBox
        totalMonthly={totalMonthly}
        totalYearly={totalYearly}
        count={subs.length}
      />
      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {subs.map(sub => (
          <SubCard
            key={sub.id}
            id={sub.id}
            name={sub.name}
            price={sub.price}
            billingDate={sub.billingDate}
            cycle={sub.cycle}
            onDelete={handleDelete}
            onEdit={openEdit}
          />
        ))}
      </div>

      {showModal && (
        <AddSubModal
          onClose={closeModal}
          onAdd={handleAdd}
          onEdit={handleEdit}
          editData={editData}
        />
      )}
    </div>
  )
}

export default Dashboard