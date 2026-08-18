import './App.css'
// import { useState } from 'react'
import EmojiSlider from './components/EmojiSlider'
import GreetingBar from './components/GreetingBar'
import CustomButton from './components/CustomButton'

const App = () => {

  //const [rating, setRating] = useState(0)

  return (
    <main>
      <div className="pt-16">
        <GreetingBar/>
        <EmojiSlider/>
      </div>
      <div className="flex flex-row items-center justify-center mt-12">
        <CustomButton customClasses="bg-brand-primary w-full mx-8 h-12" label="Submit" onClick={() => {}}/>
      </div>
    </main>
  )
}

export default App