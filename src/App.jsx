import React, { useState, useEffect } from 'react';
import './App.css';


import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: true });

function App() {
  const [ready, setReady]  = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();
  
  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(() => {
    load();
  }, [])

  const convertToGif = async () => {
      //write the file to memory
      ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));
      //run the ffmpeg command
    await ffmpeg.run('-i', 'test.mp4', '-t', '2.5', '-ss', '2.0', '-f', 'gif', 'output.gif');

    //Read the result
    const data = ffmpeg.FS('readFile', 'out.gif');

    // Create a URL
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif'}))
    setGif(url);

  }

  return ready ?(
    <div className="App">
      { video && <video 
      control
      width="250"
  src={URL.createObjectURL(video)}>

      </video> }


    <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />
+  <h3>Result</h3>

        <button onClick={convertToGif}>Convert</button>

        { gif && <img src={gif} />}
        

    </div>
  ) :
  (<p>loading</p>); 
}

export default App;
