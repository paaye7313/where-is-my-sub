const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const subscriptionRoutes = require('./routes/subscriptions')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/subscriptions', subscriptionRoutes)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`)
})