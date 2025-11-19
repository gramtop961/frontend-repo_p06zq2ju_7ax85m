import { useEffect, useMemo, useState } from 'react'

function Stat({ label, value }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
      <div className="text-slate-400 text-xs uppercase tracking-wide">{label}</div>
      <div className="text-white text-2xl font-semibold mt-1">{value}</div>
    </div>
  )
}

export default function Dashboard({ backendUrl, activeBotId }) {
  const [media, setMedia] = useState([])
  const [convos, setConvos] = useState([])

  const revenue = useMemo(() => {
    // simple demo revenue calc based on messages (not fetched here) or media price
    return media.filter(m => m.price).reduce((acc, m) => acc + Number(m.price || 0), 0)
  }, [media])

  useEffect(() => {
    if (!activeBotId) return
    const fetchData = async () => {
      try {
        const [mediaRes, convRes] = await Promise.all([
          fetch(`${backendUrl}/api/media?bot_id=${activeBotId}`),
          fetch(`${backendUrl}/api/conversations?bot_id=${activeBotId}`)
        ])
        const m = await mediaRes.json()
        const c = await convRes.json()
        setMedia(m)
        setConvos(c)
      } catch (e) {
        console.error(e)
      }
    }
    fetchData()
  }, [backendUrl, activeBotId])

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Stars Revenue" value={`★ ${revenue.toFixed(0)}`} />
        <Stat label="Media Items" value={media.length} />
        <Stat label="Conversations" value={convos.length} />
        <Stat label="ARPU (demo)" value={convos.length ? `★ ${(revenue / convos.length).toFixed(1)}` : '★ 0'} />
      </div>
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
        <div className="text-slate-200 font-medium mb-2">Recent Media</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {media.slice(0, 8).map(m => (
            <div key={m._id} className="bg-slate-900/60 border border-slate-700 rounded-lg overflow-hidden">
              <div className="aspect-video bg-slate-800 flex items-center justify-center text-slate-500 text-xs">
                {m.type.toUpperCase()}
              </div>
              <div className="p-2">
                <div className="text-slate-100 text-sm truncate">{m.caption || 'Untitled'}</div>
                {m.price != null && <div className="text-slate-400 text-xs">★ {m.price}</div>}
              </div>
            </div>
          ))}
          {media.length === 0 && (
            <div className="text-slate-400 text-sm">No media yet. Add some in the Media tab.</div>
          )}
        </div>
      </div>
    </div>
  )
}
