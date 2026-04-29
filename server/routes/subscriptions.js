const express = require('express')
const pool = require('../db')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

// 구독 목록 조회
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY order_index',
      [req.user.id]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message })
  }
})

// 구독 추가
router.post('/', authMiddleware, async (req, res) => {
  const { name, price, billingDate, cycle } = req.body
  try {
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM subscriptions WHERE user_id = $1',
      [req.user.id]
    )
    const orderIndex = parseInt(countResult.rows[0].count)

    const result = await pool.query(
      'INSERT INTO subscriptions (user_id, name, price, billing_date, cycle, order_index) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [req.user.id, name, price, billingDate, cycle, orderIndex]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message })
  }
})

// 구독 수정
router.put('/:id', authMiddleware, async (req, res) => {
  const { name, price, billingDate, cycle } = req.body
  try {
    const result = await pool.query(
      'UPDATE subscriptions SET name=$1, price=$2, billing_date=$3, cycle=$4 WHERE id=$5 AND user_id=$6 RETURNING *',
      [name, price, billingDate, cycle, req.params.id, req.user.id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ message: '구독을 찾을 수 없어요' })
    }
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message })
  }
})

// 구독 삭제
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM subscriptions WHERE id=$1 AND user_id=$2',
      [req.params.id, req.user.id]
    )
    res.json({ message: '삭제 완료' })
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message })
  }
})

// 순서 변경
router.put('/reorder', authMiddleware, async (req, res) => {
  const { orderedIds } = req.body
  try {
    for (let i = 0; i < orderedIds.length; i++) {
      await pool.query(
        'UPDATE subscriptions SET order_index=$1 WHERE id=$2 AND user_id=$3',
        [i, orderedIds[i], req.user.id]
      )
    }
    res.json({ message: '순서 변경 완료' })
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message })
  }
})

module.exports = router