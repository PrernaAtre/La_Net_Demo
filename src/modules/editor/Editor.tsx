"use client";

import Toolbar from "@/components/Toolbar";
import { Publish, SharePage } from "@/components/dashboard";
import Modal from "@/components/modals/Modal";
import { CoverImageModal } from "@/components/modals/cover-image-modal";
import { Spinner } from "@/components/spinner";
import { Page } from "@/store/features/page";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import { Share } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { omit } from "lodash";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useUpdatePage } from "./hooks/useUpdatePage";

interface EditorProps {
  pageId: string;
}

const Editor: React.FC<EditorProps> = ({ pageId }) => {
  const { page, handleUpdatePage, updatedPage, isPageLoading } = useUpdatePage(
    pageId || ""
  );

  const Cover = useMemo(
    () => dynamic(() => import("@components/dashboard/Cover")),
    [updatedPage]
  );

  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setCoverImagePageId(pageId);
  }, [pageId]);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCoverImageOpen, setIsCoverImageOpen] = useState(false);
  const [coverImagePageId, setCoverImagePageId] = useState(pageId);

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
    [page?.document]
  );

  function handleShare(event: any): void {
    event.preventDefault();
    setIsShareModalOpen(true);
  }

  return !isPageLoading ? (
    <div className="w-full h-screen">
      <div className="flex flex-row justify-between items-center sticky w-full h-14 border border-b-gray-400">
        <div className="flex text-center content-center self-center">
          <p className="align-middle text-justify p-2">
            {updatedPage?.name || page?.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Publish />
          <IconButton onClick={handleShare}>
            <Share className="text-muted-foreground" />
          </IconButton>
        </div>
      </div>
      <Cover
        pageId={page?._id}
        url={updatedPage?.coverImage || page?.coverImage}
        setId={setCoverImagePageId}
        setOpen={setIsCoverImageOpen}
      />
      <Toolbar
        name={updatedPage?.name || page?.name}
        coverImageUrl={updatedPage?.coverImage || page?.coverImage}
        onUpdate={handleSubmit}
        onOpen={setIsCoverImageOpen}
      />
      <div className="">
        <BlockNoteView
          editor={editor}
          onChange={() => handleSubmit({ document: editor.document })}
          data-changing-font-demo
          theme={resolvedTheme === "dark" ? "dark" : "light"}
        />
      </div>

      <Modal
        className="text-muted-foreground dark:bg-primary bg-white"
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      >
        <SharePage id={page?._id} onClose={() => setIsShareModalOpen(false)}/>
      </Modal>
      <CoverImageModal
        isOpen={isCoverImageOpen}
        onClose={setIsCoverImageOpen}
        pageId={coverImagePageId}
      />
    </div>
  ) : (
    <div className="h-screen flex justify-center items-center">
      <Spinner />
    </div>
  );
};

export default Editor;
