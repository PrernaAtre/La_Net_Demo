"use client";

import { CoverImageModal } from "@/components/modals/cover-image-modal";
import { useIsMounted } from "@/hooks/use-is-mounted";

export const ModalProvider = () => {
  const isMounted = useIsMounted();

  if (!isMounted()) {
    return null;
  }

  return (
    <>
      <CoverImageModal />
    </>
  );
};
