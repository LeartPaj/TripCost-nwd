import { useState } from 'react'
import './App.css'
import Trip from './trip'
import Banner from './components/Banner'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Banner></Banner>
      <Trip></Trip>
    </>
  )
}

export default App
