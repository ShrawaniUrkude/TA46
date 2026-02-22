import { useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { WarehouseDashboard } from './components/Warehouse'
import { HomePage } from './components/HomePage'
import Analytics from './components/Analytics/Analytics'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  const handleNavigate = (page) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  return (
    <div className="app-container">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="content">
        {currentPage === 'home' ? (
          <HomePage onNavigate={handleNavigate} />
        ) : currentPage === 'analytics' ? (
          <Analytics />
        ) : (
          <WarehouseDashboard />
        )}
      </main>
      <Footer />
    </div>
  )
}

export default App
