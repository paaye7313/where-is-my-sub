import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SubCard({ id, name, price, billingDate, cycle, icon, color, onDelete, onEdit, isReordering }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style}>
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
          {isReordering && (
            <div
              {...attributes}
              {...listeners}
              style={{
                cursor: 'grab',
                color: '#cccccc',
                fontSize: '18px',
                padding: '0 4px',
                userSelect: 'none',
                touchAction: 'none',
              }}
            >
              ⠿
            </div>
          )}
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: color ? `${color}22` : '#f0eeff',
            border: `1px solid ${color || '#534AB7'}33`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
          }}>
            {icon || '📦'}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', marginRight: '8px' }}>
            ₩{price.toLocaleString()}
          </div>
          {!isReordering && (
            <>
              <button onClick={() => onEdit({ id, name, price, billingDate, cycle, icon, color })} style={btnStyle('#f0eeff', '#534AB7')}>
                수정
              </button>
              <button onClick={() => {
                if (window.confirm(`'${name}' 구독을 삭제할까요?`)) {
                  onDelete(id)
                }
              }} style={btnStyle('#fff0f0', '#d94f4f')}>
                삭제
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function btnStyle(bg, color) {
  return {
    background: bg,
    color: color,
    border: 'none',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: '500',
  }
}

export default SubCard