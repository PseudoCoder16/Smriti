import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'

import Landing from './pages/Landing.jsx'
import Auth from './pages/Auth.jsx'
import Home from './pages/patient/Home.jsx'
import GameSelect from './pages/patient/GameSelect.jsx'
import Medicine from './pages/patient/Medicine.jsx'
import Messages from './pages/patient/Messages.jsx'
import Checkin from './pages/patient/Checkin.jsx'
import Progress from './pages/patient/Progress.jsx'
import MemoryMatch from './pages/patient/games/MemoryMatch.jsx'
import PatternGame from './pages/patient/games/PatternGame.jsx'
import DailyRoutine from './pages/patient/games/DailyRoutine.jsx'
import TeaSorting from './pages/patient/games/TeaSorting.jsx'
import ColorSort from './pages/patient/games/ColorSort.jsx'
import RhythmTap from './pages/patient/games/RhythmTap.jsx'
import MusicMemory from './pages/patient/games/MusicMemory.jsx'
import RememberMyStory from './pages/patient/games/RememberMyStory.jsx'
import Dashboard from './pages/caregiver/Dashboard.jsx'

function RequirePatient({ children }) {
  const { session } = useAuth()
  if (!session || session.role !== 'patient') return <Navigate to="/auth" replace />
  return children
}

function RequireCaregiver({ children }) {
  const { session } = useAuth()
  if (!session || session.role !== 'caregiver') return <Navigate to="/auth" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />

      <Route path="/home" element={<RequirePatient><Home /></RequirePatient>} />
      <Route path="/games" element={<RequirePatient><GameSelect /></RequirePatient>} />
      <Route path="/games/memory-match" element={<RequirePatient><MemoryMatch /></RequirePatient>} />
      <Route path="/games/pattern" element={<RequirePatient><PatternGame /></RequirePatient>} />
      <Route path="/games/routine" element={<RequirePatient><DailyRoutine /></RequirePatient>} />
      <Route path="/games/tea-sorting" element={<RequirePatient><TeaSorting /></RequirePatient>} />
      <Route path="/games/color-sort" element={<RequirePatient><ColorSort /></RequirePatient>} />
      <Route path="/games/rhythm-tap" element={<RequirePatient><RhythmTap /></RequirePatient>} />
      <Route path="/games/music-memory" element={<RequirePatient><MusicMemory /></RequirePatient>} />
      <Route path="/games/remember-my-story" element={<RequirePatient><RememberMyStory /></RequirePatient>} />
      <Route path="/medicine" element={<RequirePatient><Medicine /></RequirePatient>} />
      <Route path="/messages" element={<RequirePatient><Messages /></RequirePatient>} />
      <Route path="/checkin" element={<RequirePatient><Checkin /></RequirePatient>} />
      <Route path="/progress" element={<RequirePatient><Progress /></RequirePatient>} />

      <Route path="/dashboard" element={<RequireCaregiver><Dashboard /></RequireCaregiver>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
