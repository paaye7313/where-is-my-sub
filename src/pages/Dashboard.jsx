import { useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import SummaryBox from '../components/SummaryBox'
import SubCard from '../components/SubCard'
import AddSubModal from '../components/AddSubModal'
import {
  getSubscriptions,
  addSubscription,
  updateSubscription,
  deleteSubscription,
  reorderSubscriptions,
} from '../api'

function Dashboard({ onSubsChange }) {
  const [subs, setSubs] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editData, setEditData] = useState(null)
  const [search, setSearch] = useState('')

  const sensors = useSensors(useSensor(PointerSensor))

  useEffect(() => {
    fetchSubs()
  }, [])

  async function fetchSubs() {
    try {
      const res = await getSubscriptions()
      setSubs(res.data)
      onSubsChange(res.data)
    } catch (err) {
      console.error('구독 목록 불러오기 실패', err)
    }
  }

  const filtered = subs.filter(sub =>
    sub.name.toLowerCase().includes(search.toLowerCase())
  )

  const totalMonthly = subs.reduce((sum, sub) => sum + sub.price, 0)
  const totalYearly = totalMonthly * 12

  async function handleAdd(newSub) {
    try {
      await addSubscription({
        name: newSub.name,
        price: newSub.price,
        billingDate: newSub.billingDate,
        cycle: newSub.cycle,
      })
      fetchSubs()
    } catch (err) {
      console.error('구독 추가 실패', err)
    }
  }

  async function handleEdit(updated) {
    try {
      await updateSubscription(updated.id, {
        name: updated.name,
        price: updated.price,
        billingDate: updated.billingDate,
        cycle: updated.cycle,
      })
      fetchSubs()
    } catch (err) {
      console.error('구독 수정 실패', err)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteSubscription(id)
      fetchSubs()
    } catch (err) {
      console.error('구독 삭제 실패', err)
    }
  }

  function openEdit(sub) {
    setEditData(sub)
    setShowModal(true)
  }

  function closeModal() {
    setEditData(null)
    setShowModal(false)
  }

  async function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = subs.findIndex(sub => sub.id === active.id)
    const newIndex = subs.findIndex(sub => sub.id === over.id)
    const reordered = arrayMove(subs, oldIndex, newIndex)
    setSubs(reordered)

    try {
      await reorderSubscriptions(reordered.map(sub => sub.id))
    } catch (err) {
      console.error('순서 변경 실패', err)
    }
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px 0'
      }}>
        <input
          type="text"
          placeholder="구독 검색..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: '8px 14px',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            fontSize: '13px',
            width: '220px',
            outline: 'none',
          }}
        />
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
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={filtered.map(s => s.id)} strategy={verticalListSortingStrategy}>
          <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.length > 0 ? (
              filtered.map(sub => (
                <SubCard
                  key={sub.id}
                  id={sub.id}
                  name={sub.name}
                  price={sub.price}
                  billingDate={sub.billing_date}
                  cycle={sub.cycle}
                  onDelete={handleDelete}
                  onEdit={openEdit}
                />
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#888888', fontSize: '14px', padding: '40px 0' }}>
                {search ? '검색 결과가 없어요 🔍' : '구독을 추가해봐요 😊'}
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

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