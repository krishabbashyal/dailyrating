import './App.css'
import { useState } from 'react'
import EmojiSlider from './components/EmojiSlider'

const App = () => {

  const [rating, setRating] = useState(0)

  return (
    <main>
      <div className="text-center mt-24">
        <h1>Title Heading</h1>
        <p>Rating Prompt</p>
      </div>

      <EmojiSlider/>

      <p className="py-8">Selected: {rating}</p>

      <textarea
        placeholder="What happened today?"
      />

      <button>Save Day</button>
    </main>
  )
}

export default App