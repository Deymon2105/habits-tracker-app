import React from 'react'
import Header from './Header'
import Footer from './Footer'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
      <Header />
      <main className="flex-grow w-full max-w-5xl mx-auto px-6 py-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}
