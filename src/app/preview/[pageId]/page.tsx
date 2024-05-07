"use client";
import Toolbar from "@/components/Toolbar";
import { usePage } from "@/modules/editor";
import { Cover } from "@/modules/note";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import React from "react";

interface PageProps {
  params: {
    pageId: string;
  };
}

const page: React.FC<PageProps> = ({ params }) => {
  const { pageId } = params;

  const { page } = usePage(pageId || "");

  const editor = useCreateBlockNote(
    {
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

  return (
    <>
      <div className="editor-container w-full h-screen">
        <Cover pageId={pageId!} preview url={page?.coverImage} />

        <div className="h-screen">
          <Toolbar preview name={page?.name} coverImageUrl={page?.coverImage} />
          <BlockNoteView
            className="h-screen"
            editor={editor}
            editable={false}
            data-changing-font-demo
          />
        </div>
      </div>
    </>
  );
};

export default page;
