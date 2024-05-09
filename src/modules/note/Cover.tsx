"use client";

import { ImageIcon, X } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUpdatePage } from "@/modules/editor/hooks/useUpdatePage";

interface CoverImageProps {
  url?: string;
  preview?: boolean;
  pageId?: string;
  setId: (args?: any) => void;
  setOpen: (open: boolean) => void;
}

const Cover = ({ url, preview, pageId, setId, setOpen }: CoverImageProps) => {
  const { handleUpdatePage } = useUpdatePage(pageId);

  const onRemove = async () => {
    await handleUpdatePage({
      coverImage: null,
    });
  };

  return (
    <div
      className={cn(
        "relative w-full h-[35vh] group",
        !url && "h-[12vh]",
        url && "bg-muted"
      )}
    >
      {!!url && <Image src={url} fill alt="Cover" className="object-cover" />}
      {url && !preview && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button
            onClick={() => {
              setId(url);
              setOpen(true);
            }}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Change cover
          </Button>
          <Button
            onClick={onRemove}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <X className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cover;
