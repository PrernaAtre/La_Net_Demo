"use client";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/react/style.css";
import { useTheme } from "next-themes";

interface EditorBlockProps {
  onChange: (value: any) => void;
  initialContent?: string;
  editable?: boolean;
}

const EditorBlock: React.FC<EditorBlockProps> = ({
  onChange,
  initialContent,
  editable,
}) => {
  const { resolvedTheme } = useTheme();

  async function uploadFile(file: File) {
    const body = new FormData();
    body.append("file", file);
    const ret = await fetch("https://tmpfiles.org/api/v1/upload", {
      method: "POST",
      body: body,
    });
    return (await ret.json()).data.url.replace(
      "tmpfiles.org/",
      "tmpfiles.org/dl/"
    );
  }

  const editor = useCreateBlockNote({
    uploadFile,
    domAttributes: {
      block: { class: "hello-world-block" },
    },
    initialContent: initialContent
      ? JSON.parse(initialContent)
      : [
          {
            id: "1",
            type: "heading",
            content: "",
            props: { level: 1 },
          },
        ],
  });

  editor.onChange((editor) => {
    onChange({ document: JSON.stringify(editor.document, null, 2) });
  });

  return (
    <div className="">
      <BlockNoteView
        editor={editor}
        editable={editable}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        
      />
    </div>
  );
};

export default EditorBlock;
