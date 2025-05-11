import { useState, useEffect } from "react";
import { uploadFileToS3File } from "./clienttos3.ts";
import { socket } from "./websocket.ts";

function generateRandomString(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}



function App() {
  var [response,showResponse] = useState(false)
  var [aiAnswer, setAiAnswer] = useState("")
  useEffect(() => {
    // Ensure socket is connected when app loads
    if (socket.readyState === WebSocket.OPEN) {
      console.log("WebSocket already open");
    } else {
      socket.onopen = () => {
        console.log("WebSocket connection established");
      };
    }
    }, []);
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const file = formData.get("file") as File | null;
    const text = formData.get("text") as string;
    const randomString = generateRandomString(10);
    console.log(randomString);

    console.log(file instanceof Blob);  // Should log true
    console.log(file instanceof File);  // Should log true for file input
    if (file) {
      // Example: create an object URL just for preview or upload
      //const fileURL = URL.createObjectURL(file);
      //console.log("Uploaded file URL:", fileURL);
      // You can then send the file to your backend
      uploadFileToS3File("syallbuswizard",randomString,file)
      showResponse(true)
      if (socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          action: "upload-syllabus",
          bucket: "syllabuswizard",
          key: randomString,
        })
      );
      socket.onmessage = (event) => {
        setAiAnswer(event.data)   
      }
      } else {
          console.warn("WebSocket is not open");
      }
    }
    else if (text.trim()) {
      console.log("Text provided:", text);
      // You can send the text to your backend
      showResponse(true)
      setAiAnswer("HELLO")
    } 
    else {
      alert("Please upload a file or paste the syllabus.");
    }
  }
  if (response){
    return (
      <>
        <p>
          {aiAnswer}
        </p>
      </>

    )
  }
  else{
    return (
    <main>
      <form onSubmit={handleSubmit}>
        <label>Upload Syllabus: </label> <br/>
        <input type = "file" name = "file"/><br/>
        <label> Or Paste In Syllubus</label><br/>
        <textarea name="text"> </textarea><br/>
        <input type = "submit" value = "Submit"/>
      </form>
    </main>
  );
  }
  
}

export default App;
