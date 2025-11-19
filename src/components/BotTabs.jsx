import { useEffect, useState } from 'react'

export default function BotTabs({ backendUrl, activeBotId, onChange }) {
  const [bots, setBots] = useState([])
  const [loading, setLoading] = useState(true)
  const [newBotName, setNewBotName] = useState('')

  const fetchBots = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${backendUrl}/api/bots`)
      const data = await res.json()
      setBots(data)
      if (data.length > 0 && !activeBotId) {
        onChange(data[0]._id)
      }
    } catch (e) {
      console.error('Failed to load bots', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBots()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const createBot = async (e) => {
    e.preventDefault()
    if (!newBotName.trim()) return
    try {
      await fetch(`${backendUrl}/api/bots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newBotName })
      })
      setNewBotName('')
      await fetchBots()
    } catch (e) {
      console.error('Failed to create bot', e)
    }
  }

  return (
    <div className="border-b border-slate-800 px-4 py-2 flex items-center gap-2 overflow-x-auto">
      {loading ? (
        <div className="text-slate-400 text-sm">Loading bots…</div>
      ) : (
        <>
          {bots.map((b) => (
            <button
              key={b._id}
              onClick={() => onChange(b._id)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                activeBotId === b._id ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              {b.name}
            </button>
          ))}
          <form onSubmit={createBot} className="ml-auto flex items-center gap-2">
            <input
              value={newBotName}
              onChange={(e) => setNewBotName(e.target.value)}
              placeholder="Add bot"
              className="bg-slate-800 text-slate-100 placeholder-slate-400 px-3 py-1.5 rounded-md text-sm border border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-3 py-1.5 rounded-md">Add</button>
          </form>
        </>
      )}
    </div>
  )
}
