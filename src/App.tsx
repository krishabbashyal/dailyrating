import './App.css'
import { useState } from 'react'
import EmojiSlider from './components/EmojiSlider'
import GreetingBar from './components/GreetingBar'

const App = () => {

  const [rating, setRating] = useState(0)

  return (
    <main>
      <GreetingBar/>
      <EmojiSlider/>
    </main>
  )
}

export default App