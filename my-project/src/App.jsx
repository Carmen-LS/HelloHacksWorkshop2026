import { useState } from 'react'
import './App.css'

const types = [
  { name: 'Fire', className: 'fire' },
  { name: 'Water', className: 'water' },
  { name: 'Fairy', className: 'fairy' },
  { name: 'Dragon', className: 'dragon' },
]

const BACKEND_URL = 'http://localhost:5001'

function PokeballIcon() {
  return (
    <div className="pokeball-badge" aria-label="Pokeball icon" role="img">
      <div className="pokeball-top" />
      <div className="pokeball-center">
        <div className="pokeball-center-dot" />
      </div>
      <div className="pokeball-bottom" />
    </div>
  )
}

function formatTypeNames(typeList = []) {
  return typeList.length ? typeList.map((type) => type.name).join(', ') : 'None'
}

function App() {
  const [selectedType, setSelectedType] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleTypeClick(type) {
    setSelectedType(type)
    setLoading(true)
    setError('')
    setResult('')

    try {
      const response = await fetch(`${BACKEND_URL}/api/type/${encodeURIComponent(type.toLowerCase())}`)

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const data = await response.json()
      const strongAgainst = (data.half_damage_to || []).join(', ') || 'None'
      const weakTo = (data.double_damage_from || []).join(', ') || 'None'

      setResult(
        `${type} is strong against: ${strongAgainst}. ${type} is weak to: ${weakTo}.`
      )
    } catch (err) {
      setError(`Failed to load matchup data for ${type}: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="battle-app">
      <section className="battle-panel">
        <h1>Pokemon Battle Assistant</h1>

        <div className="prompt-header">
          <PokeballIcon />
          <p>What type of pokemon are you fighting?</p>
        </div>

        <div className="battle-buttons">
          {types.map((type) => (
            <button
              key={type.name}
              type="button"
              className={`pokemon-button ${type.className} ${selectedType === type.name ? 'selected' : ''}`}
              onClick={() => handleTypeClick(type.name)}
              disabled={loading}
            >
              {type.name}
            </button>
          ))}
        </div>

        {loading && <div className="result-box">Loading matchup data...</div>}
        {error && <div className="result-box error">{error}</div>}
        {result && <div className="result-box">{result}</div>}
      </section>
    </main>
  )
}

export default App
