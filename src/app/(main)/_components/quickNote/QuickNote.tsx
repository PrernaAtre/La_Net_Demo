"use client"
import React, { useState } from 'react'
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";

// type StyledText = {
//   type: "text";
//   text: string;
//   styles: Styles;
// };


export const QuickNote = () => {
  const [textInput, setTextInput] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);

  // Function to handle text input change
  const handleInputChange = (event) => {
      const value = event.target.value;
      setTextInput(value);
      // Enable the button if there's some text input
      setButtonDisabled(value.trim() === '');
  };

  // Function to handle button click
  const handleButtonClick = () => {
      // Handle button click action here
      console.log('Button clicked');
  };

  return (
      <>
          <input 
              type='text' 
              placeholder='Write Something To Ask Ai.....' 
              className='p-1' 
              value={textInput} 
              onChange={handleInputChange}
          />
          <button 
              onClick={handleButtonClick} 
              disabled={buttonDisabled}
          >
              Go.
          </button>
      </>
  );
};


// export const QuickNote = () => {
//   // const editor = useCreateBlockNote({
//   //   initialContent: [
//   //     {
//   //       type: "paragraph",
//   //       content: "Write Something Here.....",
//   //     },
//   //   ],
//   // });
//   // console.log(editor);
//     // const editor = useCreateBlockNote();
//     // function handleBlockNoteChange(): void {
       
//     // }

//     return (
//         <>
//            <input type='text' placeholder='Write Something To Ask Ai.....' className='p-1'></input>
//         </>
//     )
// }

// import { Block } from "@blocknote/core";
// import "@blocknote/core/fonts/inter.css";
// import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
// import "@blocknote/react/style.css";
// import { useState } from "react";
 
// import "./styles.css";
 
// export default function QuickNote() {
//   // Stores the document JSON.
//   const [blocks, setBlocks] = useState<Block[]>([]);
 
//   // Creates a new editor instance.
//   const editor = useCreateBlockNote({
//     initialContent: [
//       {
//         type: "paragraph",
//         content: "Welcome to this demo!",
//       },
//       {
//         type: "heading",
//         content: "This is a heading block",
//       },
//       {
//         type: "paragraph",
//         content: "This is a paragraph block",
//       },
//       {
//         type: "paragraph",
//       },
//     ],
//   });
 
//   // Renders the editor instance and its document JSON.
//   return (
//     <div className={"wrapper"}>
//       <div>BlockNote Editor:</div>
//       <div className={"item"}>
//         <BlockNoteView
//           editor={editor}
//           onChange={() => {
//             // Saves the document JSON to state.
//             setBlocks(editor.document);
//           }}
//         />
//       </div>
//     </div>
//   );
// }
 
