import { useEffect, useState } from 'react'

function ConversationList({ items, activeId, onSelect }) {
  return (
    <div className="w-64 border-r border-slate-800 overflow-y-auto">
      {items.map((c) => (
        <button
          key={c._id}
          onClick={() => onSelect(c._id)}
          className={`w-full text-left px-4 py-3 border-b border-slate-800 hover:bg-slate-800/40 ${activeId === c._id ? 'bg-slate-800/60' : ''}`}
        >
          <div className="text-slate-100 text-sm truncate">{c.last_message_preview || 'Conversation'}</div>
          <div className="text-slate-500 text-xs">Unread: {c.unread || 0}</div>
        </button>
      ))}
      {items.length === 0 && (
        <div className="p-4 text-slate-500 text-sm">No conversations yet.</div>
      )}
    </div>
  )
}

function Thread({ backendUrl, conversationId }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [media, setMedia] = useState([])

  const load = async () => {
    if (!conversationId) return
    const res = await fetch(`${backendUrl}/api/messages?conversation_id=${conversationId}`)
    const data = await res.json()
    setMessages(data)
  }

  useEffect(() => { load() }, [conversationId])
  useEffect(() => {
    const f = async () => {
      const res = await fetch(`${backendUrl}/api/media`)
      const data = await res.json()
      setMedia(data)
    }
    f()
  }, [backendUrl])

  const sendText = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    await fetch(`${backendUrl}/api/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation_id: conversationId, text })
    })
    setText('')
    await load()
  }

  const sendMedia = async (media_item_id, price) => {
    await fetch(`${backendUrl}/api/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation_id: conversationId, media_item_id, paid: !!price, price })
    })
    await load()
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(m => (
          <div key={m._id} className={`max-w-md px-3 py-2 rounded-lg ${m.direction === 'outbound' ? 'bg-blue-600/80 text-white ml-auto' : 'bg-slate-800 text-slate-100'}`}>
            {m.text && <div>{m.text}</div>}
            {m.media_item_id && (
              <div className="text-xs opacity-80">Media sent {m.paid && `(★ ${m.price || 0})`}</div>
            )}
          </div>
        ))}
        {messages.length === 0 && <div className="text-slate-500">No messages yet.</div>}
      </div>

      <form onSubmit={sendText} className="p-3 border-t border-slate-800 flex gap-2">
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Type a message" className="flex-1 bg-slate-900 text-slate-100 border border-slate-700 rounded px-3 py-2" />
        <button className="bg-blue-600 hover:bg-blue-500 text-white rounded px-4">Send</button>
      </form>

      <div className="border-t border-slate-800 p-2">
        <div className="text-slate-400 text-xs mb-2">Quick send paid media</div>
        <div className="flex gap-2 overflow-x-auto p-1">
          {media.map(m => (
            <button key={m._id} onClick={() => sendMedia(m._id, m.price)} className="min-w-[140px] bg-slate-800/60 hover:bg-slate-800 border border-slate-700 rounded-lg p-2 text-left">
              <div className="text-slate-200 text-sm truncate">{m.caption || m.type}</div>
              {m.price != null && <div className="text-slate-400 text-xs">★ {m.price}</div>}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function FanPanel() {
  return (
    <div className="w-72 border-l border-slate-800 p-4 space-y-3">
      <div className="text-slate-200 font-medium">Fan Info</div>
      <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3">
        <div className="text-slate-300 text-sm">Profile</div>
        <div className="text-slate-500 text-xs">History, spend, timezone (demo)</div>
      </div>
    </div>
  )
}

export default function Messages({ backendUrl, activeBotId }) {
  const [convos, setConvos] = useState([])
  const [active, setActive] = useState(null)
  const [draftPreview, setDraftPreview] = useState('')

  const load = async () => {
    if (!activeBotId) return
    const res = await fetch(`${backendUrl}/api/conversations?bot_id=${activeBotId}`)
    const data = await res.json()
    setConvos(data)
    if (data.length > 0 && !active) setActive(data[0]._id)
  }

  useEffect(() => { load() }, [activeBotId])

  const createConversation = async (e) => {
    e.preventDefault()
    if (!activeBotId) return
    await fetch(`${backendUrl}/api/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bot_id: activeBotId, fan_id: 'demo-fan', last_message_preview: draftPreview || 'New chat' })
    })
    setDraftPreview('')
    await load()
  }

  return (
    <div className="flex h-[calc(100vh-160px)]">
      <ConversationList items={convos} activeId={active} onSelect={setActive} />
      <Thread backendUrl={backendUrl} conversationId={active} />
      <FanPanel />

      <form onSubmit={createConversation} className="absolute bottom-4 left-4 bg-slate-900/80 border border-slate-700 rounded-lg p-2 flex gap-2">
        <input value={draftPreview} onChange={e => setDraftPreview(e.target.value)} placeholder="Quick create conversation" className="bg-slate-800 text-slate-100 border border-slate-700 rounded px-2 py-1" />
        <button className="bg-blue-600 hover:bg-blue-500 text-white rounded px-3 text-sm">Create</button>
      </form>
    </div>
  )
}
