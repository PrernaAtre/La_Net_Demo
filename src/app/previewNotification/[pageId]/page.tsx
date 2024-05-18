"use client";
import Toolbar from "@/components/Toolbar";
import { Cover } from "@/components/dashboard";
import { usePage } from "@/modules/editor";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/react/style.css";
import { useTheme } from "next-themes";
import Image from "next/image";
import React from "react";

interface PageProps {
  params: {
    pageId: string;
  };
}

const page: React.FC<PageProps> = ({ params }) => {
  const { pageId } = params;
  const { resolvedTheme } = useTheme();

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
      {page?._id ? (
        <div className="editor-container w-full h-screen">
          <Cover
            pageId={pageId!}
            preview
            url={page?.coverImage}
            setOpen={(d: boolean) => {}}
            setUrl={(d) => {}}
          />

          <div className="h-screen">
            <Toolbar
              preview
              name={page?.name}
              coverImageUrl={page?.coverImage}
            />
            <BlockNoteView
              className="h-screen"
              editor={editor}
              editable={false}
              theme={resolvedTheme === "dark" ? "dark" : "light"}
              data-changing-font-demo
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <Image
            src="/error.png"
            className="dark:hidden block"
            height="300"
            width="300"
            alt="error"
          />
          <Image
            src="/error-dark.png"
            className="hidden dark:block"
            height="300"
            width="300"
            alt="error"
          />
          <h2 className="text-lg font-medium">Page not found</h2>
        </div>
      )}
    </>
  );
};

export default page;
