import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SubCard({ id, name, price, billingDate, billingMonth, cycle, icon, color, onDelete, onEdit, isReordering, expanded, onExpand }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <div
        onClick={() => !isReordering && onExpand(id)}
        style={{
          background: expanded ? `${color || '#534AB7'}09` : '#ffffff',
          borderTop: `1px solid ${expanded ? (color || '#534AB7') : '#e5e5e5'}`,
          borderLeft: `1px solid ${expanded ? (color || '#534AB7') : '#e5e5e5'}`,
          borderRight: `1px solid ${expanded ? (color || '#534AB7') : '#e5e5e5'}`,
          borderBottom: expanded ? 'none' : `1px solid #e5e5e5`,
          borderRadius: expanded ? '12px 12px 0 0' : '12px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: isReordering ? 'default' : 'pointer',
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
            flexShrink: 0,
          }}>
            {icon || '📦'}
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a' }}>
              {name}
            </div>
            <div style={{ fontSize: '12px', color: '#888888', marginTop: '2px' }}>
              {cycle === '연간'
                ? `매년 ${billingMonth}월 ${billingDate}일 · 연간`
                : `매월 ${billingDate}일 · 월간`
              }
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ textAlign: 'right', marginRight: '8px' }}>
            <div style={{ fontSize: '12px', color: '#888888', marginTop: '2px' }}>
              {cycle === '연간'
                ? `매년 ₩${price.toLocaleString()}원`
                : `매월 ₩${price.toLocaleString()}원`
              }
            </div>
            {cycle === '연간' && (
              <div style={{ fontSize: '11px', color: '#888888', marginTop: '2px' }}>
                월환산 ₩{Math.round(price / 12).toLocaleString()}원
              </div>
            )}
          </div>
          {!isReordering && (
            <div style={{ color: '#cccccc', fontSize: '16px' }}>
              {expanded ? '▲' : '▼'}
            </div>
          )}
        </div>
      </div>

      {expanded && !isReordering && (
        <div style={{
          background: `${color || '#534AB7'}09`,
          borderLeft: `1px solid ${color || '#534AB7'}`,
          borderRight: `1px solid ${color || '#534AB7'}`,
          borderBottom: `1px solid ${color || '#534AB7'}`,
          borderRadius: '0 0 12px 12px',
          padding: '10px 18px',
          display: 'flex',
          gap: '8px',
          justifyContent: 'flex-end',
        }}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit({ id, name, price, billingDate, billingMonth, cycle, icon, color })
              setExpanded(false)
            }}
            style={btnStyle('#f0eeff', '#534AB7')}
          >
            수정
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (window.confirm(`'${name}' 구독을 삭제할까요?`)) {
                onDelete(id)
              }
              setExpanded(false)
            }}
            style={btnStyle('#fff0f0', '#d94f4f')}
          >
            삭제
          </button>
        </div>
      )}
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