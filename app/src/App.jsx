import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ProductSelector from './ProductSelector'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ProductSelector />
    </>
  )
}

export default App
