import React from 'react'

export default function Footer() {
  return (
    <footer className="w-full border-t border-divider py-8 mt-auto bg-gray-50/50 dark:bg-zinc-900/30">
      <div className="max-w-5xl mx-auto px-6 text-center text-sm text-default-500">
        <p>&copy; {new Date().getFullYear()} Habits Tracker App</p>
      </div>
    </footer>
  )
}
