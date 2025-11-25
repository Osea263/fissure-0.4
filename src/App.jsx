import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Trivia from './Trivia.jsx' // 
import { WalletCheckerScreen } from './screens/WalletCheckerScreen.jsx' 

function App() {
  return (
    <Routes>
      
      <Route path="/" element={<Trivia />} />
      
      
      <Route path="/walletchecker" element={<WalletCheckerScreen />} />
    </Routes>
  )
}

export default App