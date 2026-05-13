import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
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

const initialData = []

function Dashboard({ onSubsChange }) {
  const [subs, setSubs] = useState(initialData)
  const [showModal, setShowModal] = useState(false)
  const [editData, setEditData] = useState(null)
  const [search, setSearch] = useState('')
  const [isReordering, setIsReordering] = useState(false)
  const [tempSubs, setTempSubs] = useState([])
  const [sortReorderKey, setSortReorderKey] = useState(null)
  const [sortReorderDir, setSortReorderDir] = useState('asc')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 500,
        tolerance: 8,
      },
    })
  )

  useState(() => {
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

  const totalMonthly = subs.reduce((sum, sub) =>
    sum + (sub.cycle === '연간' ? Math.round(sub.price / 12) : sub.price), 0)
  const totalYearly = totalMonthly * 12

  async function handleAdd(newSub) {
    try {
      await addSubscription({
        name: newSub.name,
        price: newSub.price,
        billingDate: newSub.billingDate,
        billingMonth: newSub.billingMonth,
        cycle: newSub.cycle,
        icon: newSub.icon,
        color: newSub.color,
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
        billingMonth: updated.billingMonth,
        cycle: updated.cycle,
        icon: updated.icon,
        color: updated.color,
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

  function startReordering() {
    setTempSubs([...subs])
    setIsReordering(true)
  }

  function cancelReordering() {
    setSubs([...tempSubs])
    setIsReordering(false)
    setSortReorderKey(null)
    setSortReorderDir('asc')
  }

  async function saveReordering() {
    try {
      await reorderSubscriptions(subs.map(sub => sub.id))
      setIsReordering(false)
      fetchSubs()
    } catch (err) {
      console.error('순서 저장 실패', err)
    }
  }

  function handleSort(key) {
    const getMonthlyPrice = (sub) =>
      sub.cycle === '연간' ? Math.round(sub.price / 12) : sub.price

    const sorted = [...subs].sort((a, b) => {
      if (key === 'name') return a.name.localeCompare(b.name)
      if (key === 'price') return getMonthlyPrice(a) - getMonthlyPrice(b)
      if (key === 'billingDate') return a.billing_date - b.billing_date
      return 0
    })

    const isSameKey = sortReorderKey === key
    const nextDir = isSameKey && sortReorderDir === 'asc' ? 'desc' : 'asc'
    const finalSorted = nextDir === 'desc' ? sorted.reverse() : sorted

    setSubs(finalSorted)
    setSortReorderKey(key)
    setSortReorderDir(nextDir)
  }

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = subs.findIndex(sub => sub.id === active.id)
    const newIndex = subs.findIndex(sub => sub.id === over.id)
    setSubs(arrayMove(subs, oldIndex, newIndex))
    setSortReorderKey(null)
    setSortReorderDir('asc')
  }

  const displaySubs = isReordering ? subs : filtered

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px 0',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        {!isReordering ? (
          <>
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
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={startReordering} style={outlineBtnStyle}>
                순서 수정
              </button>
              <button onClick={() => setShowModal(true)} style={primaryBtnStyle}>
                + 구독 추가
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', color: '#888888', alignSelf: 'center' }}>정렬:</span>
              {[
                { key: 'name', label: '이름순' },
                { key: 'price', label: '금액순' },
                { key: 'billingDate', label: '결제일순' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => handleSort(key)}
                  style={{
                    ...sortBtnStyle,
                    background: sortReorderKey === key ? '#534AB7' : '#f0eeff',
                    color: sortReorderKey === key ? '#ffffff' : '#534AB7',
                  }}
                >
                  {label} {sortReorderKey === key ? (sortReorderDir === 'asc' ? '↑' : '↓') : '↕'}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={cancelReordering} style={outlineBtnStyle}>취소</button>
              <button onClick={saveReordering} style={primaryBtnStyle}>저장</button>
            </div>
          </>
        )}
      </div>

      <SummaryBox
        totalMonthly={totalMonthly}
        totalYearly={totalYearly}
        count={subs.length}
      />

      <DndContext
        sensors={isReordering ? sensors : []}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={displaySubs.map(s => s.id)} strategy={verticalListSortingStrategy}>
          <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {displaySubs.length > 0 ? (
              displaySubs.map(sub => (
                <SubCard
                  key={sub.id}
                  id={sub.id}
                  name={sub.name}
                  price={sub.price}
                  billingDate={sub.billing_date}
                  billingMonth={sub.billing_month}
                  cycle={sub.cycle}
                  icon={sub.icon}
                  color={sub.color}
                  onDelete={handleDelete}
                  onEdit={openEdit}
                  isReordering={isReordering}
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

const primaryBtnStyle = {
  background: '#534AB7',
  color: '#ffffff',
  border: 'none',
  borderRadius: '8px',
  padding: '8px 16px',
  fontSize: '13px',
  cursor: 'pointer',
}

const outlineBtnStyle = {
  background: 'none',
  color: '#534AB7',
  border: '1px solid #534AB7',
  borderRadius: '8px',
  padding: '8px 16px',
  fontSize: '13px',
  cursor: 'pointer',
}

const sortBtnStyle = {
  background: '#f0eeff',
  color: '#534AB7',
  border: 'none',
  borderRadius: '8px',
  padding: '6px 12px',
  fontSize: '12px',
  cursor: 'pointer',
}

export default Dashboard