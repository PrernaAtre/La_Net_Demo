"use client";

import { ImageIcon } from "lucide-react";
import React, { ElementRef, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

import { Button } from "@/components/ui/button";
import { Page } from "@/store/features/page";

interface ToolbarProps {
  name: string;
  coverImageUrl: string;
  preview?: boolean;
  onUpdate?: (page: Partial<Page>) => void;
  onOpen?: (args?: any) => void;
}

const Toolbar = ({
  name,
  coverImageUrl,
  preview,
  onUpdate,
  onOpen,
}: ToolbarProps) => {
  const inputRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [pageName, setPageName] = useState(name);

  useEffect(() => {
    if (name !== pageName) {
      setPageName(name);
    }
  }, [name]);

  const enableInput = () => {
    if (preview) return;

    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  useEffect(() => {
    if (pageName !== name) {
      if (onUpdate) {
        onUpdate({
          name: pageName,
        });
      }
    }
  }, [pageName]);

  const disableInput = () => setIsEditing(false);

  const onInput = (value: string) => {
    setPageName(value);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      disableInput();
    }
  };

  return (
    <div className="pl-[54px] group relative">
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!coverImageUrl && !preview && (
          <Button
            onClick={onOpen}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Add cover
          </Button>
        )}
      </div>
      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={pageName}
          onChange={(e) => onInput(e.target.value)}
          disabled={preview}
          className="text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none"
        />
      ) : (
        <div
          onClick={enableInput}
          className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF]"
        >
          {pageName}
        </div>
      )}
    </div>
  );
};

export default React.memo(Toolbar);
