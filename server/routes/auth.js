const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../db')
require('dotenv').config()

const router = express.Router()

// 회원가입
router.post('/register', async (req, res) => {
  const { email, password } = req.body

  try {
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: '이미 존재하는 이메일이에요' })
    }

    const hashed = await bcrypt.hash(password, 10)
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashed]
    )

    res.status(201).json({ message: '회원가입 성공', user: result.rows[0] })
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message })
  }
})

// 로그인
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (result.rows.length === 0) {
      return res.status(400).json({ message: '이메일 또는 비밀번호가 틀렸어요' })
    }

    const user = result.rows[0]
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(400).json({ message: '이메일 또는 비밀번호가 틀렸어요' })
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ message: '로그인 성공', token })
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message })
  }
})

module.exports = router