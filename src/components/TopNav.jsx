import { useMemo } from 'react'

export default function TopNav({ active, setActive }) {
  const items = useMemo(() => ([
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'messages', label: 'Messages' },
    { key: 'media', label: 'Media' },
  ]), [])

  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900/80 sticky top-0 z-10">
      <div className="text-white font-semibold tracking-tight">TeleBuddy</div>
      <div className="ml-4 flex items-center gap-1">
        {items.map(it => (
          <button
            key={it.key}
            onClick={() => setActive(it.key)}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${active === it.key ? 'bg-blue-600 text-white' : 'text-slate-200 hover:bg-slate-800'}`}
          >
            {it.label}
          </button>
        ))}
      </div>
    </div>
  )
}
