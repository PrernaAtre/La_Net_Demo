"use client"
import { useEffect, useState } from "react";
import { Editor } from 'novel-lightweight';
import { useTheme } from "next-themes";
import { useGetQuickNoteQuery } from "@/store/features/quickNote";
import { useUpdateQuickNote } from "./hooks";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";


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
        className="w-[80%] h-[80%] ml-5 mt-5"
        defaultValue={solution}
        disableLocalStorage={true}
        onUpdate={(editor) => setEditorData(editor?.storage.markdown.getMarkdown())}
      />
      <div>
      <Button
      style={{backgroundColor:"black"}}
        type="submit"
        // variant="default"
        className="flex w-[10%] justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {isLoading ? (
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          "Save Changes"
        )}
      </Button>
      </div>
    </>
  );
};

export default QuickNote;
