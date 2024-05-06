"use client"
import EditorJS from '@editorjs/editorjs';
import Quote from '@editorjs/quote';
// // editorComponent.js
// import { useEffect, useState } from 'react'; // or your preferred framework/library
// import EditorJS from '@editorjs/editorjs';

const EditorComponent = () => {
    const editor = new EditorJS({
        /** 
         * Id of Element that should contain the Editor 
         */
        // tools: {
        //     ...
        //     quote: {
        //       class: Quote,
        //       inlineToolbar: true,
        //       shortcut: 'CMD+SHIFT+O',
        //       config: {
        //         quotePlaceholder: 'Enter a quote',
        //         captionPlaceholder: 'Quote\'s author',
        //       },
        //     },
        //   },
        holder: 'editorjs',
        tools: {
            ...
            quote : Quote,
          },
       
    })
//   const [editor, setEditor] = useState(null);

//   useEffect(() => {
//     const initEditor = async () => {
//       const ed = new EditorJS({
//         holder: 'editorjs',
//         autofocus: true,
//         onReady: () => {
//           setEditor(ed);
//         },
//         // Add other configuration options as needed
//       });
//     };
//     initEditor();
//   }, []);

//   useEffect(() => {
//     if (editor) {
//       const handleKeyDown = (event) => {
//         // Check if the Tab key is pressed
//         if (event.code === 'Tab') {
//           event.preventDefault(); // Prevent the default Tab behavior
//           handleTabAction(); // Call the function to handle the action
//         }
//       };

//       // Add the onKeyDown hook to Editor.js
//       editor.configuration.hooks.editorKeyDown.push(handleKeyDown);

//       // Cleanup function to remove event listener
//       return () => {
//         // Remove the hook when the component unmounts
//         editor.configuration.hooks.editorKeyDown = editor.configuration.hooks.editorKeyDown.filter(hook => hook !== handleKeyDown);
//       };
//     }
//   }, [editor]);

//   const handleTabAction = () => {
//     console.log('Tab key pressed!');
//     // Perform any other action you want here
//   };

   return <div id="editorjs"></div>;

};

export default EditorComponent;



