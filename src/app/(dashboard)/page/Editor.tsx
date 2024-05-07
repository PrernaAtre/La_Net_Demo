"use client";

import { useCoverImage } from "@/hooks/use-cover-image";
import { Block } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import { Publish, Share } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Cover } from "../_components/cover";
import { useUpdatePage } from "./hooks/useUpdatePage";
// import "./styles.css";

function Editor() {
  const searchParams = useSearchParams();

  const coverImage = useCoverImage();

  const pageId = searchParams.get("id");

  const { page, handleUpdatePage } = useUpdatePage(pageId || "");

  const [pageName, setPageName] = useState(page?.name || "");

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

  const handleSubmit = async (payload: Block[]) => {
    return handleUpdatePage({
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

  useEffect(() => {
    if (page && pageName !== page.name) {
      handleUpdatePage({
        name: pageName,
      });
    }
  }, [pageName]);

  useEffect(() => {
    if (!pageName && page?.name) {
      setPageName(page.name);
    }
  }, [page?.name]);

  if (!page) {
    return "Page not found in your library. Please create a new page.";
  }

  // function handlePublish(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
  //   throw new Error("Function not implemented.");
  // }

  function handleShare(event: any): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <div className="editor-container w-full h-full">
        <div className="flex mb-4">
          <p>{pageName}</p>
        </div>
        <Cover pageId={pageId!} preview url={page.coverImage} />
        <div>
          <input
            type="text"
            value={pageName}
            onChange={(e) => setPageName(e.target.value)}
            placeholder="Untitled Page"
            className="w-10% p-2 rounded-md border-none focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <Button type="button" variant="contained" onClick={coverImage.onOpen}>
            add cover
          </Button>
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

export default Editor;
