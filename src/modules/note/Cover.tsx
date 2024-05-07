"use client";

import { ImageIcon, X } from "lucide-react";
import Image from "next/image";

import { useUpdatePage } from "@/modules/editor/hooks/useUpdatePage";
import { Button } from "@/components/ui/button";
import { useCoverImage } from "@/hooks/use-cover-image";
import { cn } from "@/lib/utils";

interface CoverImageProps {
  url?: string;
  preview?: boolean;
  pageId?: string;
}

export const Cover = ({ url, preview, pageId }: CoverImageProps) => {
  const coverImage = useCoverImage();
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
            onClick={() => coverImage.onReplace(url!)}
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

Cover.Skeleton = function CoverSkeleton() {
  return (
    <div className="w-full h-[35vh] bg-gray-200 animate-pulse">
      <div className="w-full h-full bg-gray-300" />
    </div>
  );
};
