import { FaRegBookmark } from "react-icons/fa";
import avtarImg from './assets/avtarImg.png';
import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import { Navigate } from "react-router-dom";

const Hero = () => {
  const [word, setWord] = useState('');
  console.log(word);


  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedWord = word.trim();
    if (!trimmedWord || trimmedWord.includes(' ')) return;
    <Navigate to={`/search/${trimmedWord}`} />;

  };




  return (
    <div className="flex justify-center items-center flex-col gap-5 p-10 h-[90vh]">

      {/* hero section image  */}
      <div className="img">
        <img src={avtarImg} alt="Book" className="bg-transparent w-[15rem]" />
      </div>

      {/* user input section */}
      <div className="content flex flex-col justify-center items-center gap-5">
        <h2 className="text-3xl font-bold">Dictionary</h2>
        <p className="text-slate-600 text-[18px] selection:bg-yellow-300 selection:text-black">
          Search for your <span className="text-blue-700 font-bold no-underline selection:text-red-600">Urdu word</span> & save it in this computer's mind &#128511;
        </p>

        {/* Input section */}
        <div className="input flex flex-col justify-center items-center gap-5">
          <form onSubmit={handleSubmit} className="flex gap-3 justify-center items-center">
            <input
              value={word}
              onChange={(event) => setWord(event.target.value)}
              type="search"
              placeholder="Search in Urdu | Roman Urdu"
              className="border border-black focus:border-none px-6 py-3 w-[300px] shadow-lg rounded-md focus:bg-gray-100"
              id="searchInput"
            />
            <button type="submit" className="text-2xl flex items-center justify-center gap-3">
              Submit<FaSearch />
            </button>
          </form>

          {/* bookmark the word  */}
          <FaRegBookmark className="text-4xl hover:cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
