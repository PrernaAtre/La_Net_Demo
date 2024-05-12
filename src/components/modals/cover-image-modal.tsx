"use client";

import { useState } from "react";

import { SingleImageDropzone } from "@/components/single-image-dropzone";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { debounce } from "lodash";

interface CoverImageModalProps {
  isOpen: boolean;
  onClose: (args?: any) => void;
  handleUpdatePage: (args?: any) => void;
}

export const CoverImageModal: React.FC<CoverImageModalProps> = ({
  isOpen,
  onClose,
  handleUpdatePage,
}) => {
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOnClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    onClose();
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

      handleUpdatePage({
        coverImage: (await res.json()).data.url.replace(
          "tmpfiles.org/",
          "tmpfiles.org/dl/"
        ),
      });
      handleOnClose();
    }
  }, 500);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
