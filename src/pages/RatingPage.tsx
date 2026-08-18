// import { useState } from 'react'
import EmojiSlider from "../components/EmojiSlider";
import CustomButton from "../components/CustomButton";
import { Link } from "react-router";
const RatingPage = () => {
  //const [rating, setRating] = useState(0)

  return (
    <main className="overscroll-none">
      <div className="pt-36">
        <EmojiSlider />
      </div>
      <div className="flex  items-center justify-center mt-8">
        <div className="flex flex-col w-full">
          {/* <p className="text-xs font-semibold text-gray-600 mb-2">Share Details:</p>
          <textarea className="w-full text-sm text-gray-600 h-36 rounded-3xl bg-white/30 p-4 shadow-sm border-2 border-brand-primary" name="" id=""></textarea> */}
          <Link to="/">
            <CustomButton customClasses="bg-brand-primary w-full mt-6 h-12" label="Submit" onClick={() => {}} />
          </Link>
        </div>
      </div>
    </main>
  );
};

export default RatingPage;
