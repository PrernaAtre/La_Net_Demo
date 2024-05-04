"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Copy, Globe } from "lucide-react";
import {
    PopoverTrigger,
    Popover,
    PopoverContent
} from "@/components/ui/popover"
import { useOrigin } from "@/hooks/use-origin";
import { Button } from "@/components/ui/button";
import { usePage } from "@/app/routes/editor/hooks/usePage";
import { useUpdatePageMutation } from "@/store/features/page";
import { useSearchParams } from "next/navigation";
import { useUpdatePage } from "@/app/routes/editor/hooks/useUpdatePage";

// interface PublishProps {
//     initialData: Doc<"documents">
// };

export const Publish = ({id}) => {
    const searchParams = useSearchParams();
    const [isPublished, setIsPublished] = useState(false);
    console.log("idddddddddd---",id)
    const { page, handleCreatePage, isPageLoading } = useUpdatePage(
        searchParams.get("id") || ""
      );
   // console.log(page?.id);
    const origin = useOrigin();
    // const { page, isLoading: isPageLoading, error: isPageError } = usePage(id)
    // const [updatePage, { data, isLoading, error }] = useUpdatePageMutation();

    const [copied, setCopied] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const url = `${origin}/preview/${page._id}`;
    console.log("urllllll-",url)

    const onPublish = () => {
        setIsSubmitting(true);
        setIsPublished(true);
        // const promise = update({
        //     id: initialData._id,
        //     isPublished: true,
        // })
        //     .finally(() => setIsSubmitting(false));

        // toast.promise(promise, {
        //     loading: "Publishing...",
        //     success: "Note published",
        //     error: "Failed to publish note.",
        // });
    };

    const onUnpublish = () => {
        setIsSubmitting(true);
        setIsPublished(false);
        // const promise = update({
        //     id: initialData._id,
        //     isPublished: false,
        // })
        //     .finally(() => setIsSubmitting(false));

        // toast.promise({
        //     loading: "Unpublishing...",
        //     success: "Note unpublished",
        //     error: "Failed to unpublish note.",
        // });
    };

    const onCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1000);
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size="sm" variant="ghost">
                    Publish
                    {page.isPublished && (
                        <Globe
                            className="text-sky-500 w-4 h-4 ml-2"
                        />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-72"
                align="end"
                alignOffset={8}
                forceMount
            >
                {isPublished ? (
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
                            disabled={isSubmitting}
                            onClick={onUnpublish}
                        >
                            Unpublish
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <Globe
                            className="h-8 w-8 text-muted-foreground mb-2"
                        />
                        <p className="text-sm font-medium mb-2">
                            Publish this note
                        </p>
                        <span className="text-xs text-muted-foreground mb-4">
                            Share your work with others.
                        </span>
                        <Button
                            disabled={isSubmitting}
                            onClick={onPublish}
                            className="w-full text-xs"
                            size="sm"
                        >
                            Publish
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    )
}