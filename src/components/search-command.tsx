"use client";

import { File } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useCurrentUserPages } from "@/modules/editor";
import { Page } from "@/store/features/page";

interface SearchCommandProps {
  isOpen: boolean;
  onClose: (args?: any) => void;
}

export const SearchCommand: React.FC<SearchCommandProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();

  const { pages } = useCurrentUserPages();

  const onSelect = (id: string) => {
    router.push(`/page/${id}`);
    onClose();
  };

  const unTrashedPages = pages?.filter((d: any) => !d?.isTrashed) || [];

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder={`Search pages...`} />
      <CommandList>
        <CommandGroup heading="Pages">
          <CommandEmpty>No results found.</CommandEmpty>
          {unTrashedPages?.map((page: Page) => (
            <CommandItem
              key={page._id}
              value={`${page._id}-${page.name}`}
              title={page.name}
              onSelect={() => onSelect(page._id)}
            >
              <File className="mr-2 h-4 w-4" />

              <span>{page.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
