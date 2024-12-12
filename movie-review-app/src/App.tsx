import { useEffect, useState } from 'react';
import './App.css'

function App() {
  // const [data, setData] = useState([]);
  // useEffect(() => {
  //   fetch('http://localhost:3000/movies')
  //   .then(res => res.json())
  //   .then(data => setData(data))
  // }, [])
  // console.log(data);
  return (
    <>
      <h1 className="text-3xl font-bold">Hi!</h1>
      <button
        className="inline-block cursor-pointer rounded-md bg-gray-800 px-4 py-3 text-center text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-gray-900">
        Button
      </button>
    </>
  )
}

export default App
