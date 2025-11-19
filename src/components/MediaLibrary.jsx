import { useEffect, useState } from 'react'

export default function MediaLibrary({ backendUrl, activeBotId }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ type: 'photo', caption: '', price: '', external_url: '' })

  const load = async () => {
    if (!activeBotId) return
    setLoading(true)
    try {
      const res = await fetch(`${backendUrl}/api/media?bot_id=${activeBotId}`)
      const data = await res.json()
      setItems(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [activeBotId])

  const create = async (e) => {
    e.preventDefault()
    if (!activeBotId) return
    try {
      const payload = {
        bot_id: activeBotId,
        type: form.type,
        caption: form.caption || null,
        price: form.price ? Number(form.price) : null,
        external_url: form.external_url || null,
      }
      await fetch(`${backendUrl}/api/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      setForm({ type: 'photo', caption: '', price: '', external_url: '' })
      await load()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <form onSubmit={create} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 grid md:grid-cols-5 gap-3">
        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="bg-slate-900 text-slate-100 border border-slate-700 rounded px-3 py-2">
          <option value="photo">Photo</option>
          <option value="video">Video</option>
          <option value="document">Document</option>
        </select>
        <input value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })} placeholder="Caption" className="bg-slate-900 text-slate-100 border border-slate-700 rounded px-3 py-2 md:col-span-2" />
        <input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="Price (Stars)" className="bg-slate-900 text-slate-100 border border-slate-700 rounded px-3 py-2" />
        <input value={form.external_url} onChange={e => setForm({ ...form, external_url: e.target.value })} placeholder="External URL (demo)" className="bg-slate-900 text-slate-100 border border-slate-700 rounded px-3 py-2" />
        <button className="bg-blue-600 hover:bg-blue-500 text-white rounded px-4 py-2">Add</button>
      </form>

      <div className="grid md:grid-cols-3 gap-3">
        {loading ? (
          <div className="text-slate-400">Loading…</div>
        ) : items.length === 0 ? (
          <div className="text-slate-400">No media yet.</div>
        ) : (
          items.map(m => (
            <div key={m._id} className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden">
              <div className="aspect-video bg-slate-900 flex items-center justify-center text-slate-500 text-xs">{m.type.toUpperCase()}</div>
              <div className="p-3">
                <div className="text-slate-100 text-sm">{m.caption || 'Untitled'}</div>
                {m.price != null && <div className="text-slate-400 text-xs">★ {m.price}</div>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
