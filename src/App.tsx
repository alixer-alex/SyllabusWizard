import { useState } from "react";
//import type { Schema } from "../amplify/data/resource";
//import { generateClient } from "aws-amplify/data";
//import { uploadData } from 'aws-amplify/storage';

//const client = generateClient<Schema>();
import { uploadFileToS3File } from "./clienttos3.ts"

function App() {
  var [response,showResponse] = useState(false)
  var [aiAnswer, setAiAnswer] = useState("")
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const file = formData.get("file") as File | null;
    const text = formData.get("text") as string;

    console.log(file instanceof Blob);  // Should log true
    console.log(file instanceof File);  // Should log true for file input

    if (file) {
      // Example: create an object URL just for preview or upload
      //const fileURL = URL.createObjectURL(file);
      //console.log("Uploaded file URL:", fileURL);
      // You can then send the file to your backend
      uploadFileToS3File("syallbuswizard","syllubus",file)
      showResponse(true)
      setAiAnswer("HELLO")
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
