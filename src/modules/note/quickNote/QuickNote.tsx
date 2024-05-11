"use client"
import { useEffect, useState } from "react";
import { Editor } from 'novel-lightweight';
import { EditorRoot, EditorContent } from "novel";
import { useCreateQuickNote, useQuickNote, useUpdateQuickNote } from "./hooks";


const QuickNote: React.FC = () => {
  const { quickNote } = useQuickNote();
  const { handleCreateQuickNote, isLoading: isPageLoading, error: isPageError } = useCreateQuickNote();
  const { handleUpdateQuickNote } = useUpdateQuickNote();
  const [data, setData] = useState("");
  const [question, setQuestion] = useState("");
  console.log("quickNote----", quickNote?.data);

  // useEffect(()=>{   
  // },[data])
  const handleSubmit = async (payload: any) => {
      return handleUpdateQuickNote({
        data: JSON.stringify(payload),
      });
  };


  return (
    <>
      <Editor
        defaultValue = {data}
        disableLocalStorage={true}
        // onUpdate={(editor) => {
        //   console.log(typeof editor?.storage.markdown.getMarkdown());
        //     if(editor?.storage.markdown.getMarkdown())
        //     {
        //         console.log("if caaling");
        //         setQuestion(editor?.storage.markdown.getMarkdown());
        //     }
        //     setData(editor?.storage.markdown.getMarkdown());

        // }}
        
        onUpdate={(editor) => handleSubmit(editor?.storage.markdown.getMarkdown())}
      />
      {/* <EditorRoot>
        <EditorContent
            {...quickNote}
            onUpdate={(editor) => handleSubmit(editor?.storage.markdown.getMarkdown())}
        />
      </EditorRoot> */}

      <p>que-------{question}</p>
      data------{JSON.stringify(data)}
    </>
  );
};
export default QuickNote;