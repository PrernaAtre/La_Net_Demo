import { create } from "zustand";

type CoverImageStore = {
  url?: string;
  isOpen: boolean;
  id?: string;
  onOpen: () => void;
  onClose: () => void;
  onReplace: (url: string) => void;
  setPageId: (id: string) => void;
};

export const useCoverImage = create<CoverImageStore>((set) => ({
  url: undefined,
  isOpen: false,
  onOpen: () => set({ isOpen: true, url: undefined }),
  onClose: () => set({ isOpen: false, url: undefined }),
  onReplace: (url: string) => set({ isOpen: true, url }),
  setPageId: (id: string) => set({ id }),
}));
