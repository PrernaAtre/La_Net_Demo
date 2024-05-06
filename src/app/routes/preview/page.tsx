
"use client";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import { useSearchParams } from "next/navigation";
import React from "react";
import { usePage } from "../editor/hooks/usePage";
import "./styles.css";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";

const page = () => {
  const searchParams = useSearchParams();

  const { page } = usePage(searchParams.get("id") || "");

  const editor = useCreateBlockNote(
    {
      domAttributes: {
        // Adds a class to all `blockContainer` elements.
        block: {
          class: "hello-world-block",
        },
      },
      initialContent: page?.document
        ? JSON.parse(page?.document)
        : [
            {
              id: "1",
              type: "heading",
              content: "",
              props: { level: 1 },
            },
          ],
    },
    [page]
  );

  return (
    <>
      <div className="editor-container w-screen h-screen">
        <div className="flex mb-4">
          <p>{page?.name}</p>
        </div>
        <div className="w-full fixed h-full">
          <BlockNoteView
            className="h-full border-none"
            editable={false}
            editor={editor}
          />
        </div>
      </div>
    </>
  );
};

export default page;
