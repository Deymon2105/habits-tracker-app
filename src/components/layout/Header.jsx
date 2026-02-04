import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo-habits-tracker-app.png'

export default function Header() {
  return (
    <header className="w-full border-b border-divider bg-white/50 dark:bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
           <img 
            src={logo} 
            alt="Habits Tracker Logo" 
            className="h-16 w-auto object-contain hover:scale-105 transition-transform duration-300"
           />
        </Link>
        
        {/* Placeholder for future nav items or user profile */}
        <div className="flex items-center gap-4">
           {/* Add user menu or theme toggle here later */}
        </div>
      </div>
    </header>
  )
}
