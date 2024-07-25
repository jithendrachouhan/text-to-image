import { useRef, useState } from "react"
import axios from 'axios'
import { API_KEY, BASE_URL } from "./constants";

const App = () => {

  const [error, setError] = useState('')
  const [imageSrc, setImageSrc] = useState('');
  const [loading, setLoading] = useState(false)

  const inputRef = useRef();

  const handleGenerateButton = () => {
    setError('');
    if(inputRef.current.value) {
      console.log(inputRef.current.value)
      const payload = {
        prompt: inputRef.current.value,
        output_format: "webp"
      }
      getDataFromServer(payload);
    } 
    else setError('prompt should not be empty')
  } 

  const getDataFromServer = async (payload) => {
    setLoading(true)
    setImageSrc('')
    try {
      const response = await axios.postForm(
        BASE_URL,
        axios.toFormData(payload, new FormData()),
        {
          validateStatus: undefined,
          responseType: "blob",
          headers: { 
            Authorization: API_KEY, 
            Accept: "image/*" 
          },
        },
      );
      if (response.status === 200) {
        console.log(response.data)
        const imageBlob = response.data;
        const imageUrl = URL.createObjectURL(imageBlob);
        setImageSrc(imageUrl);
      } else {
        throw new Error(` here is the error coming from ${response.status}: ${response.data.toString()}`);
      }
    } catch (error) {
      console.log('error from catch block', error)
    } finally {
      setLoading(false)
    }
  }


  return <div className="bg-custom h-[100vh] w-[100vw] flex-col flex items-center justify-center ">
    <h1 className="text-white text-4xl font-bold">Text to Image Generator</h1>
    <div className="mt-10">
      <input className="border-2 px-10 py-2 rounded-lg border-red-400 " placeholder="Enter your text here.." ref={inputRef}/>
      <button className="bg-red-400 px-10 py-2 rounded-lg ml-5" onClick={handleGenerateButton}>Generate</button>
      {error && <h1>{error}</h1>}
    </div>
    <div className="mt-10">
      {imageSrc ? <img className="h-[500px] w-[500px]"  src={imageSrc} alt="Generated" /> 
      : <div className="h-[500px] w-[500px] flex justify-center items-center">
        {loading && <h1 className="text-white text-2xl" >Loading....</h1>}
      </div>}
    </div>
  </div>
}

export default App