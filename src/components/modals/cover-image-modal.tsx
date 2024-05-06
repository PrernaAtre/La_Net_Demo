
"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { useUpdatePage } from "@/app/routes/editor/hooks/useUpdatePage";
import { SingleImageDropzone } from "@/components/single-image-dropzone";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useCoverImage } from "@/hooks/use-cover-image";
import { debounce } from "lodash";

export const CoverImageModal = () => {
  const searchParams = useSearchParams();
  const pageId = searchParams.get("id");

  const { handleUpdatePage, page } = useUpdatePage(pageId || "");
  const coverImage = useCoverImage();

  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImage.onClose();
  };

  const onChange = debounce(async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);

      const body = new FormData();
      body.append("file", file);

      const res = await fetch("https://tmpfiles.org/api/v1/upload", {
        method: "POST",
        body: body,
      });

      console.log("pageId", pageId);

      if (page._id) {
        handleUpdatePage({
          id: page._id,
          coverImage: (await res.json()).data.url.replace(
            "tmpfiles.org/",
            "tmpfiles.org/dl/"
          ),
        });
      }
      onClose();
    }
  }, 500);

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Cover Image</h2>
        </DialogHeader>
        <SingleImageDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  );
};
