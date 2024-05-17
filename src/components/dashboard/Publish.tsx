"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useOrigin } from "@/hooks/use-origin";
import { usePublishPage } from "@/modules/editor/hooks/usePublishPage";
import { useCurrentUser } from "@/modules/hooks";
import { useCreateSubscription } from "@/modules/user/hooks/useCreateSubsciption";
import { Check, Copy, Globe } from "lucide-react";
import { useState } from "react";

const Publish = () => {
  const { user } = useCurrentUser();

  const { page, handlePublishPage, isLoading } = usePublishPage();

  const { handleClick } = useCreateSubscription();

  const origin = useOrigin();

  const [copied, setCopied] = useState(false);

  const url = `${origin}/preview/${page?.publishId}`;

  const handlePublishChange = async (isPublished = false) => {
    await handlePublishPage(page?._id, isPublished);
  };

  const onCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return user?.isSubscribed ? (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="default">
          Publish
          {!!page?.publishId}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
        {!!page?.publishId ? (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <Globe className="text-sky-500 animate-pulse h-4 w-4" />
              <p className="text-xs font-medium text-sky-500">
                This note is live on web.
              </p>
            </div>
            <div className="flex items-center">
              <input
                className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate"
                value={url}
                disabled
              />
              <Button
                onClick={onCopy}
                disabled={copied}
                className="h-8 rounded-l-none"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              size="sm"
              className="w-full text-xs"
              disabled={isLoading}
              onClick={() => handlePublishChange(true)}
            >
              Unpublish
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Globe className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium mb-2">Publish this note</p>
            <span className="text-xs text-muted-foreground mb-4">
              Share your work with others.
            </span>
            <Button
              onClick={() => handlePublishChange()}
              className="w-full text-xs"
              size="sm"
              variant="default"
            >
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  ) : (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="default">
          Publish
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upgrade to publish</DialogTitle>
          <DialogDescription>
            You need to upgrade to publish your notes.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Button size="sm" onClick={handleClick}>
            Upgrade
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Publish;
