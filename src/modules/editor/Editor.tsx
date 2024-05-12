"use client";
import Toolbar from "@/components/Toolbar";
import { Cover, Publish, SharePage } from "@/components/dashboard";
import Modal from "@/components/modals/Modal";
import { CoverImageModal } from "@/components/modals/cover-image-modal";
import { Spinner } from "@/components/spinner";
import { Page } from "@/store/features/page";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { Share } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import dynamic from "next/dynamic";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useUpdatePage } from "./hooks/useUpdatePage";

interface EditorProps {
  pageId: string;
}

const Editor: React.FC<EditorProps> = ({ pageId }) => {
  const { page, handleUpdatePage, updatedPage, isPageLoading } = useUpdatePage(
    pageId || ""
  );

  const EditorBlock = useMemo(
    () => dynamic(() => import("./EditorBlock"), { ssr: false }),
    []
  );

  useEffect(() => {
    setCoverImageUrl(page?.coverImage || "");
  }, [page]);

  const MemoizedCover = memo(Cover);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCoverImageOpen, setIsCoverImageOpen] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState(
    page?.coverImage || updatedPage?.coverImage
  );

  const memoizedUrl = useMemo(() => coverImageUrl, [coverImageUrl]);

  const handleChange = useCallback(
    async (payload: Partial<Page>) => {
      const updatedPage = await handleUpdatePage({
        id: page?._id,
        ...payload,
      });

      if (payload.coverImage) {
        setCoverImageUrl(payload.coverImage || "");
      }

      return updatedPage;
    },
    [page, handleUpdatePage]
  );

  function handleShare(event: any): void {
    event.preventDefault();
    setIsShareModalOpen(true);
  }

  return !isPageLoading ? (
    <div className="w-full h-screen overflow-y-scroll pb-10">
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
      <MemoizedCover
        pageId={page?._id}
        url={memoizedUrl}
        setUrl={setCoverImageUrl}
        setOpen={setIsCoverImageOpen}
      />
      <Toolbar
        name={updatedPage?.name || page?.name}
        coverImageUrl={memoizedUrl}
        onUpdate={handleChange}
        onOpen={setIsCoverImageOpen}
      />
      <EditorBlock onChange={handleChange} initialContent={page?.document} />
      <Modal
        className="text-muted-foreground dark:bg-primary bg-white"
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      >
        <SharePage id={page?._id} onClose={() => setIsShareModalOpen(false)} />
      </Modal>
      <CoverImageModal
        isOpen={isCoverImageOpen}
        onClose={setIsCoverImageOpen}
        handleUpdatePage={handleChange}
      />
    </div>
  ) : (
    <div className="h-screen flex justify-center items-center">
      <Spinner />
    </div>
  );
};

export default Editor;
