"use client"
import { useEffect, useState } from "react";
import { Editor } from 'novel-lightweight';
import Button from "@mui/material/Button";
import { useTheme } from "next-themes";
import { useGetQuickNoteQuery } from "@/store/features/quickNote";
import { useUpdateQuickNote } from "./hooks";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

const QuickNote: React.FC = () => {
  const { handleUpdateQuickNote } = useUpdateQuickNote();
  const { data, error, isLoading } = useGetQuickNoteQuery("");
  const [solution, setSolution] = useState(data || "");
  const [editorData, setEditorData] = useState(null);
  const { resolvedTheme } = useTheme();
  const [theme, setTheme] = useState(resolvedTheme);
  const [loading, setLoading] = useState(false); // Step 1: Loading state

  useEffect(() => {
    setTheme(resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    if (data?.data) {
      setSolution(data?.data);
    }
  }, [data?.data]);

  const handleSubmit = async (payload: any) => {
    setLoading(true); // Step 2: Set loading to true on submit
    try {
      await handleUpdateQuickNote({
        data: payload,
      });
      setLoading(false); // Step 4: Set loading to false after data is saved
    } catch (error) {
      console.error("Error saving data:", error);
      setLoading(false); // Step 4: Set loading to false in case of error
    }
  };

  return (
    <>
      <Editor
        className="w-[80%] bg-slate-50 ml-5 mt-5"
        defaultValue={solution}
        disableLocalStorage={true}
        onUpdate={(editor) => setEditorData(editor?.storage.markdown.getMarkdown())}
      />
      <div className="bottom-0 left-0 w-full text-center">
        <button className="bg-black w-[8%] p-1 text-white rounded-md pr-[10px]" onClick={() => handleSubmit(editorData)} disabled={loading}>SUBMIT</button>
      </div>
    </>
  );
};

export default QuickNote;
