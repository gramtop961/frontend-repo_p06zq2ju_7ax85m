import { useMemo, useState } from 'react'
import BotTabs from './components/BotTabs'
import TopNav from './components/TopNav'
import Dashboard from './components/Dashboard'
import MediaLibrary from './components/MediaLibrary'
import Messages from './components/Messages'

function App() {
  const backendUrl = useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])
  const [activeBotId, setActiveBotId] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <BotTabs backendUrl={backendUrl} activeBotId={activeBotId} onChange={setActiveBotId} />
      <TopNav active={activeTab} setActive={setActiveTab} />

      {!activeBotId ? (
        <div className="p-8 text-center text-slate-400">Create a bot to get started.</div>
      ) : (
        <div>
          {activeTab === 'dashboard' && (
            <Dashboard backendUrl={backendUrl} activeBotId={activeBotId} />
          )}
          {activeTab === 'messages' && (
            <Messages backendUrl={backendUrl} activeBotId={activeBotId} />
          )}
          {activeTab === 'media' && (
            <MediaLibrary backendUrl={backendUrl} activeBotId={activeBotId} />
          )}
        </div>
      )}
    </div>
  )
}

export default App
