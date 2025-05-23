import { useState, useEffect } from "react";
import { uploadFileToS3File } from "./clienttos3.ts";
import { socket } from "./websocket.ts";
import "./App.css"

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
  let [response,showResponse] = useState(false)
  let [aiAnswer, setAiAnswer] = useState("")
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
    
    socket.onmessage = (event) => {
          console.log(event.data)
          const message = JSON.parse(event.data);
          if(message["message"][0]["text"]){
            setAiAnswer(message["message"][0]["text"])
          
          }
          else{
            setAiAnswer(message["message"])
          }
    }
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const file = formData.get("file") as File | null;
    const text = formData.get("text") as string;
    const randomString = generateRandomString(10);

    if (file != null && text.trim() === "") {
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
          bucket: "syallbuswizard",
          key: randomString
        })
      );
    }
  }
    else if (text.trim()) {
      console.log("Text provided:", text);
      // You can send the text to your backend
      showResponse(true)
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            action: "upload-text",
            text:text
          })
        );
    } 
    else {
      alert("Please upload a file or paste the syllabus.");
    }
    
  }
  setAiAnswer("💡Thinking...💡")
}
  if (response){
    return (
      <>
  
          <pre>{aiAnswer}</pre>
      </>

    )
  }
  else{
    return (
    <main>
      <form onSubmit={handleSubmit}>
        <label>📝Upload Syllabus📝: </label> <br/>
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
