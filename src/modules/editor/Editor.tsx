"use client";

import Modal from "@/components/modals/Modal";
import Toolbar from "@/components/Toolbar";
import { useCoverImage } from "@/hooks/use-cover-image";
import { Page } from "@/store/features/page";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import { Share } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { omit } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { SharePage } from "../note";
import { Cover } from "../note/Cover";
import { Publish } from "../note/Publish";
import { useUpdatePage } from "./hooks/useUpdatePage";

interface EditorProps {
  pageId: string;
}

const Editor: React.FC<EditorProps> = ({ pageId }) => {
  const coverImage = useCoverImage();

  useEffect(() => {
    coverImage.setPageId(pageId);
  }, [pageId]);

  const { page, handleUpdatePage, updatedPage } = useUpdatePage(pageId || "");

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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

  const handleSubmit = useCallback(
    async (payload: Partial<Page>) => {
      return handleUpdatePage({
        id: page?._id,
        ...omit(payload, ["document"]),
        document: JSON.stringify(payload.document),
      });
    },
    [page]
  );

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
        ? page?.document
        : [
            {
              id: "1",
              type: "heading",
              content: "",
              props: { level: 1 },
            },
          ],
    },
    [page?.document]
  );

  if (!page) {
    return "Page not found in your library. Please create a new page.";
  }

  function handleShare(event: any): void {
    event.preventDefault();
    setIsShareModalOpen(true);
  }

  return (
    <>
      <div className="w-full h-screen">
        <div className="flex flex-row justify-between items-center sticky w-full h-14 border border-b-gray-400">
          <div className="flex text-center content-center self-center">
            <p className="align-middle text-justify p-2">
              {updatedPage?.name || page?.name}
            </p>
          </div>
          <div className="flex gap-2">
            <Publish id={page._id} />
            <IconButton onClick={handleShare}>
              <Share className="text-white" />
            </IconButton>
          </div>
        </div>
        <Cover pageId={page?._id} url={page?.coverImage} />
        <Toolbar
          name={updatedPage?.name || page.name}
          coverImageUrl={updatedPage?.coverImage || page.coverImage}
          onUpdate={handleSubmit}
        />
        <div className="">
          <BlockNoteView
            editor={editor}
            onChange={() => handleSubmit({ document: editor.document })}
            data-changing-font-demo
          />
        </div>
        <Modal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
        >
          <SharePage />
        </Modal>
      </div>
    </>
  );
};

export default Editor;
