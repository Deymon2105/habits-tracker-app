import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import WeekView from './pages/WeekView'
import DayView from './pages/DayView'

import Layout from './components/layout/Layout'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/week/:weekId" element={<WeekView />} />
        <Route path="/day/:dayId" element={<DayView />} />
      </Routes>
    </Layout>
  )
}
