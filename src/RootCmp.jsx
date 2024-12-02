import { BrowserRouter as Router } from 'react-router-dom'
import { Route, Routes } from 'react-router-dom'

import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'
import { Home } from './pages/Home.jsx'
import { BugIndex } from './pages/BugIndex.jsx'
import { BugDetails } from './pages/BugDetails.jsx'
import { UserDetails } from "./pages/UserDetails.jsx"
import { UserIndex } from "./pages/UserIndex.jsx"
import { AboutUs } from './pages/AboutUs.jsx'

export function RootCmp() {
  return (
    <Router>
      <div className='main-app'>
        <AppHeader />
        <main className='container'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bug" element={<BugIndex />} />
            <Route path="/bug/:bugId" element={<BugDetails />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/user/:userId" element={<UserDetails />} />
            <Route path="/users" element={<UserIndex />} />
          </Routes>
        </main>
        <AppFooter />
      </div>
    </Router>
  )
}