const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from the backend!',
    success: true,
  })
})

app.get('/api/type', async (req, res) => {
  const typeName = req.query.type || req.query.name

  if (!typeName) {
    return res.status(400).json({
      error: 'Please provide a Pokémon type like ?type=fire or /api/type/fire',
    })
  }

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${encodeURIComponent(typeName.toLowerCase())}`)

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'Type not found',
        status: response.status,
      })
    }

    const data = await response.json()
    return res.json(data)
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch Pokémon type data',
      details: error.message,
    })
  }
})

app.get('/api/type/:typeName', async (req, res) => {
  const { typeName } = req.params

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`)

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'Type not found',
        status: response.status,
      })
    }

    const data = await response.json()
    return res.json(data)
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch Pokémon type data',
      details: error.message,
    })
  }
})

app.get('/api/hello', (req, res) => {
  res.json({
    message: 'Hello from the backend!',
    success: true,
  })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
