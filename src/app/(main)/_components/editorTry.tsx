"use client";

import { useUpdatePage } from "@/app/routes/editor/hooks/useUpdatePage";
import { Block } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { Share } from "@mui/icons-material";
import "./styles.css"
import MainLayout from "../layout";
import { Publish } from "./publish";
import Image from "next/image";
import { useCurrentUserPages } from "@/app/routes/editor/hooks/useCurrentUserPages";


function EditorTry() {
  const { pages } = useCurrentUserPages();
  const [isEditing, setIsEditing] = useState(false);
  const searchParams = useSearchParams();
  const [pageName, setPageName] = useState("");
  const [url, setUrl] = useState("");

  const { page, handleCreatePage, isPageLoading } = useUpdatePage(
    searchParams.get("id") || ""
  );

  console.log("page------",page);
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
    // setUrl(await ret.json()).data.url.replace(
    //     "tmpfiles.org/",
    //     "tmpfiles.org/dl/")
  }

  const handleSubmit = async (payload: Block[]) => {
    return handleCreatePage({
      id: page?._id,
      name: pageName,
      document: JSON.stringify(payload),
    });
  };

  const editor = useCreateBlockNote(
    {
      uploadFile,
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

  if (isPageLoading) {
    return "Loading content...";
  }

  if (!page) {
    return "Page not found in your library. Please create a new page.";
  }

  // function handlePublish(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
  //   throw new Error("Function not implemented.");
  // }

  function handleShare(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <div className="editor-container w-[90%]">
        <div className="flex mb-4">
          <p>{pageName}</p>
        </div>
        <div>
          <input
            type="text"
            value={pageName}
            onChange={(e) => setPageName(e.target.value)}
            placeholder="Untitled Page"
            className="w-10% p-2 rounded-md border-none focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="w-[40%] fixed">
          <BlockNoteView
            editor={editor}
            onChange={() => handleSubmit(editor.document)}
            data-changing-font-demo
          />
        </div>
      </div>
      <div className="fixed top-4 right-4 flex gap-2">
        <Publish id={page._id} />
        <IconButton onClick={handleShare}>
          <Share />
        </IconButton>
      </div>
    </>
  );
}

export default EditorTry;
